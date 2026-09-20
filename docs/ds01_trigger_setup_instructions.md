# DS-01 Trigger Setup Instructions

## Status: ✅ Workflow Published - Ready for Trigger Binding

**Workflow ID**: `wf_af48bc3f80d6`  
**Version**: 1 (Published on 2026-09-19 09:47 UTC)  
**Status**: ✅ Ready to receive events

---

## Option 1: Manual Setup via Dashboard (Recommended)

### Step-by-Step:

1. **Open fastn Dashboard**: https://app.fastn.dev
2. **Navigate to Triggers** → **App Event Triggers**
3. **Click "Create Trigger"**
4. **Configure**:
   - **Name**: DS-01: HubSpot Deal Creation → Notion (Full Sync)
   - **Connector**: HubSpot (`9036a742-6baa-4c72-be3c-3789b34d6f9b`)
   - **Event**: `deal.creation`
   - **Target Workflow**: `wf_af48bc3f80d6` (DS-01: HubSpot → Notion Deal Sync (Full))
   - **Status**: Active

5. **Save** and verify `subscriptionStatus` shows **ACTIVE**

---

## Option 2: API Call (For Automation)

```bash
POST https://connect.fastn.dev/api/v1/app-triggers
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>

{
  "connectorId": "9036a742-6baa-4c72-be3c-3789b34d6f9b",
  "name": "DS-01: HubSpot Deal Creation → Notion (Full Sync)",
  "description": "Triggers DS-01 workflow when a new deal is created in HubSpot",
  "events": ["deal.creation"],
  "routes": [
    {
      "routeId": "wf_af48bc3f80d6",
      "routeType": "API",
      "headers": {},
      "payload": {}
    }
  ],
  "status": "ACTIVE"
}
```

---

## Existing Triggers (Need Updating)

Two old triggers are still pointing to obsolete workflow `wf_4b6f1d1dfa18`:

### 1. Deal Property Change Trigger
- **ID**: `f7038db2-850a-4e97-8504-07f1e00a3fc5`
- **Event**: `deal.propertyChange`
- **Action**: Update route to `wf_af48bc3f80d6`

### 2. Deal Deletion Trigger
- **ID**: `085bb314-ce45-4d3f-bbf9-f62f12fcc6b2`
- **Event**: `deal.deletion`
- **Action**: Update route to `wf_af48bc3f80d6`

**Note**: These triggers work but route to the old workflow. Update them after verifying the new `deal.creation` trigger works.

---

## Verification Steps

After creating the trigger:

### 1. Read Trigger Back
```javascript
// Check subscription status
const trigger = await getTrigger(triggerId);
console.log(trigger.appTrigger.subscriptionStatus); // Should be "ACTIVE"
console.log(trigger.webhookUrl); // HubSpot will POST here
```

### 2. Fire Synthetic Event
Create a test deal in HubSpot manually or use the test event:

```javascript
// Send test event
POST /api/v1/app-triggers/{triggerId}/test
{
  "payload": [{
    "objectId": 349411565273,
    "portalId": 247430544,
    "occurredAt": 1726741200000,
    "subscriptionType": "deal.creation"
  }]
}
```

### 3. Verify Execution
```javascript
// Check if workflow executed
const executions = await listWorkflowExecutions({
  workflowId: "wf_af48bc3f80d6",
  dateFrom: "2026-09-19T00:00:00Z"
});

// Find the execution triggered by your event
const execution = executions.find(e => 
  e.requestHeaders["x-fastn-event-id"] === eventId
);

console.log(execution.status); // Should be "completed"
console.log(execution.result); // Check success: true
```

### 4. Check Notion
Open the Notion database and verify a new page was created:
- Database: https://app.notion.com/p/3936f2bdbe9b4b43ad89c17e6fcb2ab4
- Look for the deal with matching HubSpot Deal ID

---

## End-to-End Test

1. **Create a real deal in HubSpot**:
   - Go to HubSpot CRM
   - Create a new deal with:
     - Deal Name: "Test Auto-Sync Deal"
     - Amount: $50,000
     - Stage: Any
     - Close Date: Future date

2. **Wait 5-10 seconds** (webhook + workflow execution)

3. **Check Notion database**:
   - Should see new page with all 9 properties
   - Deal Name, HubSpot Deal ID, Stage, Amount, etc.
   - Sync Status: "Synced"
   - Last Sync Direction: "HubSpot → Notion"

4. **Verify in Dashboard**:
   - Go to Activity → Workflow Executions
   - Should see execution for `wf_af48bc3f80d6`
   - Status: Completed
   - Result: `success: true, action: "created"`

---

## Troubleshooting

### Trigger Not Firing
- Check `subscriptionStatus` in trigger details (should be ACTIVE)
- Verify webhook URL is accessible
- Check HubSpot webhook settings

### Execution Not Found
- Verify workflow is published (version > 0)
- Check trigger routes point to correct workflow ID
- Look in trigger monitoring/DLQ for failed dispatches

### Workflow Errors
- Check execution logs in dashboard
- Common issues:
  - Missing HubSpot properties → workflow skips
  - Notion connection expired → 401/403
  - Database not shared → 404

### Duplicate Pages Created
- Deduplication is disabled (queryDatabase blocked)
- Each run creates new page until fixed
- Manual cleanup needed for test runs

---

## Next Steps After Trigger Works

1. ✅ Verify end-to-end sync working
2. Build DS-02 (Notion → HubSpot reverse sync)
3. Implement deduplication (fix queryDatabase)
4. Create widget binding
5. Build conflict detection (DS-03)
6. Add audit logging (DS-05)

---

## Reference

- **Workflow Code**: See `wf_af48bc3f80d6` in dashboard
- **Test Deal**: HubSpot ID `349411565273`
- **Test Page**: https://app.notion.com/p/Fastn-Test-Deal-3e096e4b3d1f81a4b978fef708d357d0
- **Progress**: See `DS01_PROGRESS_REPORT.md`

---

**Created**: 2026-09-19 09:50 UTC  
**Last Updated**: 2026-09-19 09:50 UTC
