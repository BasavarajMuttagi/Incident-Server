import {
  ComponentStatus,
  IncidentSeverity,
  IncidentStatus,
} from "@prisma/client";
import { Request, Response } from "express";
import { IncidentService } from "../services/IncidentService";

const createIncident = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.body;
    const { title, description, severity, occuredAt, components } = req.body;

    if (!title || !description || !severity || !occuredAt) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const incident = await IncidentService.createIncident({
      title,
      description,
      severity: severity as IncidentSeverity,
      occuredAt: new Date(occuredAt),
      orgId,
      userId: req.body.userId,
      components,
    });

    res.status(201).json(incident);
  } catch (error) {
    console.error("[CREATE_INCIDENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const updateIncidentDetails = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const { orgId, title, description, severity, occuredAt } = req.body;

    const incident = await IncidentService.updateIncidentDetails(
      incidentId,
      orgId,
      {
        title,
        description,
        severity: severity as IncidentSeverity,
        occuredAt: occuredAt ? new Date(occuredAt) : undefined,
      },
    );

    res.json(incident);
  } catch (error) {
    console.error("[UPDATE_INCIDENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const updateIncidentStatus = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const { orgId, status, userId } = req.body;

    const incident = await IncidentService.updateIncidentStatus(
      incidentId,
      orgId,
      status as IncidentStatus,
      userId,
    );

    res.json(incident);
  } catch (error) {
    console.error("[UPDATE_STATUS_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const addComponent = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const { componentId, status } = req.body;

    const component = await IncidentService.addComponentToIncident({
      incidentId,
      componentId,
      status: status as ComponentStatus,
    });

    res.json(component);
  } catch (error) {
    console.error("[ADD_COMPONENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const removeComponent = async (req: Request, res: Response) => {
  try {
    const { incidentId, componentId } = req.params;
    await IncidentService.removeComponentFromIncident(incidentId, componentId);
    res.status(204).send();
  } catch (error) {
    console.error("[REMOVE_COMPONENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const updateComponentStatus = async (req: Request, res: Response) => {
  try {
    const { incidentId, componentId } = req.params;
    const { status } = req.body;

    const component = await IncidentService.updateComponentStatusInIncident(
      incidentId,
      componentId,
      status as ComponentStatus,
    );

    res.json(component);
  } catch (error) {
    console.error("[UPDATE_COMPONENT_STATUS_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const addTimelineUpdate = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const { message, status, orgId, userId } = req.body;

    const update = await IncidentService.addTimelineUpdate({
      incidentId,
      message,
      status: status as IncidentStatus,
      orgId,
      userId,
    });

    res.json(update);
  } catch (error) {
    console.error("[ADD_TIMELINE_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const listIncidents = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.body;
    const incidents = await IncidentService.listIncidents(orgId);
    res.json(incidents);
  } catch (error) {
    console.error("[LIST_INCIDENTS_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const getIncidentDetails = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const { orgId } = req.body;

    const incident = await IncidentService.getIncidentDetails(
      incidentId,
      orgId,
    );

    if (!incident) {
      res.status(404).json({ error: "Incident not found" });
      return;
    }

    res.json(incident);
  } catch (error) {
    console.error("[GET_INCIDENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export {
  addComponent,
  addTimelineUpdate,
  createIncident,
  getIncidentDetails,
  listIncidents,
  removeComponent,
  updateComponentStatus,
  updateIncidentDetails,
  updateIncidentStatus,
};
