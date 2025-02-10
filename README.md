# Incident Server

A robust backend service for managing incidents, maintenance windows, and status updates with real-time capabilities. This server powers incident management platforms designed for DevOps and SRE teams.

## ✨ Overview

Incident Server provides a comprehensive API for:

- Incident management and tracking
- Maintenance window scheduling
- Component status monitoring
- Real-time updates via WebSockets
- Team collaboration features
- Email notifications with Resend
- Subscriber management

## 🎯 Key Features

### Incident Management

- Create and track incidents
- Real-time incident updates
- Component impact tracking
- Incident timeline management
- Historical data retention
- Email notifications to subscribers

### Maintenance Management

- Schedule maintenance windows
- Track maintenance progress
- Component association
- Timeline updates
- Status changes
- Maintenance notifications

### Component Management

- Service health tracking
- Component status history
- Dependency management
- Real-time status updates

### Communication

- WebSocket integration for real-time updates
- Email notifications via Resend
- Subscriber management
- Custom email templates
- Team notifications

## 🛠️ Built With

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL database
- Resend account for email services
- Clerk account for authentication

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/incident-server.git
```

2. Install dependencies

```bash
cd incident-server
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Generate Prisma client

```bash
npm run postinstall
```

5. Start the development server

```bash
npm run dev
```

## 💻 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_prisma_api_key"

# Prisma Pulse Configuration
PULSE_API_KEY="your_pulse_api_key"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"

# Email Configuration (Resend)
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="your_verified_email@domain.com"

# Security
SECRET_KEY="your_jwt_secret_key"

# Frontend Configuration
FE_BASE_URL="http://localhost:5173"
```

### Environment Variables Description

- **DATABASE_URL**: Prisma database connection URL with API key
- **PULSE_API_KEY**: API key for Prisma Pulse real-time features
- **CLERK_PUBLISHABLE_KEY**: Public key for Clerk authentication
- **CLERK_SECRET_KEY**: Secret key for Clerk authentication
- **RESEND_API_KEY**: API key for Resend email service
- **EMAIL_FROM**: Verified sender email address for notifications
- **SECRET_KEY**: JWT secret key for additional security
- **FE_BASE_URL**: Frontend application URL for CORS and redirects

## 📚 API Documentation

### Incidents

- `POST /api/v1/incident/create` - Create new incident
- `GET /api/v1/incident/list` - List all incidents
- `GET /api/v1/incident/:incidentId` - Get incident details
- `PATCH /api/v1/incident/:incidentId` - Update incident
- `DELETE /api/v1/incident/:incidentId` - Delete incident
- `POST /api/v1/incident/:incidentId/components/attach` - Attach components
- `GET /api/v1/incident/:incidentId/components/list` - List attached components
- `POST /api/v1/incident/:incidentId/components/detach` - Detach components
- `POST /api/v1/incident/:incidentId/updates/create` - Add timeline update
- `GET /api/v1/incident/:incidentId/updates/list` - List timeline updates
- `PATCH /api/v1/incident/:incidentId/updates/:updateId` - Modify update
- `DELETE /api/v1/incident/:incidentId/updates/:updateId` - Delete update

### Maintenance

- `POST /api/v1/maintenance/create` - Schedule maintenance
- `GET /api/v1/maintenance/list` - List maintenance windows
- `GET /api/v1/maintenance/:maintenanceId` - Get maintenance details
- `PATCH /api/v1/maintenance/:maintenanceId` - Update maintenance
- `DELETE /api/v1/maintenance/:maintenanceId` - Delete maintenance
- `POST /api/v1/maintenance/:maintenanceId/updates/create` - Add timeline update
- `GET /api/v1/maintenance/:maintenanceId/updates/list` - List timeline updates

### Components

- `POST /api/v1/component/create` - Create component
- `GET /api/v1/component/list` - List components
- `GET /api/v1/component/:componentId` - Get component details
- `PATCH /api/v1/component/:componentId` - Update component
- `DELETE /api/v1/component/:componentId` - Delete component

### Subscribers

- `POST /api/v1/subscriber/create` - Add new subscriber
- `DELETE /api/v1/subscriber/:subscriberId` - Remove subscriber
- `GET /api/v1/subscriber/list` - List all subscribers

## 🔐 Authentication

Authentication is handled through Clerk, providing:

- Secure API authentication
- Organization management
- Role-based access control
- Team management

## 📧 Email Features

Email functionality powered by Resend:

- Incident notifications
- Maintenance updates
- Status change alerts
- Subscriber management
- Custom email templates
- Development email preview

## 🔄 Real-time Features

WebSocket events for:

- Incident updates (`new-incident`, `incident-updated`)
- Maintenance status changes (`new-maintenance`, `maintenance-updated`)
- Component status updates (`component-update`, `component-deleted`)
- Timeline modifications (`timeline-updated`)
- Team notifications

## 📦 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
