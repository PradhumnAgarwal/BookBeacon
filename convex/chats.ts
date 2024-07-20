import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { hasAccessToDocument } from "./documents";

export const createChatRecords = internalMutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
    isHuman: v.boolean(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chat", {
      documentId: args.documentId,
      text: args.text,
      isHuman: args.isHuman,
      tokenIdentifier: args.tokenIdentifier,
    });
  },
});

export const getChatsForDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const userID = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userID) return [];
    return await ctx.db
      .query("chat")
      .withIndex("by_documentId_tokenIdentifier", (q) =>
        q.eq("documentId", args.documentId).eq("tokenIdentifier", userID)
      )
      .collect();
  },
});

// export const deleteChatsForDocument = mutation({
//   args: {
//     documentId: v.id("documents"),
//     tokenIdentifier: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const accessObj = await hasAccessToDocument(ctx, args.documentId);
//     if (!accessObj) return new ConvexError("Ypu don't have access!");
//     const chats = await ctx.db
//       .query("chat")
//       .withIndex("by_documentId_tokenIdentifier", (q) =>
//         q
//           .eq("documentId", args.documentId)
//           .eq("tokenIdentifier", accessObj.userID)
//       )
//       .collect();
//     for (let index = 0; index < chats.length; index++) {
//       await ctx.db.delete(chats[index]._id);
//     }
//   },
// });
