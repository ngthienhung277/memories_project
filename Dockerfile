# Use the official Node 18 image from Docker Hub
FROM node:18

# Create a working directory inside the container
WORKDIR /app

# Copy server's package.json and package-lock.json into the container
COPY server/package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the entire server source code into the container
COPY server ./

# Expose the port your server runs on (adjust if you're using a different port)
EXPOSE 5000

# Command to start the server
CMD ["npm", "start"]
