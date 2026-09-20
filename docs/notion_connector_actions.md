# Notion Connector - Complete Action Reference

**Connector ID:** `5e9b70b5-25cd-43ae-bcbb-a26ea01f4dbf`  
**Connector Slug:** `notion`  
**Total Actions:** 32 (30 live, 2 test stage)

---

## Database Operations

### 1. **createDatabase** (v1.2 - LIVE)
Create a new database in Notion as a child of a page.

**Required Inputs:**
- `parentPageId` (string) - Parent page ID where the database will be created
- `title` (string) - Title of the database

**Returns:** Database object with id, url, properties schema

---

### 2. **getDatabase** (v1.2 - LIVE)
Retrieve a Notion database by its ID including full properties schema.

**Required Inputs:**
- `databaseId` (string) - The ID of the Notion database

**Returns:** Database object with properties, title, parent, timestamps

---

### 3. **updateDatabase** (v1.4 - LIVE)
Update a Notion database title or archive status.

**Required Inputs:**
- `databaseId` (string) - The ID of the database to update
- `title` (string) - New title for the database

**Optional:**
- `archived` (boolean) - Set true to archive (move to trash), false to restore

**Note:** ⚠️ This action ONLY returns existing properties, it does NOT add new columns to the database schema. To add columns, use Notion UI or the newer Data Source APIs.

**Returns:** Updated database object

---

### 4. **queryDatabase** (v1.2 - LIVE)
Query a Notion database and return matching pages with pagination.

**Required Inputs:**
- `databaseId` (string) - The ID of the database to query
- `page_size` (number) - Number of results per page (max 100)

**Returns:** Paginated list of page objects matching the query

---

## Data Source Operations (New API - Test Stage)

### 5. **createDataSource** (v1.0 - TEST)
Add an additional data source to an existing Notion database. A standard table view is automatically created.

**Required Inputs:**
- `parent` (object) - `{ database_id: "<id>" }` - The parent database
- `properties` (object) - Property schema (e.g., `{ "Name": { "title": {} } }`)

**Optional:**
- `title` (array) - Rich text array for the data source title
- `icon` (object) - Page icon object

**Returns:** Data source object with id and properties schema

---

### 6. **retrieveDataSource** (v1.0 - TEST)
Retrieve a data source object including its properties schema (columns).

**Required Inputs:**
- `data_source_id` (string) - The data source ID

**Returns:** Data source object with full properties schema

---

### 7. **updateDataSource** (v1.0 - TEST)
Updates a data source's properties schema, title, icon, or trash status.

**Required Inputs:**
- `data_source_id` (string) - The data source ID to update

**Optional:**
- `properties` (object) - Property schema updates (set to null to remove)
- `title` (array) - Rich text title array
- `icon` (object) - Icon object
- `in_trash` (boolean) - Move to/from trash
- `parent` (object) - Move to different database

**Returns:** Updated data source object

---

### 8. **queryDataSource** (v1.0 - TEST)
Query a data source with filtering and sorting. Supports up to 10,000 results.

**Required Inputs:**
- `data_source_id` (string) - The data source to query

**Optional:**
- `filter` (object) - Filter conditions (property filters or compound `and`/`or`)
- `sorts` (array) - Sort criteria
- `page_size` (number) - Results per page (max 100)
- `start_cursor` (string) - Pagination cursor
- `filter_properties` (array) - Property names to include (reduces response size)
- `in_trash` (boolean) - Only trashed or non-trashed rows
- `result_type` (enum) - Filter to "page" or "data_source"

**Returns:** Paginated list with results[], has_more, next_cursor

---

### 9. **listDataSourceTemplates** (v1.0 - TEST)
List all page templates available for a data source.

**Required Inputs:**
- `data_source_id` (string) - The data source ID

**Optional:**
- `name` (string) - Filter by name (substring match)
- `page_size` (integer) - Max 100
- `start_cursor` (string) - Pagination cursor

**Returns:** Array of templates with id, name, is_default

---

## Page Operations

### 10. **createPage** (v1.2 - LIVE)
Create a new page in Notion under a parent page or database (simplified).

**Required Inputs:**
- `parentId` (string) - ID of the parent page or database
- `title` (string) - Title of the new page

**Returns:** Page object with id, url, properties

---

### 11. **createPageRaw** (v1.0 - TEST) ⭐ **RECOMMENDED FOR DATABASES**
Create a Notion page from a fully-formed request body. **This is what we're using in DS-01 workflow.**

**Why use this instead of createPage?**
- Supports BOTH parent types: `{ page_id }` AND `{ database_id }`
- Allows custom property names (not hardcoded to "title")
- Supports children blocks (create page with content in one call)

**Required Inputs:**
- `parent` (object) - Either `{ page_id: "..." }` or `{ database_id: "..." }`
- `properties` (object) - Property values (key must match database's title column name)

**Optional:**
- `children` (array) - Up to 100 fully-formed Notion block objects

**Example for database row:**
```json
{
  "parent": { "database_id": "3e096e4b-3d1f-816c-be6e-ea063e993477" },
  "properties": {
    "Name": {
      "title": [{ "text": { "content": "Deal Title" } }]
    },
    "HubSpot Deal ID": {
      "rich_text": [{ "text": { "content": "12345" } }]
    }
  }
}
```

**Returns:** Created page object

---

### 12. **getPage** (v1.1 - LIVE)
Retrieve a Notion page by its ID including all properties.

**Required Inputs:**
- `pageId` (string) - The ID of the Notion page

**Returns:** Page object with properties, parent, timestamps, url

---

### 13. **updatePage** (v1.1 - LIVE)
Update a Notion page properties or archive it.

**Required Inputs:**
- `pageId` (string) - The ID of the page to update
- `archived` (boolean) - Set to true to archive the page

**Returns:** Updated page object

---

### 14. **getPageProperty** (v1.1 - LIVE)
Retrieve a specific property of a Notion page.

**Required Inputs:**
- `pageId` (string) - The page ID
- `propertyId` (string) - The property ID

**Returns:** Paginated property item results

---

## Block Operations

### 15. **getBlock** (v1.1 - LIVE)
Retrieve a single block from Notion by its ID.

**Required Inputs:**
- `blockId` (string) - The ID of the block to retrieve

**Returns:** Block object with type, content, parent

---

### 16. **getBlockChildren** (v1.1 - LIVE)
Retrieve all child blocks of a Notion block or page.

**Required Inputs:**
- `blockId` (string) - The block or page ID

**Optional:**
- `page_size` (string) - Number of results (max 100)

**Returns:** Paginated list of child blocks

---

### 17. **updateBlock** (v1.3 - LIVE)
Update the content of a Notion block.

**Required Inputs:**
- `blockId` (string) - The ID of the block to update
- `content` (string) - New text content for paragraph block

**Returns:** Updated block object

---

### 18. **deleteBlock** (v1.2 - LIVE)
Archive (delete) a Notion block.

**Required Inputs:**
- `blockId` (string) - The ID of the block to delete

**Returns:** Archived block object

---

### 19. **appendBlockChildren** (v1.2 - LIVE)
Append new child blocks to a Notion page or block (simplified - single paragraph only).

**Required Inputs:**
- `blockId` (string) - The block or page ID to append children to
- `content` (string) - Text content for the paragraph block

**Returns:** Array of created block objects

---

### 20. **appendBlockChildrenRaw** (v1.0 - LIVE) ⭐ **RECOMMENDED FOR RICH CONTENT**
Append fully-formed Notion block objects to a page or block. Supports headings, lists, dividers, mixed rich text.

**Required Inputs:**
- `blockId` (string) - The page or block ID
- `children` (array) - Array of fully-formed block objects (max 100)

**Example:**
```json
{
  "blockId": "page-id-here",
  "children": [
    {
      "object": "block",
      "type": "heading_3",
      "heading_3": {
        "rich_text": [{ "type": "text", "text": { "content": "Title" } }]
      }
    },
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "type": "text", "text": { "content": "Content" } }]
      }
    }
  ]
}
```

**Returns:** Array of created block objects

---

## Search Operations

### 21. **search** (v1.3 - LIVE)
Search all pages and databases in a Notion workspace by title.

**Required Inputs:**
- `page_size` (number) - Number of results (max 100)

**Optional:**
- `query` (string) - Search query string (omit to return all)
- `filter` (object) - `{ property: "object", value: "page" }` or `"database"`
- `start_cursor` (string) - Pagination cursor

**Returns:** Paginated list of pages and/or databases

---

## Comment Operations

### 22. **createComment** (v1.2 - LIVE)
Create a comment on a Notion page.

**Required Inputs:**
- `pageId` (string) - The page ID to comment on
- `content` (string) - The text content of the comment

**Returns:** Comment object with id, discussion_id

---

### 23. **listComments** (v1.2 - LIVE)
Retrieve all comments on a Notion page or block.

**Required Inputs:**
- `block_id` (string) - The page or block ID

**Returns:** Paginated list of comment objects

---

### 24. **getComment** (v1.0 - LIVE)
Retrieve a single Notion comment by its comment_id.

**Required Inputs:**
- `commentId` (string) - The UUID of the comment

**⚠️ VERSION WARNING:** Requires Notion-Version 2026-03-11+, but connector uses 2022-06-28. May return validation error.

**Returns:** Comment object with rich_text, parent

---

## User Operations

### 25. **getBotUser** (v1.1 - LIVE)
Retrieve the bot user associated with the current OAuth token.

**No inputs required**

**Returns:** Bot user object with workspace info, limits

---

### 26. **getUser** (v1.1 - LIVE)
Retrieve a specific Notion user by their ID.

**Required Inputs:**
- `userId` (string) - The ID of the user to retrieve

**Returns:** User object with name, email, avatar

---

### 27. **listUsers** (v1.2 - LIVE)
List all users in a Notion workspace.

**Optional:**
- `page_size` (number) - Max 100

**Returns:** Paginated list of user objects (person + bot)

---

## File Upload Operations

### 28. **createFileUpload** (v1.2 - LIVE)
Start a file upload. Returns upload_url to transmit bytes.

**Required Inputs:**
- `mode` (enum) - "single_part" (≤20MB), "multi_part" (>20MB), or "external_url"

**Optional:**
- `filename` (string) - File name with extension (required for multi_part)
- `content_type` (string) - MIME type
- `number_of_parts` (integer) - Required for multi_part (1-10000)
- `external_url` (string) - Required for external_url mode

**Returns:** file_upload object with id, upload_url, status "pending"

---

### 29. **sendFileUpload** (v1.1 - TEST)
Transmit file bytes for a pending upload via multipart/form-data.

**Required Inputs:**
- `fileUploadId` (string) - UUID from createFileUpload
- `file` (binary) - Raw file contents (fastn FileRef)

**Optional:**
- `part_number` (string) - For multi_part: "1" to "1000"

**⚠️ LIMITATION:** fastn executor multipart/form-data support may not work correctly. Classify failures as BLOCKED.

**Returns:** Updated file_upload object

---

### 30. **completeFileUpload** (v1.0 - TEST)
Finalize a multi_part upload after all parts sent.

**Required Inputs:**
- `fileUploadId` (string) - UUID of the multi_part upload

**Returns:** file_upload object with status "uploaded"

---

### 31. **getFileUpload** (v1.1 - LIVE)
Poll upload status for a file_upload object.

**Required Inputs:**
- `fileUploadId` (string) - UUID of the upload

**Returns:** file_upload object with current status

---

### 32. **listFileUploads** (v1.0 - LIVE)
List file_upload objects for the workspace.

**Optional:**
- `status` (enum) - "pending", "uploaded", "expired", "failed"
- `page_size` (integer) - 1-100, default 100
- `start_cursor` (string) - Pagination cursor

**Returns:** Paginated list of file_upload objects

---

## Key Findings & Recommendations

### ✅ **Working Actions for DealSync**
1. **createPageRaw** - Creating database rows (currently using this ✓)
2. **getDatabase** - Reading database schema
3. **queryDatabase** - Querying/searching database rows (for deduplication)
4. **updatePage** - Updating existing rows
5. **search** - Finding databases by name

### ❌ **Broken/Limited Actions**
1. **updateDatabase** - Only returns existing properties, does NOT add new columns
2. **queryDatabase** - Returns 400 "Invalid request URL" (UUID format issue)
3. **getDatabase** - Returns 400 "This API is deprecated" (connector using old endpoint)

### 🆕 **New Data Source APIs (Test Stage)**
The newer **Data Source** APIs (`createDataSource`, `updateDataSource`, `queryDataSource`) might support adding columns programmatically, but they're in TEST stage and require Notion-Version 2026-03-11, while our connector is pinned to 2022-06-28 for compatibility.

### 🎯 **Recommended Path Forward**
1. **Continue using createPageRaw** for creating rows ✓
2. **Add database columns manually via Notion UI** (fastest, most reliable)
3. **Once columns exist**, update DS-01 workflow to map all HubSpot properties
4. **For deduplication**, try `search` action instead of `queryDatabase` (search by page title)

---

## Status Summary

- **Live Actions:** 30
- **Test Stage:** 2 (Data Source APIs + File Upload send/complete)
- **Deprecated:** `getDatabase` endpoint (but action still works for now)
- **Version-Gated:** `getComment` (needs 2026-03-11+)
- **Executor-Limited:** `sendFileUpload` (multipart form-data issues)

---

**Generated:** 2026-09-19  
**For:** DealSync Sentinel Integration
