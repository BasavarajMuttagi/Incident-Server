import { requireAuth } from "@clerk/express";
import express from "express";
import {
  addComponents,
  addTimelineUpdate,
  createIncident,
  deleteIncidents,
  detachComponents,
  getIncidentById,
  listComponentsAttached,
  listIncidents,
  listTimelineUpdates,
  updateIncidentById,
} from "../controllers/incident.controller";
import requireOrganization from "../middlewares/requireOrganization.middleware";

const IncidentRouter = express.Router();
IncidentRouter.use(requireAuth());
IncidentRouter.use(requireOrganization);

// Incident routes
IncidentRouter.post("/create", createIncident);
IncidentRouter.get("/list", listIncidents);
IncidentRouter.get("/:incidentId", getIncidentById);
IncidentRouter.patch("/:incidentId", updateIncidentById);
IncidentRouter.delete("/:incidentId", deleteIncidents);

// Incident Component routes
IncidentRouter.post("/:incidentId/components/add", addComponents);
IncidentRouter.get("/:incidentId/components/list", listComponentsAttached);
IncidentRouter.delete("/:incidentId/components", detachComponents);

//Incident Timline routes
IncidentRouter.get("/:incidentId/updates/list", listTimelineUpdates);
IncidentRouter.post("/:incidentId/updates/create", addTimelineUpdate);
export default IncidentRouter;
