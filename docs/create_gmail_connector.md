# Gmail Send Connector - Creation Script

This document contains the complete setup to create the Gmail Send Custom connector once Fastn credentials are available.

## Step 1: Reconnect Fastn Workspace

Visit: [Reconnect Fastn](https://connect.fastn.dev/u/connect?intent=z6Q_IYTOWUXVYr4xwYUqQ0Jf)

## Step 2: Create Connector

```javascript
// Connector Specification
const connector = {
  name: "Gmail Send Custom",
  slug: "gmailSendCustom",
  description: "Custom Gmail connector for sending emails with minimal OAuth scopes. Send emails, manage drafts, and modify messages without requiring full Gmail read access.",
  domain: "gmail.googleapis.com",
  icon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
  protocol: "REST",
  stage: "test",
  visibility: "private",
  authMethods: [{
    type: "OAUTH_2",
    title: "OAuth 2.0 (Gmail Send)",
    isDefault: true,
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
};

// Create via API
// POST https://api.fastn.ai/v1/connectors
```

## Step 3: Create Actions

### Action 1: Send Email (Simple)

```javascript
{
  connectorId: "CONNECTOR_ID_FROM_STEP_2",
  name: "Send Email",
  slug: "sendEmail",
  description: "Send a simple email with HTML or plain text",
  type: "HTTP",
  stage: "test",
  inputContract: {
    type: "object",
    required: ["to", "subject", "body"],
    properties: {
      to: {
        type: "string",
        description: "Recipient email address"
      },
      subject: {
        type: "string",
        description: "Email subject line"
      },
      body: {
        type: "string",
        description: "Email body content"
      },
      bodyType: {
        type: "string",
        enum: ["text", "html"],
        description: "Content type (default: text)"
      },
      cc: {
        type: "array",
        items: { type: "string" },
        description: "CC recipients"
      },
      bcc: {
        type: "array",
        items: { type: "string" },
        description: "BCC recipients"
      },
      from: {
        type: "string",
        description: "Sender email (defaults to authenticated user)"
      },
      replyTo: {
        type: "string",
        description: "Reply-to address"
      }
    }
  },
  httpConfig: {
    url: "https://gmail.googleapis.com",
    path: "/gmail/v1/users/me/messages/send",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{credentials.access_token}}",
      "Content-Type": "application/json"
    }
  },
  language: "JS",
  code: `
// Transform input to Gmail API format
function buildMessage(input) {
  const lines = [];
  
  // Headers
  lines.push(\`To: \${input.to}\`);
  if (input.cc && input.cc.length > 0) {
    lines.push(\`Cc: \${input.cc.join(', ')}\`);
  }
  if (input.bcc && input.bcc.length > 0) {
    lines.push(\`Bcc: \${input.bcc.join(', ')}\`);
  }
  if (input.from) {
    lines.push(\`From: \${input.from}\`);
  }
  if (input.replyTo) {
    lines.push(\`Reply-To: \${input.replyTo}\`);
  }
  lines.push(\`Subject: \${input.subject}\`);
  
  // Content-Type
  const isHtml = input.bodyType === 'html';
  lines.push(\`Content-Type: text/\${isHtml ? 'html' : 'plain'}; charset=utf-8\`);
  lines.push('');
  
  // Body
  lines.push(input.body);
  
  // Encode as base64url
  const message = lines.join('\\r\\n');
  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/,'');
  
  return { raw: encoded };
}

// Return transformed message for httpConfig.body
return buildMessage(ctx.input);
`
}
```

### Action 2: Send Email with Attachments

```javascript
{
  connectorId: "CONNECTOR_ID",
  name: "Send Email with Attachments",
  slug: "sendEmailWithAttachments",
  description: "Send email with file attachments",
  type: "HTTP",
  stage: "test",
  inputContract: {
    type: "object",
    required: ["to", "subject", "body"],
    properties: {
      to: { type: "string" },
      subject: { type: "string" },
      body: { type: "string" },
      bodyType: {
        type: "string",
        enum: ["text", "html"]
      },
      cc: {
        type: "array",
        items: { type: "string" }
      },
      bcc: {
        type: "array",
        items: { type: "string" }
      },
      attachments: {
        type: "array",
        description: "Array of attachments",
        items: {
          type: "object",
          required: ["filename", "content", "mimeType"],
          properties: {
            filename: { type: "string" },
            content: {
              type: "string",
              description: "Base64 encoded file content"
            },
            mimeType: { type: "string" }
          }
        }
      }
    }
  },
  httpConfig: {
    url: "https://gmail.googleapis.com",
    path: "/gmail/v1/users/me/messages/send",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{credentials.access_token}}",
      "Content-Type": "application/json"
    }
  },
  language: "JS",
  code: `
function buildMultipartMessage(input) {
  const boundary = \`boundary_\${Date.now()}\`;
  const lines = [];
  
  // Headers
  lines.push(\`To: \${input.to}\`);
  if (input.cc) lines.push(\`Cc: \${input.cc.join(', ')}\`);
  if (input.bcc) lines.push(\`Bcc: \${input.bcc.join(', ')}\`);
  lines.push(\`Subject: \${input.subject}\`);
  lines.push(\`Content-Type: multipart/mixed; boundary="\${boundary}"\`);
  lines.push('');
  
  // Body part
  lines.push(\`--\${boundary}\`);
  lines.push(\`Content-Type: text/\${input.bodyType || 'plain'}; charset=utf-8\`);
  lines.push('');
  lines.push(input.body);
  lines.push('');
  
  // Attachments
  if (input.attachments) {
    for (const att of input.attachments) {
      lines.push(\`--\${boundary}\`);
      lines.push(\`Content-Type: \${att.mimeType}\`);
      lines.push(\`Content-Disposition: attachment; filename="\${att.filename}"\`);
      lines.push('Content-Transfer-Encoding: base64');
      lines.push('');
      lines.push(att.content);
      lines.push('');
    }
  }
  
  lines.push(\`--\${boundary}--\`);
  
  // Encode
  const message = lines.join('\\r\\n');
  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/,'');
  
  return { raw: encoded };
}

return buildMultipartMessage(ctx.input);
`
}
```

### Action 3: Create Draft

```javascript
{
  connectorId: "CONNECTOR_ID",
  name: "Create Draft",
  slug: "createDraft",
  description: "Create an email draft",
  type: "HTTP",
  stage: "test",
  inputContract: {
    type: "object",
    required: ["to", "subject", "body"],
    properties: {
      to: { type: "string" },
      subject: { type: "string" },
      body: { type: "string" },
      bodyType: {
        type: "string",
        enum: ["text", "html"]
      }
    }
  },
  httpConfig: {
    url: "https://gmail.googleapis.com",
    path: "/gmail/v1/users/me/drafts",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{credentials.access_token}}",
      "Content-Type": "application/json"
    },
    bodyTemplate: {
      "message": "{{transformedMessage}}"
    }
  },
  language: "JS",
  code: `
// Same buildMessage function as sendEmail
function buildMessage(input) {
  const lines = [];
  lines.push(\`To: \${input.to}\`);
  lines.push(\`Subject: \${input.subject}\`);
  const isHtml = input.bodyType === 'html';
  lines.push(\`Content-Type: text/\${isHtml ? 'html' : 'plain'}; charset=utf-8\`);
  lines.push('');
  lines.push(input.body);
  
  const message = lines.join('\\r\\n');
  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/,'');
  
  return { raw: encoded };
}

return { transformedMessage: buildMessage(ctx.input) };
`
}
```

### Action 4-7: Simple Actions

```javascript
// Action 4: Send Draft
{
  name: "Send Draft",
  slug: "sendDraft",
  httpConfig: {
    url: "https://gmail.googleapis.com",
    path: "/gmail/v1/users/me/drafts/send",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{credentials.access_token}}",
      "Content-Type": "application/json"
    },
    body: { "id": "{{input.draftId}}" }
  }
}

// Action 5: List Drafts
{
  name: "List Drafts",
  slug: "listDrafts",
  httpConfig: {
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
}

// Action 6: Delete Draft
{
  name: "Delete Draft",
  slug: "deleteDraft",
  httpConfig: {
    url: "https://gmail.googleapis.com",
    path: "/gmail/v1/users/me/drafts/{{input.draftId}}",
    method: "DELETE",
    headers: {
      "Authorization": "Bearer {{credentials.access_token}}"
    }
  }
}

// Action 7: Get Message
{
  name: "Get Message",
  slug: "getMessage",
  httpConfig: {
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
}
```

## Step 4: Create OAuth Provider

```javascript
{
  connectorId: "CONNECTOR_ID",
  name: "Gmail Send OAuth Provider",
  clientId: "YOUR_GOOGLE_CLIENT_ID",
  clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
  authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
  authorization: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    grantType: "authorization_code"
  },
  params: {
    access_type: "offline",
    prompt: "consent"
  },
  isDefault: true
}
```

## Step 5: Test

```javascript
// Test workflow
export default async function(ctx) {
  const result = await fastn.connector.gmailSendCustom.sendEmail({
    to: "test@example.com",
    subject: "Test Email",
    body: "<h1>Hello from Fastn!</h1>",
    bodyType: "html"
  });
  
  return { sent: true, messageId: result.id };
}
```

---

## Quick Command Summary

1. Reconnect Fastn: Visit reconnect link
2. Create connector via API/dashboard
3. Create 7 actions with specifications above
4. Create OAuth provider with Google credentials
5. Connect your Google account
6. Test sending an email

**Ready to create once credentials are available!**
