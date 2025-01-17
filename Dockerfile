FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
#COPY server-cert.pem ./
#COPY server-key.pem ./
#COPY .well-known ./

RUN npm install --silent
# If you are building your code for production
#RUN npm ci

# Bundle app source
COPY . .

EXPOSE 21038
CMD [ "npx", "nodemon", "server.js" ]