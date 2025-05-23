# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Accept the env variable as build argument
ARG VITE_BASE_URL

# Define it as an environment variable for Vite to use
ENV VITE_BASE_URL=$VITE_BASE_URL

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application with VITE_BASE_URL available
RUN npm run build

# Production stage using Nginx
FROM nginx:stable-alpine

# Copy the built files from the build stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
