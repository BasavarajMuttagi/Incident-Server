import express from "express";
import {
  addComponent,
  addTimelineUpdate,
  createIncident,
  getIncidentID,
  listIncidents,
  removeComponent,
  updateComponentStatus,
  updateIncidentDetails,
  updateIncidentStatus,
} from "../controllers/incident.controller";

const IncidentRouter = express.Router();

// Incident routes
IncidentRouter.post("/create", createIncident);
IncidentRouter.get("/list", listIncidents);
IncidentRouter.get("/:incidentId", getIncidentID);
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
