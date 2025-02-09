-- @param {String} $1:componentId
-- @param {String} $2:orgId
SELECT ic.status
FROM "IncidentComponent" ic
JOIN "Incident" i ON i.id = ic."incidentId"
WHERE ic."componentId" = $1
AND ic."orgId" = $2
AND i.status != 'RESOLVED'
ORDER BY 
    CASE ic.status
        WHEN 'MAJOR_OUTAGE' THEN 1
        WHEN 'PARTIAL_OUTAGE' THEN 2
        WHEN 'DEGRADED' THEN 3
        WHEN 'OPERATIONAL' THEN 4
        ELSE 4
    END ASC;
