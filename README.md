# Transactions Dispute Portal

Web application for viewing transaction history and filing disputes.

## Tech Stack

- **Backend:** ASP.NET Core 8, Entity Framework Core, PostgreSQL
- **Frontend:** Angular 18, TypeScript, SCSS
- **Deployment:** Docker, Nginx

## Getting Started

Make sure you have Docker installed, then run:

```bash
git clone https://github.com/MpopoGeorge/transactions-dispute-portal.git
cd transactions-dispute-portal
docker-compose up --build
```

Open http://localhost in your browser.

**Login:**
- Email: gtmpopo@gmail.com
- Password: NoPassword123

API docs available at http://localhost:3000/swagger

## Development

**Backend:**
```bash
cd backend/src/TransactionsDisputePortal.Api
dotnet ef database update
dotnet run
```

**Frontend:**
```bash
cd frontend
npm install
ng serve
```

## API

| Endpoint | Description |
|----------|-------------|
| POST /api/auth/login | Login |
| POST /api/auth/register | Register |
| GET /api/transactions | List transactions |
| GET /api/transactions/:id | Transaction details |
| GET /api/disputes | List disputes |
| POST /api/disputes | Create dispute |
