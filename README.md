# DealSync Sentinel 🚀

**Intelligent Bidirectional Sync Between HubSpot & Notion with Conflict Resolution**

[![Built with Fastn](https://img.shields.io/badge/Built%20with-Fastn-blue)](https://fastn.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## Overview

DealSync Sentinel eliminates manual data entry and prevents data loss by automatically synchronizing deals between HubSpot CRM and Notion databases. Smart conflict detection ensures no updates are ever lost.

### Key Features

✅ **Real-time Sync** - Webhook-triggered instant updates  
✅ **Bidirectional** - Changes flow both ways automatically  
✅ **Conflict Detection** - Alerts when both systems were modified  
✅ **Visual Resolution** - One-click conflict resolution UI  
✅ **Zero Duplicates** - Built-in deduplication logic  
✅ **Full Audit Trail** - Every operation logged  

---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Fastn API credentials to .env.local

# Run development server
npm run dev

# Open http://localhost:3000/dashboard
```

---

## Documentation

📖 **[Complete Documentation](./docs/readme_dealsync.md)** - Full setup guide, architecture, and troubleshooting

### Quick Links

- [Problem & Solution](./docs/readme_dealsync.md#the-problem)
- [How It Works](./docs/readme_dealsync.md#how-it-works)
- [Setup Instructions](./docs/readme_dealsync.md#setup-instructions)
- [Dashboard Usage](./docs/readme_dealsync.md#dashboard-usage)
- [API Reference](./docs/readme_dealsync.md#api-reference)
- [Troubleshooting](./docs/readme_dealsync.md#troubleshooting)

---

## Project Structure

```
dealsync-sentinal/
├── app/
│   ├── dashboard/          # Main dashboard pages
│   │   ├── page.tsx        # Overview dashboard
│   │   └── conflicts/      # Conflict resolution UI
│   │       └── page.tsx
│   └── api/                # API routes
│       ├── conflicts/
│       │   ├── route.ts    # List conflicts
│       │   └── resolve/
│       │       └── route.ts # Resolve conflicts
│       └── sync-stats/
│           └── route.ts    # Get sync statistics
├── docs/
│   └── readme_dealsync.md  # Full documentation
├── fastn-workflows/        # Workflow definitions (to be exported)
├── .env.example            # Environment variables template
└── package.json
```

---

## Workflows

**DS-01**: HubSpot → Notion Deal Sync  
**DS-02**: Notion → HubSpot Sync (with conflict detection)  
**DS-03**: Deal Deletion Handler  
**DS-04**: Conflict Resolution  

See [How It Works](./docs/readme_dealsync.md#how-it-works) for detailed architecture.

---

## Environment Variables

```bash
# Fastn API Configuration
FASTN_API_URL=https://api.fastn.com
FASTN_API_KEY=your_fastn_api_key_here

# Optional: Direct API access
NOTION_API_KEY=your_notion_api_key_here
HUBSPOT_API_KEY=your_hubspot_api_key_here
```

---

## Tech Stack

- **Fastn Platform** - Workflow orchestration, connectors, state management
- **Next.js 16** - React framework with App Router and Server Actions
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful iconography

---

## Screenshots

### Dashboard
![Dashboard Overview](./docs/images/dashboard.png)

### Conflict Resolution
![Conflict Resolution UI](./docs/images/conflicts.png)

---

## Support

- 📖 [Full Documentation](./docs/readme_dealsync.md)
- 🐛 [Report Issues](https://github.com/your-org/dealsync-sentinal/issues)
- 💬 [Discussions](https://github.com/your-org/dealsync-sentinal/discussions)

---

## License

MIT License - See [LICENSE](./LICENSE) for details

---

**Built with ❤️ using Fastn Platform**
