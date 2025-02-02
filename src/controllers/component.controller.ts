import { getAuth } from "@clerk/express";
import { ComponentStatus } from "@prisma/client";
import { Request, Response } from "express";
import { ComponentService } from "../services/ComponentService";

const createComponent = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);
    const { name, description, status } = req.body;

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    if (!name) {
      res.status(400).json({
        message: "Bad Request: Name is required",
      });
      return;
    }

    if (status && !Object.values(ComponentStatus).includes(status)) {
      res.status(400).json({
        message: "Bad Request: Invalid component status",
      });
      return;
    }

    const component = await ComponentService.createComponent({
      name,
      description,
      status,
      orgId,
    });

    res.status(201).json(component);
    return;
  } catch (error) {
    console.error("[CREATE_COMPONENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const updateComponent = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);
    const { componentId } = req.params;
    const updateData = req.body;

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    if (!componentId) {
      res.status(400).json({
        message: "Bad Request: Missing component ID",
      });
      return;
    }

    const component = await ComponentService.updateComponent(
      componentId,
      orgId,
      updateData,
    );

    res.json(component);
    return;
  } catch (error) {
    console.error("[UPDATE_COMPONENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const deleteComponent = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);
    const { componentId } = req.params;

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    if (!componentId) {
      res.status(400).json({
        message: "Bad Request: Missing component ID",
      });
      return;
    }

    await ComponentService.deleteComponent(componentId, orgId);
    res.sendStatus(204);
    return;
  } catch (error) {
    console.error("[DELETE_COMPONENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getComponent = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);
    const { componentId } = req.params;

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    if (!componentId) {
      res.status(400).json({
        message: "Bad Request: Missing component ID",
      });
      return;
    }

    const component = await ComponentService.getComponent(componentId, orgId);

    if (!component) {
      res.status(404).json({ message: "Component not found" });
      return;
    }

    res.json(component);
    return;
  } catch (error) {
    console.error("[GET_COMPONENT_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const listComponents = async (req: Request, res: Response) => {
  try {
    const { orgId, userId } = getAuth(req);

    if (!orgId || !userId) {
      res.status(401).json({
        message: "Unauthorized: Missing authentication credentials",
      });
      return;
    }

    const components = await ComponentService.listComponents(orgId);
    res.json(components);
    return;
  } catch (error) {
    console.error("[LIST_COMPONENTS_ERROR]", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export {
  createComponent,
  deleteComponent,
  getComponent,
  listComponents,
  updateComponent,
};
