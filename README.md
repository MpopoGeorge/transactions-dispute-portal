# Transactions Dispute Portal

A full-stack web application for customers to view their transaction history and file disputes. Built with ASP.NET Core 8 and Angular 18.

## Tech Stack

**Backend:** ASP.NET Core 8, Entity Framework Core, PostgreSQL, JWT Authentication

**Frontend:** Angular 18, TypeScript, RxJS, SCSS

**Infrastructure:** Docker, Docker Compose, Nginx

## Quick Start

### Prerequisites
- Docker and Docker Compose

### Run with Docker

```bash
git clone <repository-url>
cd transactions-dispute-portal
docker-compose up --build
```

**Access:**
- Frontend: http://localhost
- API: http://localhost:3000
- Swagger: http://localhost:3000/swagger

**Test Account (Mpopo Credentials):**
```
Email: gtmpopo@gmail.com
Password: NoPassword123
```

### Stop
```bash
docker-compose down
```

## Local Development

### Backend

```bash
cd backend/src/TransactionsDisputePortal.Api
# Update connection string in appsettings.Development.json
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Transactions
- `GET /api/transactions` - List transactions
- `GET /api/transactions/{id}` - Transaction details
- `GET /api/transactions/summary` - Summary stats

### Disputes
- `GET /api/disputes` - List disputes
- `GET /api/disputes/{id}` - Dispute details
- `POST /api/disputes` - Create dispute
- `PATCH /api/disputes/{id}` - Update dispute

## Project Structure

```
├── backend/
│   └── src/TransactionsDisputePortal.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Models/
│       ├── Services/
│       └── Program.cs
├── frontend/
│   └── src/app/
│       ├── core/           # Services, guards, interceptors
│       ├── features/       # Auth, Dashboard, Transactions, Disputes
│       └── shared/         # Shared components
├── docker-compose.yml
└── Dockerfile
```

## License

MIT
