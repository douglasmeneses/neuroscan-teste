# ─────────────────────────────────────────────
# Stage 1 – Build static web bundle (Expo/Metro)
# ─────────────────────────────────────────────
FROM node:22.15.0-bookworm-slim AS builder

WORKDIR /app

# Install dependencies first (cache-friendly layer)
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build-time env variable forwarded from docker-compose / --build-arg
# Expo expõe para o bundle client-side qualquer variável prefixada com EXPO_PUBLIC_
ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

# Export static web build → outputs to /app/dist
RUN npx expo export --platform web

# ─────────────────────────────────────────────
# Stage 2 – Serve with Nginx
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Replace default Nginx site config with our custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
