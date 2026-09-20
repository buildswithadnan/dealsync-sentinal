# Google Calendar Custom Connector

**Connector ID**: `babd4b47-26e7-4d69-9cbf-0bd939ce3681`  
**Slug**: `googleCalendarCustom`  
**Status**: Test  
**Created**: September 19, 2026

## Overview

Custom Google Calendar connector with **calendar-only OAuth scopes** that doesn't require Gmail permissions. This solves the blocking issue where the built-in Google connector requires both Calendar and Gmail access.

## Key Features

- ✅ **Calendar-only scopes** - No Gmail permissions required
- ✅ **OAuth 2.0 authentication** with offline access
- ✅ **5 Core actions** for calendar and event management
- ✅ **Private connector** - Only visible to your organization

## OAuth Configuration

### Scopes
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
```

### OAuth Provider Details
- **Provider ID**: `3839cd6f-2c32-4f8b-9663-aba26bfeb6a8`
- **Authorization URL**: `https://accounts.google.com/o/oauth2/auth`
- **Token URL**: `https://oauth2.googleapis.com/token`
- **Access Type**: `offline` (refresh tokens enabled)

## Setup Instructions

### 1. Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Calendar API**
4. Go to **APIs & Services** > **Credentials**
5. Create **OAuth 2.0 Client ID** (Web application)
6. Add authorized redirect URI: `https://oauth.live.fastn.ai`
7. Copy your **Client ID** and **Client Secret**

### 2. Update OAuth Provider

Update the OAuth provider with your Google credentials:

```bash
# Use the Fastn API or dashboard to update provider:
# Provider ID: 3839cd6f-2c32-4f8b-9663-aba26bfeb6a8

# Replace:
# - YOUR_GOOGLE_CLIENT_ID
# - YOUR_GOOGLE_CLIENT_SECRET
```

### 3. Connect to Calendar

1. Go to Fastn Dashboard > Connectors
2. Find "Google Calendar Custom"
3. Click "Connect"
4. Authorize calendar access (no Gmail required!)

## Available Actions

### 1. List Calendars
**Slug**: `listCalendars`  
**Method**: GET  
**Description**: List all calendars accessible to the authenticated user

**Input**:
```javascript
{
  maxResults: 100,     // Optional: Max entries (1-250, default 100)
  pageToken: "string"  // Optional: Pagination token
}
```

**Output**:
```javascript
{
  items: [
    {
      id: "calendar_id",
      summary: "Calendar Name",
      // ... other calendar properties
    }
  ],
  nextPageToken: "string" // For pagination
}
```

**Example**:
```javascript
const calendars = await fastn.connector.googleCalendarCustom.listCalendars({
  maxResults: 50
});
```

---

### 2. List Events
**Slug**: `listEvents`  
**Method**: GET  
**Description**: List events from a specific calendar

**Input**:
```javascript
{
  calendarId: "primary",        // Required: Calendar ID or 'primary'
  maxResults: 250,              // Optional: Max events (1-2500)
  timeMin: "2026-09-19T00:00:00Z", // Optional: Lower bound (RFC3339)
  timeMax: "2026-09-26T00:00:00Z", // Optional: Upper bound (RFC3339)
  singleEvents: true,           // Optional: Expand recurring events
  orderBy: "startTime",         // Optional: 'startTime' or 'updated'
  pageToken: "string"           // Optional: Pagination token
}
```

**Output**:
```javascript
{
  items: [
    {
      id: "event_id",
      summary: "Event Title",
      start: { dateTime: "2026-09-19T10:00:00Z" },
      end: { dateTime: "2026-09-19T11:00:00Z" },
      // ... other event properties
    }
  ],
  nextPageToken: "string"
}
```

**Example**:
```javascript
const events = await fastn.connector.googleCalendarCustom.listEvents({
  calendarId: "primary",
  timeMin: new Date().toISOString(),
  maxResults: 10,
  singleEvents: true,
  orderBy: "startTime"
});
```

---

### 3. Create Event
**Slug**: `createEvent`  
**Method**: POST  
**Description**: Create a new event in a calendar

**Input**:
```javascript
{
  calendarId: "primary",  // Required: Calendar ID
  event: {                // Required: Event object
    summary: "Meeting Title",           // Required
    description: "Meeting description", // Optional
    location: "Office A",              // Optional
    start: {                           // Required
      dateTime: "2026-09-20T10:00:00Z",
      timeZone: "America/Los_Angeles"
    },
    end: {                             // Required
      dateTime: "2026-09-20T11:00:00Z",
      timeZone: "America/Los_Angeles"
    },
    attendees: [                       // Optional
      { email: "person@example.com" }
    ]
  }
}
```

**Output**:
```javascript
{
  id: "event_id",
  status: "confirmed",
  htmlLink: "https://calendar.google.com/..."
}
```

**Example**:
```javascript
const event = await fastn.connector.googleCalendarCustom.createEvent({
  calendarId: "primary",
  event: {
    summary: "Team Standup",
    start: {
      dateTime: "2026-09-20T09:00:00-07:00",
      timeZone: "America/Los_Angeles"
    },
    end: {
      dateTime: "2026-09-20T09:30:00-07:00",
      timeZone: "America/Los_Angeles"
    },
    attendees: [
      { email: "team@example.com" }
    ]
  }
});
```

---

### 4. Update Event
**Slug**: `updateEvent`  
**Method**: PUT  
**Description**: Update an existing event

**Input**:
```javascript
{
  calendarId: "primary",  // Required
  eventId: "event_id",    // Required
  event: {                // Required: Fields to update
    summary: "Updated Title",
    description: "New description",
    // ... any event fields to update
  }
}
```

**Output**:
```javascript
{
  id: "event_id",
  status: "confirmed"
}
```

**Example**:
```javascript
const updated = await fastn.connector.googleCalendarCustom.updateEvent({
  calendarId: "primary",
  eventId: "abc123xyz",
  event: {
    summary: "Updated Meeting Title",
    location: "Zoom: https://zoom.us/j/123456"
  }
});
```

---

### 5. Get Event
**Slug**: `getEvent`  
**Method**: GET  
**Description**: Get details of a specific event

**Input**:
```javascript
{
  calendarId: "primary",  // Required
  eventId: "event_id"     // Required
}
```

**Output**:
```javascript
{
  id: "event_id",
  summary: "Event Title",
  description: "Event description",
  location: "Location",
  start: { dateTime: "2026-09-19T10:00:00Z" },
  end: { dateTime: "2026-09-19T11:00:00Z" },
  attendees: [
    { email: "person@example.com", responseStatus: "accepted" }
  ]
  // ... other event properties
}
```

**Example**:
```javascript
const event = await fastn.connector.googleCalendarCustom.getEvent({
  calendarId: "primary",
  eventId: "abc123xyz"
});
```

---

### 6. Delete Event
**Slug**: `deleteEvent`  
**Method**: DELETE  
**Description**: Delete an event from a calendar

**Input**:
```javascript
{
  calendarId: "primary",  // Required
  eventId: "event_id"     // Required
}
```

**Output**:
```javascript
{
  status: "deleted"
}
```

**Example**:
```javascript
await fastn.connector.googleCalendarCustom.deleteEvent({
  calendarId: "primary",
  eventId: "abc123xyz"
});
```

---

## Common Workflows

### Sync Calendar Events to Database

```javascript
export default async function(ctx) {
  const now = new Date().toISOString();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
  // Get upcoming events
  const response = await fastn.connector.googleCalendarCustom.listEvents({
    calendarId: "primary",
    timeMin: now,
    timeMax: nextWeek,
    singleEvents: true,
    orderBy: "startTime"
  });
  
  // Process events
  for (const event of response.items) {
    await fastn.connector.notion.createPage({
      parent: { database_id: ctx.input.notionDbId },
      properties: {
        Name: { title: [{ text: { content: event.summary } }] },
        Date: { date: { start: event.start.dateTime } }
      }
    });
  }
  
  return { synced: response.items.length };
}
```

### Create Meeting from Form Submission

```javascript
export default async function(ctx) {
  const { title, startTime, endTime, attendees } = ctx.input;
  
  const event = await fastn.connector.googleCalendarCustom.createEvent({
    calendarId: "primary",
    event: {
      summary: title,
      start: {
        dateTime: startTime,
        timeZone: "America/Los_Angeles"
      },
      end: {
        dateTime: endTime,
        timeZone: "America/Los_Angeles"
      },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`
        }
      }
    }
  });
  
  return {
    eventId: event.id,
    meetLink: event.hangoutLink
  };
}
```

---

## Rate Limits

Google Calendar API has the following quotas:
- **Queries per day**: 1,000,000
- **Queries per 100 seconds per user**: 500

The connector handles rate limiting automatically with exponential backoff.

---

## Error Handling

Common errors and solutions:

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 401 | Unauthorized | Reconnect the OAuth connection |
| 403 | Forbidden | Check calendar permissions |
| 404 | Not Found | Verify calendar/event ID exists |
| 429 | Rate Limit | Reduce request frequency |

**Example Error Handling**:
```javascript
try {
  const event = await fastn.connector.googleCalendarCustom.getEvent({
    calendarId: "primary",
    eventId: ctx.input.eventId
  });
  return event;
} catch (error) {
  if (error.status === 404) {
    return { error: "Event not found" };
  }
  throw error; // Re-throw other errors
}
```

---

## Differences from Built-in Connector

| Feature | Built-in | Custom |
|---------|----------|--------|
| **Gmail Required** | ✅ Yes | ❌ No |
| **Calendar Scopes** | All scopes | Calendar + Events only |
| **Visibility** | Public | Private |
| **Customizable** | ❌ No | ✅ Yes |

---

## Troubleshooting

### Connection Fails
1. Verify OAuth credentials are set correctly
2. Check redirect URI matches: `https://oauth.live.fastn.ai`
3. Ensure Google Calendar API is enabled in GCP project

### Events Not Showing
1. Check `timeMin` and `timeMax` parameters
2. Set `singleEvents: true` to expand recurring events
3. Verify calendar access permissions

### Rate Limiting
1. Implement pagination with `pageToken`
2. Add delays between bulk operations
3. Use batch operations when possible

---

## Next Steps

1. **Update OAuth Credentials** - Replace placeholder client ID/secret
2. **Test Connection** - Connect your Google Calendar
3. **Build Workflows** - Use the 6 actions to automate calendar tasks
4. **Add More Actions** - Extend with additional Calendar API endpoints

---

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Fastn Connector Documentation](https://docs.fastn.ai)

---

**Connector Status**: Ready for use after OAuth setup  
**Last Updated**: September 19, 2026
