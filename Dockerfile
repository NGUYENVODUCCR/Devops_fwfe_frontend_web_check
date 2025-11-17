# Stage 1: Build React App
FROM node:20 AS build

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output vào Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config (port 81)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]
