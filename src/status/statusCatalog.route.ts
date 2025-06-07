import { Router } from "express";
import {
  getStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
} from "./statusCatalog.controller";

const router = Router();

router.get("/statuses", getStatuses);
router.get("/statuses/:id", getStatusById);
router.post("/statuses", createStatus);
router.put("/statuses/:id", updateStatus);
router.delete("/statuses/:id", deleteStatus);

export default router;
