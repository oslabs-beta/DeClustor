FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server ./server
COPY client ./client
# COPY .env ./
RUN rm -rf client/node_modules client/package-lock.json
RUN npm cache clean --force
RUN cd client && npm install --legacy-peer-deps
EXPOSE 3000
EXPOSE 8080
CMD ["npm", "run", "start"]
