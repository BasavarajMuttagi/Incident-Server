import { getAuth } from "@clerk/express";
import {
  ComponentStatus,
  IncidentSeverity,
  IncidentStatus,
} from "@prisma/client";
import { Request, Response } from "express";
import { IncidentService } from "../services/IncidentService";

const createIncident = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    const { title, description, severity, occuredAt, components } = req.body;

    if (!title || !description || !severity || !occuredAt) {
      res.status(400).json({
        message:
          "Bad Request: Missing required fields (title, description, severity, occuredAt)",
      });
      return;
    }

    const incident = await IncidentService.createIncident({
      title,
      description,
      severity: severity as IncidentSeverity,
      occuredAt: new Date(occuredAt),
      orgId,
      userId,
      components,
    });

    res.status(201).json(incident);
    return;
  } catch (error) {
    console.error("[CREATE_INCIDENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateIncidentDetails = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);
    const { incidentId } = req.params;
    const updateData = req.body;

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incident = await IncidentService.updateIncidentDetails(
      incidentId,
      orgId,
      {
        ...updateData,
        severity: updateData.severity as IncidentSeverity,
        occuredAt: updateData.occuredAt
          ? new Date(updateData.occuredAt)
          : undefined,
      },
    );

    res.json(incident);
    return;
  } catch (error) {
    console.error("[UPDATE_INCIDENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateIncidentStatus = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);
    const { incidentId } = req.params;
    const { status } = req.body;

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        message: "Bad Request: Invalid or missing status",
      });
      return;
    }

    const incident = await IncidentService.updateIncidentStatus(
      incidentId,
      orgId,
      status as IncidentStatus,
      userId,
    );

    res.json(incident);
    return;
  } catch (error) {
    console.error("[UPDATE_STATUS_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const addComponent = async (req: Request, res: Response) => {
  try {
    const { incidentId } = req.params;
    const { componentId, status } = req.body;

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    if (!componentId || !status) {
      res.status(400).json({
        message: "Bad Request: Missing componentId or status",
      });
      return;
    }

    if (!Object.values(ComponentStatus).includes(status)) {
      res.status(400).json({
        message: "Bad Request: Invalid component status",
      });
      return;
    }

    const component = await IncidentService.addComponentToIncident({
      incidentId,
      componentId,
      status: status as ComponentStatus,
    });

    res.status(200).json(component);
    return;
  } catch (error) {
    console.error("[ADD_COMPONENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const removeComponent = async (req: Request, res: Response) => {
  try {
    const { incidentId, componentId } = req.params;

    if (!incidentId || !componentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID or component ID",
      });
      return;
    }

    await IncidentService.removeComponentFromIncident(incidentId, componentId);
    res.sendStatus(204);
    return;
  } catch (error) {
    console.error("[REMOVE_COMPONENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateComponentStatus = async (req: Request, res: Response) => {
  try {
    const { incidentId, componentId } = req.params;
    const { status } = req.body;

    if (!incidentId || !componentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID or component ID",
      });
      return;
    }

    if (!status || !Object.values(ComponentStatus).includes(status)) {
      res.status(400).json({
        message: "Bad Request: Invalid or missing status",
      });
      return;
    }

    const component = await IncidentService.updateComponentStatusInIncident(
      incidentId,
      componentId,
      status as ComponentStatus,
    );

    res.json(component);
    return;
  } catch (error) {
    console.error("[UPDATE_COMPONENT_STATUS_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const addTimelineUpdate = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);
    const { incidentId } = req.params;
    const { message, status } = req.body;

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    if (!message || !status) {
      res.status(400).json({
        message: "Bad Request: Missing message or status",
      });
      return;
    }

    const update = await IncidentService.addTimelineUpdate({
      incidentId,
      message,
      status: status as IncidentStatus,
      orgId,
      userId,
    });

    res.json(update);
    return;
  } catch (error) {
    console.error("[ADD_TIMELINE_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listIncidents = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req);

    if (!orgId) {
      res.status(401).json({
        message: "Unauthorized: Missing organization ID",
      });
      return;
    }

    const incidents = await IncidentService.listIncidents(orgId);
    res.json(incidents);
    return;
  } catch (error) {
    console.error("[LIST_INCIDENTS_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getIncidentDetails = async (req: Request, res: Response) => {
  try {
    const { orgId } = getAuth(req);
    const { incidentId } = req.params;

    if (!orgId) {
      res.status(401).json({
        message: "Unauthorized: Missing organization ID",
      });
      return;
    }

    if (!incidentId) {
      res.status(400).json({
        message: "Bad Request: Missing incident ID",
      });
      return;
    }

    const incident = await IncidentService.getIncidentDetails(
      incidentId,
      orgId,
    );

    if (!incident) {
      res.status(404).json({ message: "Incident not found" });
      return;
    }

    res.json(incident);
    return;
  } catch (error) {
    console.error("[GET_INCIDENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
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
