# frontend/Dockerfile

FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173

# Start the app 
CMD ["npm", "run", "dev", "--", "--host"]