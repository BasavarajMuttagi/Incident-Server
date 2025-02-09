-- CreateIndex
CREATE INDEX "Incident_orgId_status_idx" ON "Incident"("orgId", "status");

-- CreateIndex
CREATE INDEX "IncidentComponent_orgId_incidentId_idx" ON "IncidentComponent"("orgId", "incidentId");

-- CreateIndex
CREATE INDEX "IncidentComponent_orgId_componentId_idx" ON "IncidentComponent"("orgId", "componentId");
