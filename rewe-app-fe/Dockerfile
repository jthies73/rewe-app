# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Install Ionic CLI globally
RUN npm i -g ionic

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port that the Ionic app will run on (adjust as needed)
EXPOSE 8100

# Build the Ionic app (adjust the command if needed)
RUN npm run build

# Command to start the Ionic app (adjust as needed)
CMD ["ionic", "serve"]

# Example: If you need to pass environment variables to the app
# CMD ["ionic", "serve", "--address", "0.0.0.0", "--port", "8100", "--env", "production"]
