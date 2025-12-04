# Build backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-builder
WORKDIR /src

COPY backend/TransactionsDisputePortal.Api.sln ./
COPY backend/src/TransactionsDisputePortal.Api/TransactionsDisputePortal.Api.csproj ./src/TransactionsDisputePortal.Api/

RUN dotnet restore

COPY backend/ .

WORKDIR /src/src/TransactionsDisputePortal.Api
RUN dotnet publish -c Release -o /app/backend --no-restore

# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Production image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS production
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=backend-builder /app/backend ./backend
COPY --from=frontend-builder /app/frontend/dist/transactions-dispute-portal/browser ./frontend/dist
COPY frontend/nginx.conf /etc/nginx/sites-available/default

RUN mkdir -p /var/log/supervisor
COPY <<EOF /etc/supervisor/conf.d/app.conf
[supervisord]
nodaemon=true
user=root

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:backend]
command=dotnet /app/backend/TransactionsDisputePortal.Api.dll
directory=/app/backend
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=ASPNETCORE_URLS="http://+:3000",ASPNETCORE_ENVIRONMENT="Production"
EOF

EXPOSE 80 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/health && curl -f http://localhost:3000/health || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
