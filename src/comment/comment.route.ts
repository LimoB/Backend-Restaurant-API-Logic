import express, { Router } from "express";
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "./comment.controller";
import router from "../orders/orders.route";

export const commentRouter = Router();

router.get("/comments", getComments);
router.get("/comments/:id", getCommentById);
router.post("/comments", createComment);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

