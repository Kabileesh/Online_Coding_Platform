# Use the official Node.js image
FROM node:latest

# Set the working directory
WORKDIR /Backend

# Install necessary tools
RUN apt-get update && apt-get install -y gcc python3 ruby rustc golang

# Copy the Node.js app files to the container
COPY package*.json ./
COPY . .

# Install app dependencies
RUN npm install

# Expose the app port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
