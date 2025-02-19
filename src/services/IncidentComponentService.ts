import { ComponentStatus } from "@prisma/client";
import { getComponentStatus } from "@prisma/client/sql";
import { prisma } from "../../prisma/db";
export class IncidentComponentService {
  static async addComponents(
    data: {
      incidentId: string;
      componentId: string;
      status: ComponentStatus;
      orgId: string;
    }[],
  ) {
    return prisma.incidentComponent.createMany({
      data: [...data],
    });
  }

  static async listComponentsAttached(incidentId: string, orgId: string) {
    return prisma.incidentComponent.findMany({
      where: {
        incidentId,
        orgId,
      },
      include: {
        component: true,
      },
    });
  }
  static async detachComponents(
    orgId: string,
    incidentId: string,
    componentIds: string[],
  ) {
    return prisma.incidentComponent.deleteMany({
      where: {
        orgId: orgId,
        incidentId,
        componentId: {
          in: [...componentIds],
        },
      },
    });
  }

  static async listUnattachedComponents(incidentId: string, orgId: string) {
    return prisma.component.findMany({
      where: {
        orgId,
        NOT: {
          incidents: {
            some: {
              incidentId,
            },
          },
        },
      },
    });
  }

  static async getComponentStatus(componentId: string, orgId: string) {
    const status = await prisma.$queryRawTyped(
      getComponentStatus(componentId, orgId),
    );
    return status.length ? status[0].status : "OPERATIONAL";
  }
}
