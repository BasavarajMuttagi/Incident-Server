import { ComponentStatus, Incident, IncidentStatus } from "@prisma/client";
import { prisma } from "../../prisma/db";

export class IncidentService {
  static async createIncident(data: {
    title: string;
    description: string;
    status: IncidentStatus;
    occuredAt: Date;
    orgId: string;
    userId: string;
    components?: { componentId: string; status: ComponentStatus }[];
  }): Promise<Incident> {
    return prisma.$transaction(async (tx) => {
      const incident = await tx.incident.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          occuredAt: data.occuredAt,
          orgId: data.orgId,
        },
        include: {
          IncidentTimeline: true,
        },
      });

      if (data.components?.length) {
        await tx.incidentComponent.createMany({
          data: data.components.map((comp) => ({
            incidentId: incident.id,
            componentId: comp.componentId,
            status: comp.status,
            orgId: data.orgId,
          })),
        });
      }

      return incident;
    });
  }

  static async getIncident(incidentId: string, orgId: string) {
    return prisma.incident.findUnique({
      where: {
        id: incidentId,
        orgId,
      },
    });
  }

  static async updateIncident({
    id,
    orgId,
    ...rest
  }: Pick<
    Incident,
    | "id"
    | "orgId"
    | "title"
    | "description"
    | "occuredAt"
    | "status"
    | "resolvedAt"
  >) {
    return prisma.incident.update({
      where: {
        id,
        orgId,
      },
      data: { ...rest },
      include: {
        IncidentTimeline: true,
      },
    });
  }

  static async deleteIncidents(incidentIds: string[], orgId: string) {
    return prisma.incident.deleteMany({
      where: {
        id: {
          in: [...incidentIds],
        },
        orgId,
      },
    });
  }

  static async listIncidents(orgId: string) {
    return prisma.incident.findMany({
      where: {
        orgId,
      },
    });
  }
}
