# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the secret file into the container
COPY cicd-cloudraya-app-firebase-adminsdk-f08wo-e682c3eb74.json /app/cicd-cloudraya-app-firebase-adminsdk-f08wo-e682c3eb74.json

# Install the application dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Define the command to run the app
CMD [ "npm", "run", "start-prod" ]
