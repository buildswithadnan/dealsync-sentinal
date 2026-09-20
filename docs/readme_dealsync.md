# DealSync Sentinel

**Bidirectional HubSpot ↔ Notion Deal Synchronization with Intelligent Conflict Resolution**

---

## The Problem

Sales teams using both HubSpot (CRM) and Notion (workspace) face constant data inconsistencies:

- **Manual double-entry**: Deal information must be updated in both systems separately
- **Data drift**: Changes in one system don't reflect in the other, causing confusion
- **Lost updates**: Team members overwrite each other's work without knowing
- **No conflict detection**: When both systems are modified, the last update wins (data loss)
- **Zero visibility**: No audit trail of what changed, when, or by whom

This wastes hours weekly and leads to missed opportunities, incorrect forecasts, and frustrated teams.

---

## The Solution

**DealSync Sentinel** automates bidirectional synchronization between HubSpot and Notion with intelligent conflict detection and resolution.

### What It Does

1. **Automatic Deal Sync** (HubSpot → Notion)
   - New deals in HubSpot instantly appear in Notion
   - Deal updates (stage changes, amount, close date) sync in real-time
   - Webhook-triggered (no polling delays)

2. **Reverse Sync** (Notion → HubSpot)
   - Updates made in Notion automatically push back to HubSpot
   - Scheduled sync ensures Notion edits propagate
   - Maintains bidirectional consistency

3. **Smart Conflict Detection**
   - Detects when both systems were modified since last sync
   - Creates conflict records with before/after values
   - Prevents silent data overwrites

4. **Conflict Resolution UI**
   - Visual comparison of conflicting values
   - One-click resolution strategies:
     - **HubSpot Wins**: Keep CRM data (source of truth for sales)
     - **Notion Wins**: Keep workspace data (manual overrides)
     - **Manual Merge**: Combine values field-by-field *(coming soon)*
     - **Dismiss**: Ignore false positives
   - Full audit trail of all resolutions

5. **Deal Deletion Sync**
   - Deleted deals in HubSpot are archived in Notion
   - Maintains referential integrity
   - Prevents orphaned records

### Key Features

✅ **Real-time webhooks** - No delays, instant synchronization  
✅ **Deduplication** - Never creates duplicate records  
✅ **Conflict detection** - Protects against data loss  
✅ **Audit logging** - Complete history of every sync operation  
✅ **Status dashboard** - Monitor health, conflicts, and errors  
✅ **Zero-code setup** - Configure via Fastn platform UI  

---

## How It Works

### Architecture

```
HubSpot CRM ──────► Fastn Workflows ◄────── Notion Database
                          │
                          ├─ DS-01: HubSpot → Notion Sync
                          ├─ DS-02: Notion → HubSpot Sync
                          ├─ DS-03: Deal Deletion Handler
                          └─ DS-04: Conflict Resolution
                          │
                          ▼
                   Next.js Dashboard
                   (Monitor & Resolve Conflicts)
```

### Workflows

**DS-01: HubSpot → Notion Deal Sync**
- **Trigger**: HubSpot webhooks (`deal.creation`, `deal.propertyChange`)
- **Actions**: 
  - Fetch deal from HubSpot
  - Check for existing Notion page (deduplication)
  - Create or update Notion page
  - Track sync state
  - Log to audit database

**DS-02: Notion → HubSpot Sync**
- **Trigger**: Scheduled (every 5 minutes)
- **Actions**:
  - Fetch all Notion deal pages
  - Detect conflicts (both systems modified since last sync)
  - If no conflict: update HubSpot
  - If conflict: create conflict record, skip sync

**DS-03: Deal Deletion Sync** *(in progress)*
- **Trigger**: HubSpot webhook (`deal.deletion`)
- **Actions**:
  - Find corresponding Notion page
  - Archive (soft delete) page
  - Clean up sync state

**DS-04: Conflict Resolution**
- **Trigger**: Manual (via UI or API)
- **Actions**:
  - Fetch conflict record
  - Apply resolution strategy
  - Update HubSpot and/or Notion
  - Mark conflict as resolved
  - Update sync state

---

## Data Model

### Notion Databases

**Deals Database** (`3936f2bd-be9b-4b43-ad89-c17e6fcb2ab4`)
| Property | Type | Description |
|----------|------|-------------|
| Deal Name | Title | Name of the deal |
| HubSpot Deal ID | Rich Text | Unique ID from HubSpot (deduplication key) |
| Stage | Rich Text | Deal stage (e.g., "qualifiedtobuy", "appointmentscheduled") |
| Deal Value | Number | Deal amount in currency |
| Expected Close Date | Date | Projected close date |
| CRM | Select | Always "HubSpot" |
| Sync Status | Select | "Synced", "Pending", "Error" |
| Last Synced | Date | Timestamp of last successful sync |
| Last Sync Direction | Select | "HubSpot → Notion", "Notion → HubSpot" |

**Conflicts Database** (`1dbc615c-fdea-434c-bd59-b71068f10e3c`)
| Property | Type | Description |
|----------|------|-------------|
| Conflict ID | Title | Unique conflict identifier |
| HubSpot Deal ID | Rich Text | Deal ID with conflict |
| HubSpot Deal Name | Rich Text | Deal name for quick reference |
| Conflicted Fields | Multi-select | Fields that differ (e.g., "Deal Value", "Stage") |
| HubSpot Value | Rich Text | JSON of HubSpot's current values |
| Notion Value | Rich Text | JSON of Notion's current values |
| Last Synced | Date | When was the last clean sync |
| Detected At | Date | When conflict was detected |
| Status | Select | "Pending", "Resolved" |
| Resolution | Rich Text | How it was resolved |

**Audit Log Database** (`7850a7a5-66e5-4e05-8605-7b38a4e1277c`)
| Property | Type | Description |
|----------|------|-------------|
| Log ID | Title | Unique log entry ID |
| Timestamp | Date | When operation occurred |
| Workflow | Select | DS-01, DS-02, DS-03, or DS-04 |
| Operation | Select | Create, Update, Delete, Conflict Resolved |
| Source System | Select | HubSpot, Notion, or Both |
| Target System | Select | HubSpot, Notion, or N/A |
| HubSpot Deal ID | Rich Text | Affected deal |
| Deal Name | Rich Text | Deal name |
| Fields Changed | Multi-select | Which fields were modified |
| Before Values | Rich Text | JSON of previous state |
| After Values | Rich Text | JSON of new state |
| Status | Select | Success or Failed |
| Duration (ms) | Number | Execution time |

---

## Setup Instructions

### Prerequisites

- Fastn account with platform access
- HubSpot account with API access
- Notion workspace with database access
- Node.js 20.9+ (for the UI dashboard)

### Step 1: Configure Fastn Workflows

1. Import workflows from `fastn-workflows/` directory
2. Configure HubSpot connector with your credentials
3. Configure Notion connector with your integration token
4. Update database IDs in workflow code:
   - `NOTION_DATABASE_ID`: Your Deals database ID
   - `CONFLICTS_DB_ID`: Your Conflicts database ID
   - `AUDIT_LOG_DB_ID`: Your Audit Log database ID

### Step 2: Set Up HubSpot Webhooks

1. In HubSpot, go to Settings → Integrations → Private Apps
2. Create webhook subscriptions:
   - `deal.creation` → DS-01 workflow endpoint
   - `deal.propertyChange` → DS-01 workflow endpoint
   - `deal.deletion` → DS-03 workflow endpoint *(optional)*

### Step 3: Configure Scheduled Sync

1. In Fastn, set up DS-02 workflow trigger
2. Set schedule to run every 5 minutes (or your preferred frequency)

### Step 4: Deploy Next.js Dashboard

```bash
# Clone the repo
git clone <your-repo>
cd dealsync-sentinal

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Fastn API credentials

# Run development server
npm run dev

# Visit http://localhost:3000/dashboard
```

### Step 5: Test the Setup

1. Create a test deal in HubSpot
2. Verify it appears in Notion within seconds
3. Update the deal stage in HubSpot
4. Verify the change syncs to Notion
5. Update deal value in Notion
6. Wait for scheduled sync (or trigger manually)
7. Verify the change syncs to HubSpot

---

## Dashboard Usage

### Main Dashboard (`/dashboard`)

- **Sync Statistics**: View total deals synced, active conflicts, errors
- **Workflow Status**: Monitor DS-01, DS-02, DS-03, DS-04 health
- **Recent Activity**: See latest sync operations in real-time
- **Quick Actions**: Jump to conflicts, sync history, or settings

### Conflicts Page (`/dashboard/conflicts`)

1. View all pending conflicts
2. Select a conflict to see side-by-side comparison
3. Choose resolution strategy:
   - **Keep HubSpot Version**: CRM is source of truth
   - **Keep Notion Version**: Workspace edits take priority
   - **Dismiss**: False positive, no action needed
4. Conflict resolves instantly and updates both systems

### Sync Status Page *(coming soon)*

- View complete sync history
- Filter by workflow, date range, status
- Drill down into individual operations
- Export audit logs for compliance

---

## Deduplication Strategy

**How It Works:**
- Every deal in Notion stores its `HubSpot Deal ID` (unique identifier)
- Before creating a new Notion page, DS-01 workflow:
  1. Searches all pages in Deals database
  2. Filters pages by database ID
  3. Checks if any page has matching `HubSpot Deal ID`
  4. If found: **updates** existing page
  5. If not found: **creates** new page

**Why It Matters:**
- Prevents duplicate deals from being created
- Handles webhook replays gracefully
- Maintains referential integrity
- Idempotent operations (safe to retry)

---

## Conflict Detection Logic

**A conflict is detected when:**
1. Both HubSpot AND Notion have been modified since the last successful sync
2. The modified values are different

**Detection Process (DS-02):**
```javascript
// 1. Get last sync timestamp from state
const lastSync = await fastn.state.get(`deal:${dealId}:last_sync`);

// 2. Check if HubSpot changed since last sync
const hubspotChanged = new Date(deal.hs_lastmodifieddate) > new Date(lastSync.timestamp);

// 3. Check if Notion changed since last sync
const notionChanged = new Date(page.last_edited_time) > new Date(lastSync.timestamp);

// 4. If both changed → CONFLICT!
if (hubspotChanged && notionChanged) {
  // Create conflict record, skip sync
}
```

**What Happens:**
- Sync is **paused** for that deal
- Conflict record is created in Conflicts database
- User is notified to resolve manually
- Other deals continue syncing normally

---

## State Tracking

Each deal maintains sync state in Fastn's state store:

```javascript
{
  "timestamp": "2025-01-20T21:18:14.092Z",  // Last successful sync
  "source": "hubspot",                       // Which system initiated
  "hubspot_modified": "2025-01-20T20:15:00Z", // HubSpot's last modified time
  "notion_modified": "2025-01-20T21:10:00Z",  // Notion's last edited time
  "notion_page_id": "17e9aa9aa0fd806d..."    // Notion page reference
}
```

This enables:
- Accurate conflict detection
- Deduplication across restarts
- Historical tracking
- Debugging sync issues

---

## Performance & Scalability

**Current Capacity:**
- **Real-time sync**: Handles 100+ deals/minute via webhooks
- **Scheduled sync**: Processes 100 deals every 5 minutes
- **Conflict resolution**: < 2 seconds per conflict
- **Dashboard**: Sub-second page loads

**Optimization Opportunities:**
- Batch Notion updates (currently one-by-one)
- Implement caching layer for frequent reads
- Add pagination for large deal lists
- Queue system for high-volume periods

---

## Troubleshooting

### Common Issues

**1. Deal not syncing from HubSpot to Notion**
- ✅ Check HubSpot webhook is active
- ✅ Verify Notion connection is authenticated
- ✅ Inspect audit log for error messages
- ✅ Check database IDs are correct

**2. Notion updates not syncing to HubSpot**
- ✅ Verify DS-02 workflow is scheduled and enabled
- ✅ Check `HubSpot Deal ID` field is populated in Notion
- ✅ Ensure no conflicts are blocking the sync
- ✅ Check HubSpot API limits

**3. Duplicate deals appearing in Notion**
- ✅ This should not happen with current deduplication
- ✅ If it does, check workflow logs for errors during search
- ✅ Manually delete duplicates and note the `HubSpot Deal ID`
- ✅ Report issue for investigation

**4. Conflict not appearing in UI**
- ✅ Conflicts API endpoint may need updating
- ✅ Check Conflicts database has records
- ✅ Verify API credentials in `.env.local`
- ✅ Check browser console for errors

---

## Future Enhancements

### Planned Features

- [ ] **Manual merge UI**: Field-by-field conflict resolution with preview
- [ ] **Bulk operations**: Resolve multiple conflicts at once
- [ ] **Smart suggestions**: AI-powered conflict resolution recommendations
- [ ] **Custom sync rules**: Define which fields sync in which direction
- [ ] **Sync scheduling**: Per-workflow custom schedules
- [ ] **Email notifications**: Alert on conflicts or errors
- [ ] **Slack integration**: Post conflict alerts to team channel
- [ ] **Two-way deletion**: Delete in either system, syncs to both
- [ ] **Field mappings**: Customize HubSpot ↔ Notion property mapping
- [ ] **Multi-database support**: Sync different deal types to different Notion DBs
- [ ] **Contact sync**: Extend to HubSpot contacts
- [ ] **Company sync**: Sync HubSpot companies to Notion

### Technical Improvements

- [ ] Add retry logic with exponential backoff
- [ ] Implement rate limiting and throttling
- [ ] Add comprehensive error monitoring (Sentry integration)
- [ ] Create end-to-end test suite
- [ ] Add performance monitoring dashboard
- [ ] Implement data validation layer
- [ ] Add rollback capability for sync operations

---

## API Reference

### Resolve Conflict

**POST** `/api/conflicts/resolve`

```json
{
  "conflictId": "CONFLICT-349208396518-1789852588866",
  "strategy": "hubspot_wins",
  "mergedValues": null,
  "notes": "CRM is source of truth"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conflict resolved successfully",
  "result": {
    "hubspot_deal_id": "349208396518",
    "notion_page_id": "17e9aa9a...",
    "systems_updated": ["notion"],
    "resolution_timestamp": "2025-01-20T21:30:00.000Z"
  }
}
```

### Get Sync Stats

**GET** `/api/sync-stats`

**Response:**
```json
{
  "synced": 247,
  "conflicts": 2,
  "errors": 0,
  "lastSync": "2025-01-20T21:28:14.092Z"
}
```

### List Conflicts

**GET** `/api/conflicts`

**Response:**
```json
{
  "conflicts": [
    {
      "id": "CONFLICT-349208396518-1789852588866",
      "dealId": "349208396518",
      "dealName": "Web Application Build",
      "status": "Pending",
      "detectedAt": "2025-01-20T20:00:00.000Z",
      "conflictedFields": ["Deal Value", "Expected Close Date"],
      "hubspotValue": { "dealValue": 15000, "closeDate": "2025-01-30" },
      "notionValue": { "dealValue": 8500, "closeDate": "2026-11-29" }
    }
  ]
}
```

---

## Support & Contributing

**Questions?** Open an issue in the repository  
**Bug reports:** Include workflow logs and error messages  
**Feature requests:** Describe your use case and expected behavior

---

## License

MIT License - feel free to use and modify for your needs.

---

## Acknowledgments

Built with:
- **Fastn Platform** - Workflow orchestration and connectors
- **Next.js 16** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful open-source icons
- **TypeScript** - Type-safe development

---

**DealSync Sentinel** - Never lose a deal update again. 🚀
