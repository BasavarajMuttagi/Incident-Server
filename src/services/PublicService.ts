import { prisma } from "../../prisma/db";
import { IncidentComponentService } from "./IncidentComponentService";

export class PublicService {
  static async getComponents(orgId: string) {
    const components = await prisma.component.findMany({
      where: {
        orgId,
      },
    });

    const componentsWithStatus = await Promise.all(
      components.map(async (element) => {
        const status = await IncidentComponentService.getComponentStatus(
          element.id,
          orgId,
        );
        if (status === "OPERATIONAL") {
          return element;
        }
        return { ...element, status };
      }),
    );

    return componentsWithStatus;
  }

  static async getIncidents(orgId: string, createdAt: Date = new Date()) {
    const today = new Date(createdAt);
    today.setHours(0, 0, 0, 0);
    return prisma.incident.findMany({
      where: {
        orgId,
        createdAt: {
          gte: today,
        },
      },
      include: {
        IncidentTimeline: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
