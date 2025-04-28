# Usar imagen base de Node.js
FROM node:18

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Instalar http-proxy y express-basic-auth
RUN npm install http-proxy express-basic-auth

# Instalar dependencias necesarias para Netdata
RUN apt-get update && apt-get install -y \
    curl \
    zlib1g \
    libuuid1 \
    libuv1 \
    libmnl0 \
    libjson-c-dev \
    net-tools \
    procps \
    && apt-get clean

# Copiar el resto del código
COPY . .

# Instalar Netdata con opciones para minimizar recursos
RUN wget -O /tmp/kickstart.sh https://my-netdata.io/kickstart.sh && \
    sh /tmp/kickstart.sh --dont-wait --dont-start --disable-telemetry --no-updates

# Configurar Netdata: puerto, menos recursos, y vincular a Netdata Cloud
RUN echo "[web]\n  bind to = 127.0.0.1:19999" >> /etc/netdata/netdata.conf && \
    echo "[global]\n  memory mode = none\n  history = 300" >> /etc/netdata/netdata.conf && \
    echo "[cloud]\n  enabled = yes\n  claiming token = rzCSX5SEiszZenKI6OA0qMLgM9CcWQqw1T774CxWWIRED90--argd0NF0qJLbKTI\n  claiming rooms = 60979d3f-0a76-4547-a268-14ccdc9ceD28\n  claiming url = https://app.netdata.cloud" >> /etc/netdata/netdata.conf && \
    echo "[plugins]\n  proc = yes\n  disk = yes\n  apps = no\n  cgroups = no\n  tc = no\n  go.d = yes" >> /etc/netdata/netdata.conf

# Configurar Netdata para leer métricas de Prometheus desde tu app
RUN echo "[prometheus:local]\n  enabled = yes\n  url = http://localhost:3000/metrics" >> /etc/netdata/go.d/prometheus.conf

# Exponer el puerto de la app (3000)
EXPOSE 3000

# Iniciar Netdata con depuración y luego la app
CMD ["sh", "-c", "/usr/sbin/netdata -D -v && sleep 5 && netstat -tuln | grep 19999 && ps aux | grep netdata && node server.js"]