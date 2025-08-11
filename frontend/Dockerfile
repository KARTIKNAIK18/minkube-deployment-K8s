FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of your app source code
COPY . .

# Expose the port your React app runs on (default 3000)
EXPOSE 5173

# Start the React development server
CMD ["npm", "run","dev"]
