# Usar imagen base de Node.js
FROM node:18

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar http-proxy y express-basic-auth (por si no están en package.json)
RUN npm install http-proxy express-basic-auth

# Copiar el resto del código
COPY . .

# Instalar Netdata
RUN wget -O /tmp/kickstart.sh https://my-netdata.io/kickstart.sh && \
    sh /tmp/kickstart.sh --dont-wait --dont-start

# Exponer el puerto de la app (3000)
EXPOSE 3000

# Iniciar Netdata y la app
CMD ["sh", "-c", "service netdata start && node server.js"]