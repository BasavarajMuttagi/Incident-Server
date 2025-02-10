import { Component, ComponentStatus } from "@prisma/client";
import { prisma } from "../../prisma/db";

export class ComponentService {
  static async createComponent(
    data: Pick<Component, "name" | "description" | "status" | "orgId">,
  ) {
    const { name, description, status, orgId } = data;

    return prisma.component.create({
      data: {
        name,
        description,
        status,
        orgId,
      },
    });
  }

  static async updateComponent(
    id: string,
    orgId: string,
    data: Pick<Component, "name" | "description" | "status">,
  ) {
    return prisma.component.update({
      where: { id, orgId },
      data: {
        ...data,
      },
    });
  }

  static async deleteComponent(id: string, orgId: string) {
    return prisma.component.delete({
      where: { id, orgId },
    });
  }

  static async getComponent(id: string, orgId: string) {
    return prisma.component.findFirst({
      where: { id, orgId },
      include: {
        incidents: true,
      },
    });
  }

  static async listComponents(orgId: string) {
    return prisma.component.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateComponentStatus(
    id: string,
    orgId: string,
    status: ComponentStatus,
  ) {
    return prisma.component.update({
      where: { id, orgId },
      data: {
        status,
      },
    });
  }

  static async checkComponentExists(name: string, orgId: string) {
    const component = await prisma.component.findFirst({
      where: { name, orgId },
    });
    return !!component;
  }
}
