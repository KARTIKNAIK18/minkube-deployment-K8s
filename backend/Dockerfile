# Use official Node.js image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend source files
COPY . .

# Expose the port your server listens on
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
