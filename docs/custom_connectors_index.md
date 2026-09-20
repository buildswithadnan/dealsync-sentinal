# Custom Google Connectors - Complete Index

**Created**: September 19, 2026  
**Purpose**: Separate Google Calendar and Gmail access without permission conflicts

---

## Overview

This workspace includes two custom Google connectors that solve the blocking issue where the built-in Google connector requires both Calendar and Gmail permissions together. These custom connectors use **minimal, focused OAuth scopes** for each service.

---

## 🗂️ Available Connectors

### 1. Google Calendar Custom ✅ CREATED

**Documentation**: [google_calendar_custom_connector.md](./google_calendar_custom_connector.md)

**Status**: Created and ready to use (needs OAuth setup)

**Connector Details**:
- **ID**: `babd4b47-26e7-4d69-9cbf-0bd939ce3681`
- **Slug**: `googleCalendarCustom`
- **OAuth Provider ID**: `3839cd6f-2c32-4f8b-9663-aba26bfeb6a8`

**OAuth Scopes**:
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
```

**Actions (6)**:
1. `listCalendars` - List all calendars
2. `listEvents` - List events from a calendar
3. `createEvent` - Create new event
4. `updateEvent` - Update existing event
5. `getEvent` - Get event details
6. `deleteEvent` - Delete event

**Use Cases**:
- Sync calendar events to Notion/HubSpot
- Create meetings from form submissions
- Schedule automation based on calendar
- Event reminders and notifications

---

### 2. Gmail Send Custom 📝 DOCUMENTED

**Documentation**: [gmail_send_custom_connector.md](./gmail_send_custom_connector.md)  
**Setup Script**: [create_gmail_connector.md](./create_gmail_connector.md)

**Status**: Documented and ready to create (awaiting Fastn credentials)

**OAuth Scopes**:
```
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/gmail.compose
https://www.googleapis.com/auth/gmail.modify
```

**Actions (7)**:
1. `sendEmail` - Send simple email (HTML/text)
2. `sendEmailWithAttachments` - Send with file attachments
3. `createDraft` - Create email draft
4. `sendDraft` - Send existing draft
5. `listDrafts` - List all drafts
6. `deleteDraft` - Delete draft
7. `getMessage` - Get sent message details

**Use Cases**:
- Transactional emails (orders, confirmations)
- Notification emails (alerts, updates)
- Automated reports via email
- HubSpot/Notion → Email workflows
- Bulk email campaigns

---

## 🎯 Problem Solved

### The Issue

The built-in Google connector requires **all permissions at once**:
- Calendar permissions
- Gmail permissions
- Drive permissions (if needed)
- Etc.

This causes **blocking** when you only need one service, because:
1. Users may not want to grant all permissions
2. Admin approval may be blocked for unnecessary scopes
3. Security policies may prevent broad access
4. OAuth consent screen shows too many permissions

### The Solution

**Separate connectors with minimal scopes**:
- ✅ Calendar connector → Calendar-only scopes
- ✅ Gmail connector → Send-only scopes
- ✅ Each connector requests only what it needs
- ✅ No blocking, no over-permission
- ✅ Cleaner OAuth consent screens

---

## 📊 Comparison Table

| Feature | Built-in Google | Calendar Custom | Gmail Send Custom |
|---------|----------------|-----------------|-------------------|
| **Calendar Access** | ✅ Full | ✅ Full | ❌ No |
| **Gmail Access** | ✅ Full | ❌ No | ✅ Send only |
| **Drive Access** | ✅ Full | ❌ No | ❌ No |
| **OAuth Scopes** | 10+ scopes | 2 scopes | 3 scopes |
| **Permission Blocking** | ❌ Yes | ✅ No | ✅ No |
| **Customizable** | ❌ No | ✅ Yes | ✅ Yes |
| **Private/Org Only** | ❌ No | ✅ Yes | ✅ Yes |

---

## 🚀 Getting Started

### Prerequisites

1. **Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use existing

2. **Enable APIs**
   - Enable **Google Calendar API** (for Calendar connector)
   - Enable **Gmail API** (for Gmail connector)

3. **Create OAuth Credentials**
   - Go to **APIs & Services** > **Credentials**
   - Create **OAuth 2.0 Client ID** (Web application)
   - Add redirect URI: `https://oauth.live.fastn.ai`
   - Copy **Client ID** and **Client Secret**

### Setup Flow

#### For Google Calendar Custom

1. ✅ Connector already created
2. Update OAuth provider (`3839cd6f-2c32-4f8b-9663-aba26bfeb6a8`)
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your Client ID
4. Replace `YOUR_GOOGLE_CLIENT_SECRET` with your Client Secret
5. Connect your Google account
6. Start using in workflows!

#### For Gmail Send Custom

1. Reconnect Fastn Workspace credentials
2. Follow creation script: `create_gmail_connector.md`
3. Create connector and all 7 actions
4. Create OAuth provider with your credentials
5. Connect your Google account
6. Start sending emails!

---

## 📖 Documentation Structure

```
docs/
├── custom_connectors_index.md              # This file (overview)
│
├── Google Calendar Custom/
│   └── google_calendar_custom_connector.md # Complete guide
│
└── Gmail Send Custom/
    ├── gmail_send_custom_connector.md      # Complete guide
    └── create_gmail_connector.md           # Creation script
```

---

## 💻 Usage Examples

### Example 1: Calendar Event → Email Notification

```javascript
export default async function(ctx) {
  // 1. Create calendar event
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
      }
    }
  });
  
  // 2. Send confirmation email
  await fastn.connector.gmailSendCustom.sendEmail({
    to: "team@example.com",
    subject: "Meeting Created: Team Standup",
    body: `
      <h2>New Meeting Scheduled</h2>
      <p><strong>Title:</strong> Team Standup</p>
      <p><strong>Time:</strong> Sept 20, 2026 at 9:00 AM PST</p>
      <p><a href="${event.htmlLink}">View in Calendar</a></p>
    `,
    bodyType: "html"
  });
  
  return { eventCreated: true, emailSent: true };
}
```

### Example 2: Upcoming Events Daily Digest

```javascript
export default async function(ctx) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  // Get today's events
  const response = await fastn.connector.googleCalendarCustom.listEvents({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: tomorrow.toISOString(),
    singleEvents: true,
    orderBy: "startTime"
  });
  
  // Build email body
  let body = "<h2>Today's Schedule</h2>";
  if (response.items.length === 0) {
    body += "<p>No events scheduled for today.</p>";
  } else {
    body += "<ul>";
    for (const event of response.items) {
      const time = new Date(event.start.dateTime).toLocaleTimeString();
      body += `<li><strong>${time}</strong> - ${event.summary}</li>`;
    }
    body += "</ul>";
  }
  
  // Send digest
  await fastn.connector.gmailSendCustom.sendEmail({
    to: ctx.input.userEmail,
    subject: "Your Daily Schedule",
    body: body,
    bodyType: "html"
  });
  
  return { eventCount: response.items.length, sent: true };
}
```

### Example 3: Meeting Invitation from Form

```javascript
export default async function(ctx) {
  const { title, date, time, attendees, description } = ctx.input;
  
  // Create calendar event
  const startDateTime = `${date}T${time}:00-07:00`;
  const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000)
    .toISOString();
  
  const event = await fastn.connector.googleCalendarCustom.createEvent({
    calendarId: "primary",
    event: {
      summary: title,
      description: description,
      start: { dateTime: startDateTime, timeZone: "America/Los_Angeles" },
      end: { dateTime: endDateTime, timeZone: "America/Los_Angeles" },
      attendees: attendees.map(email => ({ email }))
    }
  });
  
  // Send invitation emails
  for (const email of attendees) {
    await fastn.connector.gmailSendCustom.sendEmail({
      to: email,
      subject: `Meeting Invitation: ${title}`,
      body: `
        <h2>You're Invited!</h2>
        <p><strong>Meeting:</strong> ${title}</p>
        <p><strong>When:</strong> ${date} at ${time}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><a href="${event.htmlLink}">Add to Calendar</a></p>
      `,
      bodyType: "html"
    });
  }
  
  return { 
    eventId: event.id, 
    invitationsSent: attendees.length 
  };
}
```

---

## 🔧 Troubleshooting

### Calendar Connector Issues

| Problem | Solution |
|---------|----------|
| OAuth fails | Verify Client ID/Secret are correct |
| Events not showing | Check timeMin/timeMax parameters |
| Permission denied | Ensure calendar scopes are enabled |

**See full guide**: [google_calendar_custom_connector.md](./google_calendar_custom_connector.md#troubleshooting)

### Gmail Connector Issues

| Problem | Solution |
|---------|----------|
| Email not sending | Check base64url encoding is correct |
| Rate limited | Implement exponential backoff |
| Attachment fails | Verify base64 encoding and MIME type |

**See full guide**: [gmail_send_custom_connector.md](./gmail_send_custom_connector.md#error-handling)

---

## 🔐 Security Best Practices

1. **Minimal Scopes**: Only request permissions you need
2. **Credential Storage**: Use Fastn's secure connection storage
3. **Rate Limiting**: Respect Google API quotas
4. **Audit Logging**: Track connector usage
5. **Token Refresh**: Let Fastn handle OAuth token refresh
6. **Error Handling**: Always wrap connector calls in try-catch
7. **Data Validation**: Validate inputs before API calls

---

## 📈 Rate Limits

### Google Calendar API
- **Queries per day**: 1,000,000
- **Queries per 100 seconds per user**: 500

### Gmail API
- **Quota**: 1 billion requests per day
- **User rate limit**: 250 requests per second
- **Daily sending limit**: 
  - Gmail free: 500 emails/day
  - Google Workspace: 2,000 emails/day

---

## 🎓 Learning Resources

### Google APIs
- [Google Calendar API Docs](https://developers.google.com/calendar/api/v3/reference)
- [Gmail API Docs](https://developers.google.com/gmail/api/reference/rest)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

### Fastn Platform
- [Fastn Documentation](https://docs.fastn.ai)
- [Connector Development Guide](https://docs.fastn.ai/connectors)
- [Workflow Examples](https://docs.fastn.ai/workflows)

---

## 📝 Change Log

### 2026-09-19

**Google Calendar Custom**:
- ✅ Connector created
- ✅ 6 actions configured
- ✅ OAuth provider set up
- ✅ Documentation complete
- ⏳ Awaiting OAuth credentials

**Gmail Send Custom**:
- ✅ Connector specification defined
- ✅ 7 actions documented
- ✅ Creation script prepared
- ✅ Usage examples provided
- ⏳ Awaiting Fastn credentials reconnection

---

## 🚦 Current Status

| Connector | Status | Actions | OAuth | Ready to Use |
|-----------|--------|---------|-------|--------------|
| **Calendar Custom** | ✅ Created | 6/6 | ⏳ Setup | After OAuth |
| **Gmail Send** | 📝 Documented | 7/7 specs | ⏳ Setup | After creation |

---

## 🎯 Next Actions

1. **For Calendar Connector**:
   - [ ] Set up Google OAuth app
   - [ ] Update OAuth provider with credentials
   - [ ] Test calendar event creation
   - [ ] Build first workflow

2. **For Gmail Connector**:
   - [ ] Reconnect Fastn Workspace
   - [ ] Create connector via API
   - [ ] Create all 7 actions
   - [ ] Set up OAuth provider
   - [ ] Test email sending

---

## 💡 Future Enhancements

### Potential Additions

**Calendar Connector**:
- ACL management
- Free/busy queries
- Calendar settings
- Event reminders
- Recurring event patterns

**Gmail Connector**:
- Template support
- Email tracking
- Bounce handling
- Thread management
- Label operations

---

## 📞 Support

For issues or questions:

1. Check the individual connector documentation
2. Review troubleshooting sections
3. Verify OAuth credentials are correct
4. Test with simple examples first
5. Check Fastn execution logs

---

**Last Updated**: September 19, 2026  
**Maintained By**: Your Organization  
**Status**: Active Development
