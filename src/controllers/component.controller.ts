import { Request, Response } from "express";
import { ComponentService } from "../services/ComponentService";

const createComponent = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const component = await ComponentService.createComponent({
      name,
      description,
      orgId,
    });

    res.status(201).json(component);
    return;
  } catch (error) {
    console.error("[CREATE_COMPONENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const updateComponent = async (req: Request, res: Response) => {
  try {
    const { orgId, componentId } = req.params;
    const { name, description, status } = req.body;

    if (!name && !description && !status) {
      res.status(400).json({ error: "No data to update" });
      return;
    }

    const component = await ComponentService.updateComponent(
      componentId,
      orgId,
      {
        name,
        description,
        status,
      },
    );

    res.json(component);
    return;
  } catch (error) {
    console.error("[UPDATE_COMPONENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const deleteComponent = async (req: Request, res: Response) => {
  try {
    const { orgId, componentId } = req.params;

    await ComponentService.deleteComponent(componentId, orgId);
    res.sendStatus(204);
    return;
  } catch (error) {
    console.error("[DELETE_COMPONENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const getComponent = async (req: Request, res: Response) => {
  try {
    const { orgId, componentId } = req.params;

    const component = await ComponentService.getComponent(componentId, orgId);

    if (!component) {
      res.status(404).json({ error: "Component not found" });
      return;
    }

    res.json(component);
    return;
  } catch (error) {
    console.error("[GET_COMPONENT_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const listComponents = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const components = await ComponentService.listComponents(orgId);

    res.json(components);
    return;
  } catch (error) {
    console.error("[LIST_COMPONENTS_ERROR]", error);
    res.status(500).json({ error: "Internal server error" });
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
