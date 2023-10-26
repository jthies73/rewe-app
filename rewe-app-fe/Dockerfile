# Use an official Node.js runtime as the base image for building the app
FROM node:20 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i -g ionic
COPY . .
RUN ionic build --prod

# Use Nginx as the production web server
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output from the previous stage
COPY --from=build-stage /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
