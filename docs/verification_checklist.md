# DealSync Sentinel — Verification Checklist

**Purpose**: Quick verification guide to test all components end-to-end  
**Status**: Ready for testing  
**Estimated Time**: 15-20 minutes

---

## ✅ Pre-Verification Setup

Before testing, verify these resources exist:

### Workflows
- [x] DS-01 (`wf_af48bc3f80d6`) — version 5 published ✅
- [x] DS-02 (`wf_cbde2bc0b732`) — version 4 published ✅
- [x] DS-04 (`wf_bdfedb42bf5d`) — version 3 published ✅

### Triggers
- [x] App Event Trigger (`f637d074-2507-4e93-891a-ce338db23723`) — **ACTIVE** ✅
  - Listening for: `deal.creation` events
  - Webhook registered with HubSpot (account: 247430544)
  - Routes to: DS-01 workflow
  - Subscription Status: ACTIVE
- [x] Scheduler Trigger (`1d09d3a5-67d2-4aff-a953-6e413193887a`) — **ACTIVE** ✅
  - Schedule: Every hour (0 * * * *)
  - Timezone: UTC
  - Routes to: DS-02 workflow
  - Last Run: 2026-09-19 20:00 UTC
  - Next Run: 2026-09-19 21:00 UTC

### Databases in Notion
- [ ] HubSpot Deals (`3936f2bd-be9b-4b43-ad89-c17e6fcb2ab4`)
- [ ] Conflicts (`1dbc615c-fdea-434c-bd59-b71068f10e3c`)
- [ ] Audit Log (`7850a7a5-66e5-4e05-8605-7b38a4e1277c`)

### Connections
- [ ] HubSpot OAuth connection active
- [ ] Notion OAuth connection-1 active
Do 
---

## 🧪 Test 1: DS-01 (HubSpot → Notion Sync)

**Goal**: Verify real-time sync from HubSpot to Notion with audit logging

### Steps:
1. **Create a new deal in HubSpot**:
   - Deal Name: "Test Deal - [Timestamp]"
   - Amount: $50,000
   - Stage: "appointmentscheduled"
   - Close Date: [Future date]

2. **Wait ~1-2 seconds** (real-time trigger)

3. **Verify in Notion HubSpot Deals database**:
   - [x] New page created with correct Deal Name ✅
   - [x] HubSpot Deal ID populated ✅
   - [x] Deal Value = correct amount ✅
   - [x] Stage = correct stage ✅
   - [x] Expected Close Date = correct date ✅
   - [x] CRM = "HubSpot" ✅
   - [x] Sync Status = "Synced" ✅
   - [x] Last Synced = Today ✅
   - [x] Last Sync Direction = "HubSpot → Notion" ✅

4. **Verify in Audit Log database**:
   - [x] New log entry created ✅
   - [x] Log ID format: `LOG-[timestamp]-[random]` ✅
   - [x] Workflow = "DS-01" ✅
   - [x] Operation = "Create" ✅
   - [x] Source System = "HubSpot" ✅
   - [x] Target System = "Notion" ✅
   - [x] HubSpot Deal ID matches ✅
   - [x] Deal Name matches ✅
   - [x] Fields Changed includes: Deal Name, Deal Value, Stage, Expected Close Date ✅
   - [x] After Values contains deal data ✅
   - [x] Status = "Success" ✅
   - [x] Duration (ms) < 5000 ✅

**Result**: ✅ **PASS** — Real-time HubSpot → Notion sync VERIFIED WORKING!

**Issues Resolved**:
- Fixed array payload handling for HubSpot webhook format
- Added JSON string parsing for test framework compatibility
- Switched to active Notion connection (connection-1)
- Added comprehensive audit logging
- Added state tracking for conflict detection support

---

## 🧪 Test 2: DS-02 (Notion → HubSpot Sync)

**Goal**: Verify scheduled sync from Notion to HubSpot with audit logging

### Steps:
1. **Update deals in Notion**:
   - [x] Changed deals in Notion database ✅

2. **Run DS-02 manually** (scheduled trigger active every hour at 0 * * * *):
   - [x] Executed at 20:55:05 ✅

3. **Verify in HubSpot**:
   - [x] Deal 349208396518 updated (closedate: 2026-11-29) ✅
   - [x] Deal 349411565273 updated (closedate: 2026-09-30) ✅
   - [x] Sync result: 2 deals synced successfully ✅

4. **Verify in Audit Log database**:
   - [x] New log entries created ✅
   - [x] LOG-1789851306700-621n6qpiq (Deal 349208396518) ✅
   - [x] LOG-1789851307430-w99si9nvc (Deal 349411565273) ✅
   - [x] Workflow = "DS-02" ✅
   - [x] Operation = "Update" ✅
   - [x] Source System = "Notion" ✅
   - [x] Target System = "HubSpot" ✅
   - [x] Fields Changed includes: Expected Close Date ✅
   - [x] Before Values shows old HubSpot values ✅
   - [x] After Values shows new values from Notion ✅
   - [x] Status = "Success" ✅
   - [x] Duration: <3000 ms per deal ✅

**Result**: ✅ **PASS** — Scheduled Notion → HubSpot sync VERIFIED WORKING!

**Sync Statistics**:
- Total runtime: 2.3 seconds
- Deals processed: 2
- Successful syncs: 2
- Conflicts: 0 (this run)
- Errors: 0

---

## 🧪 Test 3: DS-03 (Conflict Detection)

**Goal**: Verify automatic conflict detection when both systems change

### Steps:
1. **Modify the deal in HubSpot**:
   - [x] Changed Amount to $120,000 (Deal ID: 349411565273) ✅

2. **Modify the SAME deal in Notion** (within same hour):
   - [x] Changed Deal Value to $15,000 ✅

3. **Run DS-02 manually**:
   - [x] Executed at 21:00:09 ✅

4. **Verify in Conflicts database**:
   - [x] New conflict record created ✅
   - [x] Conflict ID: `CONFLICT-349411565273-1789851610253` ✅
   - [x] HubSpot Deal ID: 349411565273 ✅
   - [x] HubSpot Deal Name: "Fastn Test Deal" ✅
   - [x] Conflicted Fields: Deal Value, Expected Close Date ✅
   - [x] HubSpot Value: $120,000 (modified 20:58:02) ✅
   - [x] Notion Value: $15,000 (modified 20:57:00) ✅
   - [x] Last Synced: 2026-09-19T20:55:07.420Z ✅
   - [x] Detected At: 2026-09-19 ✅
   - [x] Status = "Pending" ✅

5. **Verify in Audit Log database**:
   - [x] New log entry created (LOG-1789851610792-8odyzvdzq) ✅
   - [x] Workflow = "DS-02" ✅
   - [x] Operation = "Conflict Detected" ✅
   - [x] Source System = "Both" ✅
   - [x] Target System = "N/A" ✅
   - [x] Fields Changed: Deal Value, Expected Close Date ✅
   - [x] Before Values contains both HubSpot and Notion values ✅
   - [x] After Values = "{}" ✅
   - [x] Status = "Success" ✅
   - [x] Duration: 1308 ms ✅

6. **Verify deal NOT updated**:
   - [x] HubSpot still has $120,000 ✅
   - [x] Notion still has $15,000 ✅
   - [x] No overwrite occurred ✅

**Result**: ✅ **PASS** — Conflict detection VERIFIED WORKING!

**Detection Logic Confirmed**:
- ✅ HubSpot modified timestamp (20:58:02) > last sync (20:55:07)
- ✅ Notion modified timestamp (20:57:00) > last sync (20:55:07)
- ✅ Both modifications detected after last sync
- ✅ Conflict record created with both values preserved
- ✅ Sync result: synced=1, conflicts=1, errors=0

---

## 🧪 Test 4: DS-04 (Conflict Resolution)

**Goal**: Verify manual conflict resolution with audit logging

### Steps:
1. **Get the Conflict ID** from the conflict record created in Test 3

2. **Execute DS-04 workflow manually** with input:
```json
{
  "conflict_id": "CONFLICT-[dealId]-[timestamp]",
  "resolution_strategy": "hubspot_wins",
  "resolution_notes": "HubSpot data is authoritative"
}
```

3. **Verify workflow output**:
   - [ ] `success` = true
   - [ ] `systems_updated` includes "notion"
   - [ ] `conflict_resolved` = true
   - [ ] `hubspot_deal_id` matches
   - [ ] `notion_page_id` populated
   - [ ] `applied_values` contains HubSpot's values

4. **Verify in Notion**:
   - [ ] Deal Name updated to "Test Deal - HubSpot Edit"
   - [ ] Deal Value updated to $100,000
   - [ ] (Notion now matches HubSpot)

5. **Verify in Conflicts database**:
   - [ ] Conflict record Status = "Resolved"
   - [ ] Resolution field populated: "hubspot_wins: HubSpot data is authoritative"

6. **Verify in Audit Log database**:
   - [ ] New log entry created
   - [ ] Workflow = "DS-04"
   - [ ] Operation = "Conflict Resolved"
   - [ ] Source System = "Manual"
   - [ ] Target System = "Notion"
   - [ ] Fields Changed includes resolved fields
   - [ ] Before Values contains strategy + both system values
   - [ ] After Values contains final applied values
   - [ ] Status = "Success"

**Result**: ✅ PASS / ❌ FAIL

---

## 🧪 Test 5: State Tracking

**Goal**: Verify state tracking prevents re-detection of resolved conflicts

### Steps:
1. **After Test 4 completes**, wait for next DS-02 hourly sync

2. **Verify NO new conflict created**:
   - [ ] No duplicate conflict record for same deal
   - [ ] Deal continues syncing normally
   - [ ] State tracking working correctly

**Result**: ✅ PASS / ❌ FAIL

---

## 📊 Overall Test Results

| Test | Status | Notes |
|------|--------|-------|
| Test 1: DS-01 Sync | ✅ PASS | Real-time HubSpot → Notion VERIFIED |
| Test 2: DS-02 Sync | ✅ PASS | Scheduled Notion → HubSpot VERIFIED |
| Test 3: Conflict Detection | ✅ PASS | Automatic conflict flagging VERIFIED |
| Test 4: Conflict Resolution | ⏳ NEXT | Ready to test DS-04 resolution |
| Test 5: State Tracking | ⬜ PENDING | After Test 4 completion |

**Overall Status**: ✅ Tests 1-3 Complete | 🔄 Tests 4-5 Remaining

**Verified Date**: September 19, 2026, 21:00 UTC  
**Last Update**: Conflict detection confirmed working — conflict record created with Pending status

---

## 🐛 Troubleshooting

### Test 1 Fails (No Notion page created)
- Check trigger status: `f637d074-2507-4e93-891a-ce338db23723`
- Check workflow executions for DS-01
- Check HubSpot webhook subscriptions
- Verify Notion connection active

### Test 2 Fails (HubSpot not updated)
- Check scheduler status: `1d09d3a5-67d2-4aff-a953-6e413193887a`
- Check workflow executions for DS-02
- Verify deal has HubSpot Deal ID in Notion
- Check HubSpot API credentials

### Test 3 Fails (No conflict created)
- Verify modifications were within same sync window
- Check that both systems' timestamps are newer than last sync
- Check Conflicts database ID correct: `1dbc615c-fdea-434c-bd59-b71068f10e3c`

### Test 4 Fails (Resolution doesn't work)
- Verify Conflict ID copied correctly
- Check workflow input JSON format
- Verify both HubSpot and Notion connections active
- Check workflow execution logs for errors

### Audit Log Missing
- Verify Audit Log database ID: `7850a7a5-66e5-4e05-8605-7b38a4e1277c`
- Check Notion connection has write access to Audit Log
- Review workflow console logs for audit log creation errors

---

## 📝 Test Notes

**Test Date**: __________  
**Tester**: __________  
**Environment**: Production / Staging  

**Additional Observations**:
- 
- 
- 

**Issues Found**:
- 
- 
- 

**Next Steps**:
- 
- 
- 

---

## ✅ Sign-Off

- [ ] All 5 tests passed
- [ ] All audit logs verified
- [ ] State tracking confirmed working
- [ ] No errors in workflow executions
- [ ] Documentation accurate
- [ ] System ready for production use

**Verified By**: __________  
**Date**: __________  
**Signature**: __________

---

**End of Verification Checklist**
