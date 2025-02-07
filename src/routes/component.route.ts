import { requireAuth } from "@clerk/express";
import express from "express";
import {
  createComponent,
  deleteComponent,
  getComponent,
  listComponents,
  updateComponent,
} from "../controllers/component.controller";
import requireOrganization from "../middlewares/requireOrganization.middleware";

const ComponentRouter = express.Router();
ComponentRouter.use(requireAuth());
ComponentRouter.use(requireOrganization);
ComponentRouter.post("/create", createComponent);
ComponentRouter.get("/list", listComponents);
ComponentRouter.get("/:componentId", getComponent);
ComponentRouter.patch("/:componentId", updateComponent);
ComponentRouter.delete("/:componentId", deleteComponent);

export default ComponentRouter;
