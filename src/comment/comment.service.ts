import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { comment, type TCommentInsert, type TCommentSelect } from "../drizzle/schema";

// Get all comments
export const getCommentsServices = async (): Promise<TCommentSelect[] | null> => {
  return await db.query.comment.findMany();
};

// Get comment by ID
export const getCommentByIdServices = async (commentId: number): Promise<TCommentSelect | undefined> => {
  return await db.query.comment.findFirst({
    where: eq(comment.id, commentId),
  });
};

// Create a new comment
export const createCommentServices = async (commentData: TCommentInsert): Promise<string> => {
  await db.insert(comment).values(commentData).returning();
  return "Comment Created Successfully 📝";
};

// Update an existing comment
export const updateCommentServices = async (commentId: number, commentData: Partial<TCommentInsert>): Promise<string | null> => {
  const result = await db.update(comment).set(commentData).where(eq(comment.id, commentId)).returning();
  return result.length ? "Comment Updated Successfully ✅" : null;
};

// Delete a comment
export const deleteCommentServices = async (commentId: number): Promise<boolean> => {
  const result = await db.delete(comment).where(eq(comment.id, commentId)).returning();
  return result.length > 0;
};
