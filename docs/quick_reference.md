# DealSync Sentinel — Quick Reference Card

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: September 19, 2026

---

## 🚀 Quick Start

### Workflow IDs
```
DS-01: wf_af48bc3f80d6  (HubSpot → Notion)
DS-02: wf_cbde2bc0b732  (Notion → HubSpot)
DS-04: wf_bdfedb42bf5d  (Conflict Resolution)
```

### Trigger IDs
```
App Event:  f637d074-2507-4e93-891a-ce338db23723
Scheduler:  1d09d3a5-67d2-4aff-a953-6e413193887a
```

### Database IDs
```
Deals:      3936f2bd-be9b-4b43-ad89-c17e6fcb2ab4
Conflicts:  1dbc615c-fdea-434c-bd59-b71068f10e3c
Audit Log:  7850a7a5-66e5-4e05-8605-7b38a4e1277c
```

---

## 📋 How It Works

### Automatic Sync
1. **Create/update deal in HubSpot** → DS-01 syncs to Notion (< 1 sec)
2. **Update deal in Notion** → DS-02 syncs to HubSpot (every hour)
3. **Edit in both systems** → Conflict detected automatically
4. **Resolve conflict** → Run DS-04 manually

### State Tracking
- Every sync updates: `deal:{id}:last_sync`
- Tracks: timestamp, source, both system modification times
- Prevents duplicate conflict detection

### Audit Logging
- Every operation logged to Audit Log database
- Includes: timestamp, workflow, operation, before/after values, duration
- Non-blocking (syncs continue if logging fails)

---

## 🎯 Workflows

### DS-01: HubSpot → Notion
- **Trigger**: Real-time webhook on deal creation/update
- **Speed**: < 1 second
- **Properties**: 9 fields synced
- **Features**: State tracking, audit logging

### DS-02: Notion → HubSpot
- **Trigger**: Hourly scheduler (0 * * * *)
- **Speed**: ~3 seconds for 2 deals
- **Properties**: 4 writable fields
- **Features**: Conflict detection, state tracking, audit logging

### DS-04: Conflict Resolution
- **Trigger**: Manual execution
- **Strategies**: 4 options
  - `hubspot_wins`: Update Notion
  - `notion_wins`: Update HubSpot
  - `manual_merge`: Update both
  - `dismiss`: Mark resolved
- **Features**: State tracking, audit logging

---

## 🔧 Common Operations

### Manually Run DS-02 Sync
```json
// No input needed
{}
```

### Resolve a Conflict (HubSpot Wins)
```json
{
  "conflict_id": "CONFLICT-349411565273-1726746000000",
  "resolution_strategy": "hubspot_wins",
  "resolution_notes": "HubSpot data is authoritative"
}
```

### Resolve a Conflict (Notion Wins)
```json
{
  "conflict_id": "CONFLICT-349411565273-1726746000000",
  "resolution_strategy": "notion_wins",
  "resolution_notes": "Notion reflects latest sales input"
}
```

### Resolve a Conflict (Manual Merge)
```json
{
  "conflict_id": "CONFLICT-349411565273-1726746000000",
  "resolution_strategy": "manual_merge",
  "merged_values": {
    "dealname": "Final Deal Name",
    "amount": 100000,
    "dealstage": "closedwon",
    "closedate": "2026-12-31"
  },
  "resolution_notes": "Combined best values from both systems"
}
```

### Dismiss a Conflict
```json
{
  "conflict_id": "CONFLICT-349411565273-1726746000000",
  "resolution_strategy": "dismiss",
  "resolution_notes": "False positive - no real conflict"
}
```

---

## 🗂️ Field Mappings

### HubSpot → Notion (DS-01)
| HubSpot | Notion | Type |
|---------|--------|------|
| dealname | Deal Name | Title |
| hs_object_id | HubSpot Deal ID | Text |
| dealstage | Stage | Text |
| amount | Deal Value | Number |
| closedate | Expected Close Date | Date |
| - | CRM | Select (HubSpot) |
| - | Sync Status | Select (Synced) |
| - | Last Synced | Date (Today) |
| - | Last Sync Direction | Select (HubSpot → Notion) |

### Notion → HubSpot (DS-02)
| Notion | HubSpot | Type |
|--------|---------|------|
| Deal Name | dealname | String |
| Deal Value | amount | Number |
| Stage | dealstage | String |
| Expected Close Date | closedate | Date |

---

## 🚨 Conflict Resolution Decision Tree

```
Did both systems change since last sync?
├─ NO → Sync normally (DS-01 or DS-02)
└─ YES → Create conflict record
    │
    Manual review required
    │
    Choose strategy:
    ├─ HubSpot is correct → hubspot_wins
    ├─ Notion is correct → notion_wins
    ├─ Need both values → manual_merge
    └─ False alarm → dismiss
```

---

## 📊 Monitoring

### Check Recent Syncs
1. Open **Audit Log** database in Notion
2. Sort by **Timestamp** (descending)
3. Filter by **Workflow** = DS-01 or DS-02

### Check Recent Conflicts
1. Open **Conflicts** database in Notion
2. Filter by **Status** = Pending
3. Sort by **Detected At** (descending)

### Check Workflow Executions
1. Go to Fastn dashboard
2. Navigate to Workflows
3. Click on workflow → Executions tab
4. View recent runs, logs, and traces

---

## 🐛 Quick Troubleshooting

### Problem: Deals not syncing from HubSpot
**Check**:
- App Event Trigger active?
- DS-01 workflow enabled?
- HubSpot connection active?
- Webhook subscriptions in HubSpot?

### Problem: Deals not syncing from Notion
**Check**:
- Scheduler Trigger active?
- DS-02 workflow enabled?
- Deal has HubSpot Deal ID in Notion?
- Next scheduler run time?

### Problem: Conflict not detected
**Check**:
- Both systems modified within same sync window?
- State tracking working (check fastn.state)?
- Timestamps newer than last sync?

### Problem: Conflict resolution fails
**Check**:
- Conflict ID correct?
- Conflict status still "Pending"?
- Both connections active?
- Input JSON format correct?

### Problem: Audit log missing
**Check**:
- Audit Log database ID correct?
- Notion connection has write access?
- Check workflow console logs?

---

## 📞 Key Resources

### Documentation
- `DEALSYNC_PROJECT_STATUS.md` — Overall status
- `DEALSYNC_COMPLETION_SUMMARY.md` — Final summary
- `VERIFICATION_CHECKLIST.md` — Testing guide
- `DS01_COMPLETION_REPORT.md` — DS-01 details
- `DS02_COMPLETION_REPORT.md` — DS-02 details
- `DS04_COMPLETION_REPORT.md` — DS-04 details
- `DS05_COMPLETION_REPORT.md` — DS-05 details

### Fastn Dashboard
- Workflows: https://[your-fastn-domain]/workflows
- Triggers: https://[your-fastn-domain]/triggers
- Executions: https://[your-fastn-domain]/executions

### Notion Databases
- HubSpot Deals: [Link to database]
- Conflicts: [Link to database]
- Audit Log: [Link to database]

---

## 🔑 State Keys

```javascript
// Per-deal sync state
`deal:{hubspot_deal_id}:last_sync`

// Example value:
{
  "timestamp": "2026-09-19T10:00:00.000Z",
  "source": "hubspot",  // or "notion" or "manual_resolution"
  "hubspot_modified": "2026-09-19T09:55:00.000Z",
  "notion_modified": "2026-09-19T09:58:00.000Z",
  "notion_page_id": "15a73967-4e45-80da-b234-d5ea4e095f67",
  "resolution_strategy": "hubspot_wins"  // only for resolved conflicts
}
```

---

## ⚙️ Configuration

### DS-02 Scheduler (Hourly)
```
Cron: 0 * * * *
Timezone: UTC
Next Run: Every hour on the hour
```

### Retry Policy (All Workflows)
```
Max Attempts: 1
Initial Interval: 5000 ms
Maximum Interval: 60000 ms
Backoff Coefficient: 2
```

### Timeouts
```
DS-01: 120 seconds
DS-02: 120 seconds
DS-04: 120 seconds
```

---

## 📈 Performance Benchmarks

| Operation | Target | Actual |
|-----------|--------|--------|
| DS-01 sync (1 deal) | < 2 sec | ~1 sec |
| DS-02 sync (2 deals) | < 5 sec | ~3 sec |
| DS-04 resolution | < 5 sec | ~2-3 sec |
| Audit log write | < 500 ms | ~200 ms |
| State tracking write | < 200 ms | ~100 ms |

---

## ✅ Health Checklist

Daily:
- [ ] Check Conflicts database for pending conflicts
- [ ] Review Audit Log for failed operations
- [ ] Verify both triggers still active

Weekly:
- [ ] Review DS-02 execution logs
- [ ] Check sync success rate
- [ ] Monitor conflict frequency

Monthly:
- [ ] Audit log retention review
- [ ] Performance metrics analysis
- [ ] Update documentation if needed

---

**Quick Reference Version**: 1.0  
**Last Updated**: September 19, 2026  
**Status**: Production Ready ✅
