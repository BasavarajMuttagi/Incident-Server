import { requireAuth } from "@clerk/express";
import express from "express";
import {
  addComponents,
  addTimelineUpdate,
  createIncident,
  deleteIncidents,
  deleteUpdates,
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
IncidentRouter.post("/:incidentId", deleteIncidents);

// Incident Component routes
IncidentRouter.post("/:incidentId/components/add", addComponents);
IncidentRouter.get("/:incidentId/components/list", listComponentsAttached);
IncidentRouter.post("/:incidentId/components/detach", detachComponents);

//Incident Timline routes
IncidentRouter.get("/:incidentId/updates/list", listTimelineUpdates);
IncidentRouter.post("/:incidentId/updates/create", addTimelineUpdate);
IncidentRouter.post("/:incidentId/updates/delete", deleteUpdates);

export default IncidentRouter;
