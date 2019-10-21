FROM node:7

# Create app directory
WORKDIR /app
# Copying package.json and package-lock.json using a wildcard
COPY package*.json ./
# Install app dependencies
RUN npm install

# Bundle app source
COPY . ./app

EXPOSE 3000
EXPOSE 33333

CMD ["npm", "start"]

