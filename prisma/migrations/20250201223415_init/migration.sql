-- CreateEnum
CREATE TYPE "ComponentStatus" AS ENUM ('OPERATIONAL', 'DEGRADED', 'PARTIAL_OUTAGE', 'MAJOR_OUTAGE');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('MINOR', 'MAJOR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ComponentStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'INVESTIGATING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentComponent" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "status" "ComponentStatus" NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "IncidentComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentTimeline" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "IncidentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceComponent" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "status" "ComponentStatus" NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MaintenanceComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceTimeline" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maintenanceId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MaintenanceTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_name_key" ON "Component"("name");

-- CreateIndex
CREATE INDEX "Component_orgId_idx" ON "Component"("orgId");

-- CreateIndex
CREATE INDEX "Incident_orgId_idx" ON "Incident"("orgId");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "IncidentComponent_orgId_idx" ON "IncidentComponent"("orgId");

-- CreateIndex
CREATE INDEX "IncidentComponent_componentId_idx" ON "IncidentComponent"("componentId");

-- CreateIndex
CREATE INDEX "IncidentComponent_incidentId_idx" ON "IncidentComponent"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentComponent_status_idx" ON "IncidentComponent"("status");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentComponent_incidentId_componentId_key" ON "IncidentComponent"("incidentId", "componentId");

-- CreateIndex
CREATE INDEX "IncidentTimeline_orgId_idx" ON "IncidentTimeline"("orgId");

-- CreateIndex
CREATE INDEX "IncidentTimeline_incidentId_idx" ON "IncidentTimeline"("incidentId");

-- CreateIndex
CREATE INDEX "Maintenance_orgId_idx" ON "Maintenance"("orgId");

-- CreateIndex
CREATE INDEX "Maintenance_status_idx" ON "Maintenance"("status");

-- CreateIndex
CREATE INDEX "MaintenanceComponent_orgId_idx" ON "MaintenanceComponent"("orgId");

-- CreateIndex
CREATE INDEX "MaintenanceComponent_componentId_idx" ON "MaintenanceComponent"("componentId");

-- CreateIndex
CREATE INDEX "MaintenanceComponent_maintenanceId_idx" ON "MaintenanceComponent"("maintenanceId");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceComponent_maintenanceId_componentId_key" ON "MaintenanceComponent"("maintenanceId", "componentId");

-- CreateIndex
CREATE INDEX "MaintenanceTimeline_orgId_idx" ON "MaintenanceTimeline"("orgId");

-- CreateIndex
CREATE INDEX "MaintenanceTimeline_maintenanceId_idx" ON "MaintenanceTimeline"("maintenanceId");

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentTimeline" ADD CONSTRAINT "IncidentTimeline_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceComponent" ADD CONSTRAINT "MaintenanceComponent_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceComponent" ADD CONSTRAINT "MaintenanceComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTimeline" ADD CONSTRAINT "MaintenanceTimeline_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
