# API Service
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS build
WORKDIR /app
COPY ["frontend/package.json", "frontend/pnpm-lock.yaml*", "./"]
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY ["frontend/", "./"]
RUN pnpm build

FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
