import { IncidentStatus } from "@prisma/client";
import { prisma } from "../../prisma/db";

export class IncidentTimelineService {
  static async addUpdate(data: {
    message: string;
    status: IncidentStatus;
    incidentId: string;
    userId: string;
    orgId: string;
  }) {
    return prisma.incidentTimeline.create({
      data,
    });
  }

  static async getUpdate(
    incidentUpdateId: string,
    incidentId: string,
    orgId: string,
  ) {
    return prisma.incidentTimeline.findUnique({
      where: {
        id: incidentUpdateId,
        incidentId,
        orgId,
      },
    });
  }

  static async listUpdates(incidentId: string, orgId: string) {
    return prisma.incidentTimeline.findMany({
      where: {
        incidentId,
        orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async deleteUpdates(
    incidentUpdateIds: string[],
    incidentId: string,
    orgId: string,
  ) {
    return prisma.incidentTimeline.deleteMany({
      where: {
        incidentId,
        orgId,
        id: {
          in: [...incidentUpdateIds],
        },
      },
    });
  }

  static async modifyUpdate(
    incidentUpdateId: string,
    incidentId: string,
    orgId: string,
    data: {
      message?: string;
      status?: IncidentStatus;
    },
  ) {
    return prisma.incidentTimeline.update({
      where: {
        id: incidentUpdateId,
        incidentId,
        orgId,
      },
      data,
    });
  }
}
