# Gmail Send Custom Connector

**Status**: Ready to create (awaiting credentials)  
**Created**: September 19, 2026

## Overview

Custom Gmail connector specifically for **sending emails** with minimal OAuth scopes. This connector focuses on email composition and sending without requiring full Gmail read access, making it perfect for automated email workflows.

## Key Features

- ✅ **Send emails** with attachments
- ✅ **Create and manage drafts**
- ✅ **Minimal OAuth scopes** (send, compose, modify only)
- ✅ **HTML and plain text** email support
- ✅ **CC, BCC, and reply-to** support
- ✅ **Thread management**
- ❌ **No inbox read permissions** required

## OAuth Configuration

### Scopes Required
```
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/gmail.compose
https://www.googleapis.com/auth/gmail.modify
```

### Scope Descriptions
| Scope | Purpose |
|-------|---------|
| `gmail.send` | Send emails on behalf of the user |
| `gmail.compose` | Create and manage drafts |
| `gmail.modify` | Modify messages (labels, threads) |

## Connector Specification

```javascript
{
  name: "Gmail Send Custom",
  slug: "gmailSendCustom",
  description: "Send emails with minimal OAuth scopes",
  domain: "gmail.googleapis.com",
  protocol: "REST",
  visibility: "private",
  authMethods: [{
    type: "OAUTH_2",
    title: "OAuth 2.0 (Gmail Send)",
    authConfig: {
      authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      grantType: "authorization_code",
      scopes: [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.modify"
      ],
      params: {
        access_type: "offline",
        prompt: "consent",
        response_type: "code"
      }
    }
  }]
}
```

## Actions to Create

### 1. Send Email (Simple)
**Slug**: `sendEmail`  
**Method**: POST  
**Endpoint**: `/gmail/v1/users/me/messages/send`

**Description**: Send a simple email with HTML or plain text

**Input Schema**:
```javascript
{
  to: "recipient@example.com",           // Required
  subject: "Email Subject",              // Required
  body: "Email body content",            // Required
  bodyType: "html",                      // Optional: "html" or "text" (default: text)
  cc: ["cc@example.com"],               // Optional
  bcc: ["bcc@example.com"],             // Optional
  from: "sender@example.com",           // Optional (defaults to authenticated user)
  replyTo: "reply@example.com"          // Optional
}
```

**HTTP Config**:
```javascript
{
  url: "https://gmail.googleapis.com",
  path: "/gmail/v1/users/me/messages/send",
  method: "POST",
  headers: {
    "Authorization": "Bearer {{credentials.access_token}}",
    "Content-Type": "application/json"
  },
  body: "{{transformedMessage}}",
  bodyType: "json"
}
```

**Transformation Code** (JavaScript):
```javascript
// Build RFC 2822 email format
function buildMessage(input) {
  const lines = [];
  
  // Headers
  lines.push(`To: ${input.to}`);
  if (input.cc && input.cc.length > 0) {
    lines.push(`Cc: ${input.cc.join(', ')}`);
  }
  if (input.bcc && input.bcc.length > 0) {
    lines.push(`Bcc: ${input.bcc.join(', ')}`);
  }
  if (input.from) {
    lines.push(`From: ${input.from}`);
  }
  if (input.replyTo) {
    lines.push(`Reply-To: ${input.replyTo}`);
  }
  lines.push(`Subject: ${input.subject}`);
  
  // Content-Type based on bodyType
  const isHtml = input.bodyType === 'html';
  lines.push(`Content-Type: text/${isHtml ? 'html' : 'plain'}; charset=utf-8`);
  lines.push(''); // Empty line separates headers from body
  
  // Body
  lines.push(input.body);
  
  // Encode as base64url
  const message = lines.join('\r\n');
  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return { raw: encoded };
}

return buildMessage(ctx.input);
```

---

### 2. Send Email with Attachments
**Slug**: `sendEmailWithAttachments`  
**Method**: POST  
**Endpoint**: `/gmail/v1/users/me/messages/send`

**Description**: Send email with file attachments

**Input Schema**:
```javascript
{
  to: "recipient@example.com",
  subject: "Email Subject",
  body: "Email body",
  bodyType: "html",
  attachments: [
    {
      filename: "document.pdf",
      content: "base64EncodedContent",
      mimeType: "application/pdf"
    }
  ],
  cc: ["cc@example.com"],
  bcc: ["bcc@example.com"]
}
```

**Transformation Code** (JavaScript):
```javascript
function buildMultipartMessage(input) {
  const boundary = `boundary_${Date.now()}`;
  const lines = [];
  
  // Headers
  lines.push(`To: ${input.to}`);
  if (input.cc) lines.push(`Cc: ${input.cc.join(', ')}`);
  if (input.bcc) lines.push(`Bcc: ${input.bcc.join(', ')}`);
  lines.push(`Subject: ${input.subject}`);
  lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  lines.push('');
  
  // Body part
  lines.push(`--${boundary}`);
  lines.push(`Content-Type: text/${input.bodyType || 'plain'}; charset=utf-8`);
  lines.push('');
  lines.push(input.body);
  lines.push('');
  
  // Attachment parts
  if (input.attachments) {
    for (const att of input.attachments) {
      lines.push(`--${boundary}`);
      lines.push(`Content-Type: ${att.mimeType}`);
      lines.push(`Content-Disposition: attachment; filename="${att.filename}"`);
      lines.push('Content-Transfer-Encoding: base64');
      lines.push('');
      lines.push(att.content);
      lines.push('');
    }
  }
  
  lines.push(`--${boundary}--`);
  
  // Encode as base64url
  const message = lines.join('\r\n');
  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return { raw: encoded };
}

return buildMultipartMessage(ctx.input);
```

---

### 3. Create Draft
**Slug**: `createDraft`  
**Method**: POST  
**Endpoint**: `/gmail/v1/users/me/drafts`

**Description**: Create an email draft

**Input Schema**:
```javascript
{
  to: "recipient@example.com",
  subject: "Draft Subject",
  body: "Draft body",
  bodyType: "html"
}
```

**HTTP Config**:
```javascript
{
  url: "https://gmail.googleapis.com",
  path: "/gmail/v1/users/me/drafts",
  method: "POST",
  headers: {
    "Authorization": "Bearer {{credentials.access_token}}",
    "Content-Type": "application/json"
  },
  body: {
    "message": "{{transformedMessage}}"
  },
  bodyType: "json"
}
```

---

### 4. Send Draft
**Slug**: `sendDraft`  
**Method**: POST  
**Endpoint**: `/gmail/v1/users/me/drafts/send`

**Description**: Send an existing draft

**Input Schema**:
```javascript
{
  draftId: "draft_id_here"  // Required
}
```

**HTTP Config**:
```javascript
{
  url: "https://gmail.googleapis.com",
  path: "/gmail/v1/users/me/drafts/send",
  method: "POST",
  headers: {
    "Authorization": "Bearer {{credentials.access_token}}",
    "Content-Type": "application/json"
  },
  body: {
    "id": "{{input.draftId}}"
  },
  bodyType: "json"
}
```

---

### 5. Get Message
**Slug**: `getMessage`  
**Method**: GET  
**Endpoint**: `/gmail/v1/users/me/messages/{id}`

**Description**: Get sent message details (for verification)

**Input Schema**:
```javascript
{
  messageId: "message_id_here",  // Required
  format: "full"                 // Optional: full, metadata, minimal
}
```

**HTTP Config**:
```javascript
{
  url: "https://gmail.googleapis.com",
  path: "/gmail/v1/users/me/messages/{{input.messageId}}",
  method: "GET",
  headers: {
    "Authorization": "Bearer {{credentials.access_token}}"
  },
  queryParams: {
    "format": "{{input.format}}"
  }
}
```

---

### 6. List Drafts
**Slug**: `listDrafts`  
**Method**: GET  
**Endpoint**: `/gmail/v1/users/me/drafts`

**Description**: List all drafts

**Input Schema**:
```javascript
{
  maxResults: 100,     // Optional: 1-500
  pageToken: "string"  // Optional: for pagination
}
```

**HTTP Config**:
```javascript
{
  url: "https://gmail.googleapis.com",
  path: "/gmail/v1/users/me/drafts",
  method: "GET",
  headers: {
    "Authorization": "Bearer {{credentials.access_token}}"
  },
  queryParams: {
    "maxResults": "{{input.maxResults}}",
    "pageToken": "{{input.pageToken}}"
  }
}
```

---

### 7. Delete Draft
**Slug**: `deleteDraft`  
**Method**: DELETE  
**Endpoint**: `/gmail/v1/users/me/drafts/{id}`

**Description**: Delete a draft

**Input Schema**:
```javascript
{
  draftId: "draft_id_here"  // Required
}
```

**HTTP Config**:
```javascript
{
  url: "https://gmail.googleapis.com",
  path: "/gmail/v1/users/me/drafts/{{input.draftId}}",
  method: "DELETE",
  headers: {
    "Authorization": "Bearer {{credentials.access_token}}"
  }
}
```

---

## Setup Instructions

### 1. Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Gmail API**
4. Go to **APIs & Services** > **Credentials**
5. Create **OAuth 2.0 Client ID** (Web application)
6. Add authorized redirect URI: `https://oauth.live.fastn.ai`
7. Copy your **Client ID** and **Client Secret**

### 2. Create Connector in Fastn

Use the Fastn API or dashboard to create the connector with the specification above, or run:

```javascript
// After Fastn credentials are reconnected
await fastn.createconnector({
  name: "Gmail Send Custom",
  slug: "gmailSendCustom",
  // ... (use specification from above)
});
```

### 3. Create Actions

Create all 7 actions using the specifications above, each with their respective HTTP configs and transformation code.

### 4. Update OAuth Provider

Update with your Google OAuth credentials (Client ID and Secret).

### 5. Connect and Test

Connect your Google account and test sending an email!

---

## Usage Examples

### Send Simple Email

```javascript
export default async function(ctx) {
  const result = await fastn.connector.gmailSendCustom.sendEmail({
    to: "customer@example.com",
    subject: "Order Confirmation",
    body: "<h1>Thank you for your order!</h1><p>Your order #12345 has been confirmed.</p>",
    bodyType: "html"
  });
  
  return { messageId: result.id, sent: true };
}
```

### Send Email with Attachments

```javascript
export default async function(ctx) {
  // Fetch PDF from URL
  const pdfResponse = await fetch("https://example.com/invoice.pdf");
  const pdfBuffer = await pdfResponse.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
  
  const result = await fastn.connector.gmailSendCustom.sendEmailWithAttachments({
    to: "customer@example.com",
    subject: "Your Invoice",
    body: "Please find your invoice attached.",
    bodyType: "text",
    attachments: [{
      filename: "invoice.pdf",
      content: pdfBase64,
      mimeType: "application/pdf"
    }]
  });
  
  return { messageId: result.id };
}
```

### Create and Send Draft

```javascript
export default async function(ctx) {
  // Create draft
  const draft = await fastn.connector.gmailSendCustom.createDraft({
    to: "team@example.com",
    subject: "Weekly Report",
    body: "<h2>This week's metrics</h2><p>...</p>",
    bodyType: "html"
  });
  
  // Review logic here...
  
  // Send draft
  const sent = await fastn.connector.gmailSendCustom.sendDraft({
    draftId: draft.id
  });
  
  return { sent: true, messageId: sent.id };
}
```

### Bulk Email Send with Rate Limiting

```javascript
export default async function(ctx) {
  const recipients = ctx.input.recipients; // Array of email addresses
  const results = [];
  
  for (let i = 0; i < recipients.length; i++) {
    try {
      const result = await fastn.connector.gmailSendCustom.sendEmail({
        to: recipients[i],
        subject: ctx.input.subject,
        body: ctx.input.body,
        bodyType: "html"
      });
      
      results.push({ email: recipients[i], sent: true, id: result.id });
      
      // Rate limit: 100ms between emails
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      results.push({ email: recipients[i], sent: false, error: error.message });
    }
  }
  
  return {
    total: recipients.length,
    succeeded: results.filter(r => r.sent).length,
    failed: results.filter(r => !r.sent).length,
    results
  };
}
```

### Send Notification Email (HubSpot Deal Created)

```javascript
export default async function(ctx) {
  const deal = ctx.input; // From HubSpot webhook
  
  const emailBody = `
    <h2>New Deal Created</h2>
    <p><strong>Deal Name:</strong> ${deal.dealname}</p>
    <p><strong>Amount:</strong> $${deal.amount}</p>
    <p><strong>Stage:</strong> ${deal.dealstage}</p>
    <p><strong>Owner:</strong> ${deal.hubspot_owner_id}</p>
    <hr>
    <p><a href="https://app.hubspot.com/contacts/deals/${deal.id}">View in HubSpot</a></p>
  `;
  
  await fastn.connector.gmailSendCustom.sendEmail({
    to: "sales-team@example.com",
    subject: `New Deal: ${deal.dealname}`,
    body: emailBody,
    bodyType: "html"
  });
  
  return { notified: true };
}
```

---

## Rate Limits

Gmail API quotas:
- **Quota**: 1 billion requests per day
- **User rate limit**: 250 requests per second
- **Batch requests**: 100 requests per batch

**Daily sending limits** (per Google Workspace account):
- Gmail free: 500 emails/day
- Google Workspace: 2,000 emails/day

---

## Email Format Reference

### HTML Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; }
    .content { padding: 20px; }
    .footer { background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Company</h1>
    </div>
    <div class="content">
      <p>Hello {{name}},</p>
      <p>Your email content here...</p>
    </div>
    <div class="footer">
      <p>© 2026 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

---

## Error Handling

### Common Errors

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 400 | Invalid request | Check email format (RFC 2822) |
| 401 | Unauthorized | Reconnect OAuth |
| 403 | Forbidden | Check OAuth scopes |
| 429 | Rate limit | Implement backoff/retry |
| 500 | Server error | Retry with exponential backoff |

### Error Handling Example

```javascript
async function sendWithRetry(emailData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fastn.connector.gmailSendCustom.sendEmail(emailData);
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        // Rate limited - wait and retry
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (error.status === 500 && attempt < maxRetries) {
        // Server error - retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      
      throw error; // Re-throw if not retryable or max retries reached
    }
  }
}
```

---

## Testing Checklist

- [ ] Send plain text email
- [ ] Send HTML email
- [ ] Send email with CC and BCC
- [ ] Send email with attachment
- [ ] Create draft
- [ ] Send draft
- [ ] List drafts
- [ ] Delete draft
- [ ] Verify email received
- [ ] Test rate limiting handling

---

## Security Best Practices

1. **Never hardcode credentials** - Use Fastn's secure connection storage
2. **Validate email addresses** - Use regex or email validation library
3. **Sanitize HTML content** - Prevent XSS in email bodies
4. **Rate limit sends** - Respect Gmail quotas
5. **Log email activity** - Track what was sent and when
6. **Handle bounces** - Monitor delivery status
7. **Unsubscribe links** - Include in marketing emails

---

## Comparison with Built-in Connector

| Feature | Built-in Gmail | Custom Gmail Send |
|---------|----------------|-------------------|
| **Read Emails** | ✅ Yes | ❌ No |
| **Send Emails** | ✅ Yes | ✅ Yes |
| **OAuth Scopes** | Full access | Send/Compose only |
| **Customizable** | ❌ No | ✅ Yes |
| **Attachments** | ✅ Yes | ✅ Yes |
| **Drafts** | ✅ Yes | ✅ Yes |

---

## Resources

- [Gmail API Documentation](https://developers.google.com/gmail/api/reference/rest)
- [Gmail API Send Guide](https://developers.google.com/gmail/api/guides/sending)
- [RFC 2822 Email Format](https://www.ietf.org/rfc/rfc2822.txt)
- [MIME Types Reference](https://www.iana.org/assignments/media-types/media-types.xhtml)

---

## Next Steps

1. **Reconnect Fastn Workspace** credentials
2. **Create the connector** using the specification
3. **Add all 7 actions** with the provided configs
4. **Set up Google OAuth** app with credentials
5. **Test email sending** workflow
6. **Build automation** for your use cases

---

**Status**: Ready to create after Fastn reconnection  
**Documentation**: Complete  
**Actions**: 7 defined  
**Last Updated**: September 19, 2026
