import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { embed } from "./notes";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { hasOrgAccess } from "./documents";

export const searchAction = action({
  args: {
    search: v.string(),
    orgId : v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const embedding = await embed(args.search);

    if(args.orgId){
      const isMember = await ctx.runQuery(internal.membership.hasOrgAccessQuery, {
        orgId: args.orgId
      });
      if (!isMember) return null;
    }

    const filter = args.orgId ? (q:any)=>  q.eq("orgId", args.orgId): (q:any)=>q.eq("tokenIdentifier", userId);
    const noteResults = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter
    });

    const documentResults = await ctx.vectorSearch("documents", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter
    });

    const records: (
      | { type: "notes"; score: number; record: Doc<"notes"> }
      | { type: "documents"; score: number; record: Doc<"documents"> }
    )[] = [];
    await Promise.all(
        noteResults.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
          noteId: result._id,
        });
        if (!note) return null;
        records.push({ record: note, score: result._score, type: "notes" });
      })
    );
    await Promise.all(
        documentResults.map(async (result) => {
        const document = await ctx.runQuery(api.documents.getDocument, {
          documentId: result._id,
        });
        if (!document) return null;
        records.push({ record: document,score: result._score, type: "documents" });
      })
    );
    records.sort((a,b)=> b.score - a.score);
    return records;
  },
});
