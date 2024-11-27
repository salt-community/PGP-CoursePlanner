# Use the official Node.js image to build the application
FROM node:14 AS build
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Debug step: list files in /app
RUN ls -la /app

# Build the application
RUN npm run build

# Use an official Nginx image to serve the application
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]