import { requireAuth } from "@clerk/express";
import express from "express";
import {
  createComponent,
  listComponents,
  getComponent,
  updateComponent,
  deleteComponent,
} from "../controllers/component.controller";

const ComponentRouter = express.Router();
ComponentRouter.use(requireAuth());
ComponentRouter.post("/create", createComponent);
ComponentRouter.get("/list", listComponents);
ComponentRouter.get("/:componentId", getComponent);
ComponentRouter.patch("/:componentId", updateComponent);
ComponentRouter.delete("/:componentId", deleteComponent);

export default ComponentRouter;
