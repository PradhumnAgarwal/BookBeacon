import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Id } from "./_generated/dataModel";
import { embed } from "./notes";
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : ""
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const hasOrgAccess = async (
  ctx: MutationCtx | QueryCtx,
  orgId: string
) => {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  // console.log("user id" + userId)
  // console.log("org id" + orgId)
  if (!userId) {
    return false;
  }

  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_orgId_userId", (q) =>
      q.eq("orgId", orgId).eq("userId", userId)
    )
    .first();
  // console.log("mem" + membership)
  return !!membership;
};
export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">
) {
  const userID = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  if (!userID) {
    return null;
  }
  const document = await ctx.db.get(documentId);
  if (!document) {
    return null;
  }

  if (document.ordId) {
    const isMember = await hasOrgAccess(ctx, document.ordId);
    if (!isMember) return null;
  } else {
    if (document.tokenIdentifier !== userID) {
      return null;
    }
  }
  return { document, userID };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const getDocuments = query({
  args: { ordId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userID = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userID) {
      return undefined;
    }
    if (args.ordId) {
      const isMember = await hasOrgAccess(ctx, args.ordId);
      if (!isMember) return undefined;
      return await ctx.db
        .query("documents")
        .withIndex("by_orgId", (q) => q.eq("ordId", args.ordId))
        .order("desc")
        .collect();
    } else {
      return await ctx.db
        .query("documents")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userID))
        .order("desc")
        .collect();
    }
  },
});

export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);
    if (!accessObj) {
      return null;
    }

    return {
      ...accessObj.document,
      documentURL: await ctx.storage.getUrl(accessObj.document.fileID),
    };
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    fileID: v.id("_storage"),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userID = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userID) {
      throw new Error("Please Complete your login first.");
    }

    let documentId: Id<"documents">;
    if (args.orgId) {
      const isMember = await hasOrgAccess(ctx, args.orgId);
      if (!isMember) throw new Error("You are not a part of this organization");

      documentId = await ctx.db.insert("documents", {
        title: args.title,
        description: "",
        fileID: args.fileID,
        ordId: args.orgId,
      });
    } else {
      documentId = await ctx.db.insert("documents", {
        title: args.title,
        tokenIdentifier: userID,
        description: "",
        fileID: args.fileID,
      });
    }

    await ctx.scheduler.runAfter(0, internal.documents.fillInDescription, {
      fileId: args.fileID,
      documentId: documentId,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const fillInDescription = internalAction({
  args: {
    fileId: v.id("_storage"),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.storage.get(args.fileId);
    if (!file) throw new ConvexError("File not found");

    const fileText = await file.text();

    const result =
      await model.generateContent(`Given the following content please generate a one line description for this file.
      
        content: ${fileText}

      `);
    const response = result.response;
    const text = response.text();
    const embedding = await embed(text);

    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      text: text,
      embedding,
    });

    // return text;
  },
});

export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      description: args.text,
      embedding: args.embedding,
    });
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      }
    );

    if (!accessObj) throw new ConvexError("You don't have access!");

    const file = await ctx.storage.get(accessObj.document.fileID);
    if (!file) throw new ConvexError("File not found");

    const fileText = await file.text();

    const result =
      await model.generateContent(`Given the following content please answer the following question. If needed add content based on your own knowlwdge.
      
        content: ${fileText}

        Question: ${args.question}
      `);
    const response = result.response;
    const text = response.text();

    await ctx.runMutation(internal.chats.createChatRecords, {
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: accessObj.userID,
    });

    await ctx.runMutation(internal.chats.createChatRecords, {
      documentId: args.documentId,
      text: text,
      isHuman: false,
      tokenIdentifier: accessObj.userID,
    });

    return text;
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);
    if (!accessObj) return new ConvexError("Ypu don't have access!");

    await ctx.storage.delete(accessObj.document.fileID);
    await ctx.db.delete(args.documentId);
  },
});
