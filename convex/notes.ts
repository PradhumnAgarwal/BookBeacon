import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";
import { hasOrgAccess } from "./documents";
import { Doc, Id } from "./_generated/dataModel";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : ""
);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function embed(text: string): Promise<number[]> {
  const result = await model.embedContent(text);
  const embedding = result.embedding;
  console.log(embedding.values);
  return embedding.values as number[];
}

export const setNoteEmbedding = internalMutation({
  args: {
    noteId: v.id("notes"),
    embedding: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const embedding = args.embedding;
    await ctx.db.patch(args.noteId, {
      embedding,
    });
  },
});
export const createNoteEmbedding = internalAction({
  args: {
    noteId: v.id("notes"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const embedding = await embed(args.text);

    await ctx.runMutation(internal.notes.setNoteEmbedding, {
      noteId: args.noteId,
      embedding,
    });
  },
});
export const createNote = mutation({
  args: {
    text: v.string(),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("Invalid user");
    let noteId: Id<"notes">;

    if (args.orgId) {
      const isMember = hasOrgAccess(ctx, args.orgId);
      if (!isMember) throw new ConvexError("Invalid user");
      noteId = await ctx.db.insert("notes", {
        text: args.text,
        orgId: args.orgId,
      });
    } else {
      noteId = await ctx.db.insert("notes", {
        text: args.text,
        tokenIdentifier: userId,
      });
    }

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId,
      text: args.text,
    });
    // return noteId;
  },
});

export const getNotes = query({
  args: {
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;
    console.log("get notes is called");
    if (args.orgId) {
      console.log("inside if block");
      const isMember = await hasOrgAccess(ctx, args.orgId);
      console.log(args.orgId);
      if (!isMember) {
        console.log("is not a member");
        return null;
      }
      const notes = await ctx.db
        .query("notes")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
      console.log(notes);
      return notes;
    } else {
      return await ctx.db
        .query("notes")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .order("desc")
        .collect();
    }
  },
});

export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;
    const note = await ctx.db.get(args.noteId);
    if (note?.orgId != null) {
      const isMember = await hasOrgAccess(ctx, note.orgId);
      if (!isMember) return null;
    } else {
      if (note?.tokenIdentifier != null && note.tokenIdentifier != userId)
        return null;
    }
    return note;
  },
});

export const deleteNote = mutation({
  args: { noteId: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("Invalid user");
    const note = await ctx.db.get(args.noteId);
    if(!note) throw new ConvexError("Invalid note");

    await assertAccessToNote(ctx, note);
    
    await ctx.db.delete(args.noteId);
  },
});


async function assertAccessToNote(
  ctx: QueryCtx | MutationCtx,
  note: Doc<"notes">
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    throw new ConvexError("You must be logged in to create a note");
  }

  if (note.orgId) {
    const hasAccess = await hasOrgAccess(ctx, note.orgId);

    if (!hasAccess) {
      throw new ConvexError("You do not have permission to delete this note");
    }
  } else {
    if (note.tokenIdentifier !== userId) {
      throw new ConvexError("You do not have permission to delete this note");
    }
  }
}