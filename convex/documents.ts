import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDocument = query({
  args: {},
  handler: async (ctx, args) => {
    const userID = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userID) {
      return []
    }
    return await ctx.db
      .query("documents")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userID)).order('desc').collect();
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userID = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userID) {
      throw new Error("Please Complete your login first.");
    }
    await ctx.db.insert("documents", {
      title: args.title,
      tokenIdentifier: userID,
    });
  },
});
