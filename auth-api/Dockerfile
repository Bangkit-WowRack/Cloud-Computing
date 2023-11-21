# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install --only=dependencies

# Bundle the app source inside the Docker image
COPY . .

# Define the command to run the app
CMD [ "npm", "start-prod" ]
