FROM node:6.9.1

COPY ./node_modules/mash-node-native/scripts/install-dependencies.sh /tmp
RUN bash /tmp/install-dependencies.sh && rm /tmp/install-dependencies.sh

COPY . /opt/wgsa/middle-end
WORKDIR /opt/wgsa/middle-end
RUN npm install

ENV NODE_PATH=/opt/wgsa/middle-end/src \
    NODE_ENV=production

CMD [ "node", "start.js" ]
