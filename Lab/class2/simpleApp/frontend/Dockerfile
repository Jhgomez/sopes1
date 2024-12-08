# We're going to use an image based on node.js with Alpine(Linux)
FROM node:22-alpine

# Stablish work directories and copy both package jsons
WORKDIR /usr/src/app
COPY pakcage*.json ./

# Copy rest of files to a work directory
COPY . .

# Build application for production
RUN npm run build

# Expose custom port
EXPOSE 3000

# Execute application
CMD ["npm", "start"]