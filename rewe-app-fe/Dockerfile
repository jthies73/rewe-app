# Use an official Node.js runtime as the base image for building the app
FROM node:14 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i -g ionic
COPY . .
RUN ionic build --prod

# Use Nginx as the production web server
FROM nginx:alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
