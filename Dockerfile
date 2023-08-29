FROM node:16-alpine

ARG NODE_ENV

# Copia de Directorios
ADD ./routes /directory/routes
ADD ./views /directory/views

WORKDIR /directory

# Copia de Archivos
COPY app.js /directory/app.js
COPY package.json /directory/package.json

RUN npm install

#instala dependencias de la app
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV ${NODE_ENV}

EXPOSE 8080

CMD ["node", "app.js"]
