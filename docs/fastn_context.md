# Fastn Platform Context

## Project Overview
Working with the Fastn integration platform which provides:
- Connector framework for 425+ third-party applications
- Unified API for common business entities
- Workflow engine for automations
- Widget system for end-user integrations
- Multi-tenant architecture

## Available Skills (Installed)

### 1. **gateway** (v12) - ✅ INSTALLED
**Location:** `.agents/skills/gateway/SKILL.md`
**Purpose:** Required operating manual - must be read first before any Fastn work
**When to use:** Every task touching fastn connectors, integrations, workflows, or external apps

### 2. **connector_builder** (v2) [global]
**Purpose:** Build and debug fastn connectors (REST, GraphQL, MCP, FTP, DB, gRPC, Lambda)
**When to use:** 
- Creating/editing/testing connectors
- Adding actions to connectors
- Configuring OAuth/API key/AWS auth
- Registering webhooks
- Debugging connector issues

### 3. **integration_builder** (v21) [global]
**Purpose:** Main skill for building integrations
**When to use:**
- Sync/integrate/migrate data between systems
- Build or modify workflows
- Automate on app events
- Set up schedules
- Expose webhooks
- Build widgets

### 4. **unified_api** (v2) [global]
**Purpose:** Configure and use the Fastn Unified API
**Features:**
- Platform-global catalog (crm, ecommerce categories)
- Canonical entities (contact, customer, order)
- Multi-provider execution (HubSpot, Dynamics 365, BigCommerce, Cin7)
**When to use:**
- Create unified APIs
- Map connectors to unified entities
- Call unified API from workflows
- Debug UNIFIED_* errors

### 5. **workflow_verifier** (v6) [global]
**Purpose:** Verify workflows/triggers/widgets actually work end-to-end
**When to use:**
- Test workflows after creation
- Verify triggers fire correctly
- QA integrations
- Health-check existing workflows
- Diagnose failures

## Installation Checklist Template

When starting a task that needs a Fastn skill:

```
Setup:
- [ ] 1. Read gateway playbook (clears access gate)
- [ ] 2. Install gateway playbook 
- [ ] 3. Pick the skill(s) needed for this task
- [ ] 4. Version check: skill {"slugs":["<slug>"]}
- [ ] 5. Already installed at same version? Skip to 7
- [ ] 6. Download and install the skill
- [ ] 7. Read the installed SKILL.md from disk
- [ ] 8. Build task list with TODO tool
```

## Quick Reference

### Available Skill Operations
```json
// List all skills
skill {}

// Load a specific skill
skill {"slug": "gateway"}

// Check version
skill {"slugs": ["gateway"]}

// Open reference document
skill {"slug": "integration_builder", "ref": "plan"}

// Get diff between versions
skill {"slug": "gateway", "knownVersion": 11, "toVersion": 12}

// View change history
skill {"slug": "gateway", "history": true}
```

### Connector Categories (Top)
- AI/ML: 9 connectors
- CRM/Sales: 14 connectors  
- Project Management: 11 connectors
- Productivity: 16 connectors
- Analytics/Monitoring: 10 connectors
- Developer Tools: 10 connectors
- Other: 291 connectors
- **Total: 425 connectors**

## Previous Work

We were exploring the Fastn platform and successfully:
1. Listed available connectors (425 total)
2. Executed a HubSpot search action for deals
3. Loaded and installed the gateway skill

## Next Steps

Based on your requirements, we can:
1. **Build a new integration** - Use `integration_builder` skill
2. **Create/modify a connector** - Use `connector_builder` skill  
3. **Work with unified APIs** - Use `unified_api` skill
4. **Test/verify workflows** - Use `workflow_verifier` skill
5. **Explore specific connectors** - Check available connectors and actions

## Important Notes

- Always read the gateway skill first before any Fastn work
- Skills have reference documents that must be opened per phase
- Version check installed skills before use
- Use TODO tool to track multi-phase tasks
- Fastn MCP tools are namespaced as `mcp_fastn_fastnplatform__*`
