FROM node:20 as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM httpd:2.4 
EXPOSE 80
COPY --from=base /app/dist /usr/local/apache2/htdocs
