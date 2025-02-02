import express from "express";
import {
  createIncident,
  listIncidents,
  getIncidentDetails,
  updateIncidentDetails,
  updateIncidentStatus,
  addComponent,
  removeComponent,
  updateComponentStatus,
  addTimelineUpdate,
} from "../controllers/incident.controller";

const IncidentRouter = express.Router();

// Incident routes
IncidentRouter.post("/create", createIncident);
IncidentRouter.get("/list", listIncidents);
IncidentRouter.get("/:incidentId", getIncidentDetails);
IncidentRouter.patch("/:incidentId", updateIncidentDetails);
IncidentRouter.patch("/:incidentId/status", updateIncidentStatus);

// Component management routes
IncidentRouter.post("/:incidentId/components", addComponent);
IncidentRouter.delete("/:incidentId/components/:componentId", removeComponent);
IncidentRouter.patch(
  "/:incidentId/components/:componentId/status",
  updateComponentStatus,
);

// Timeline routes
IncidentRouter.post("/:incidentId/timeline", addTimelineUpdate);

export default IncidentRouter;
