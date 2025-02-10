import { requireAuth } from "@clerk/express";
import express from "express";

import {
  addTimelineUpdate,
  createMaintenance,
  deleteMaintenance,
  deleteTimelineUpdates,
  getMaintenanceById,
  getTimelineUpdate,
  listMaintenances,
  listTimelineUpdates,
  modifyUpdate,
  updateMaintenanceById,
} from "../controllers/maintenance.controller";
import requireOrganization from "../middlewares/requireOrganization.middleware";

const MaintenanceRouter = express.Router();
MaintenanceRouter.use(requireAuth());
MaintenanceRouter.use(requireOrganization);

// Maintenance routes
MaintenanceRouter.post("/create", createMaintenance);
MaintenanceRouter.get("/list", listMaintenances);
MaintenanceRouter.get("/:maintenanceId", getMaintenanceById);
MaintenanceRouter.patch("/:maintenanceId", updateMaintenanceById);
MaintenanceRouter.delete("/:maintenanceId", deleteMaintenance);

// Maintenance Timeline routes
MaintenanceRouter.get("/:maintenanceId/updates/list", listTimelineUpdates);
MaintenanceRouter.post("/:maintenanceId/updates/create", addTimelineUpdate);
MaintenanceRouter.post("/:maintenanceId/updates/delete", deleteTimelineUpdates);
MaintenanceRouter.get("/:maintenanceId/updates/:updateId", getTimelineUpdate);
MaintenanceRouter.patch("/:maintenanceId/updates/:updateId", modifyUpdate);

export default MaintenanceRouter;
