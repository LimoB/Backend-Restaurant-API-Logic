import { Request, Response, NextFunction } from "express";
import {
  createCommentServices,
  deleteCommentServices,
  getCommentByIdServices,
  getCommentsServices,
  updateCommentServices,
} from "./comment.service";

// Get all comments
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comments = await getCommentsServices();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Get comment by ID
export const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }

  try {
    const comment = await getCommentByIdServices(id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// Create a new comment
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newComment = await createCommentServices(req.body);
    res.status(201).json({ message: newComment });
  } catch (error) {
    next(error);
  }
};

// Update an existing comment
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }

  try {
    const updated = await updateCommentServices(id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.status(200).json({ message: updated });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }

  try {
    const deleted = await deleteCommentServices(id);
    if (!deleted) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

