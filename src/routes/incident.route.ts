import { requireAuth } from "@clerk/express";
import express from "express";
import {
  addComponents,
  addTimelineUpdate,
  createIncident,
  deleteIncident,
  deleteTimelineUpdates,
  detachComponents,
  getIncidentById,
  getTimelineUpdate,
  listComponentsAttached,
  listIncidents,
  listTimelineUpdates,
  listUnattachedComponents,
  modifyUpdate,
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
IncidentRouter.delete("/:incidentId", deleteIncident);

// Incident Component routes
IncidentRouter.post("/:incidentId/components/attach", addComponents);
IncidentRouter.get("/:incidentId/components/list", listComponentsAttached);
IncidentRouter.get(
  "/:incidentId/components/unattached",
  listUnattachedComponents,
);
IncidentRouter.post("/:incidentId/components/detach", detachComponents);

//Incident Timline routes
IncidentRouter.get("/:incidentId/updates/list", listTimelineUpdates);
IncidentRouter.post("/:incidentId/updates/create", addTimelineUpdate);
IncidentRouter.post("/:incidentId/updates/delete", deleteTimelineUpdates);
IncidentRouter.get("/:incidentId/updates/:incidentUpdateId", getTimelineUpdate);
IncidentRouter.patch("/:incidentId/updates/:incidentUpdateId", modifyUpdate);

export default IncidentRouter;
