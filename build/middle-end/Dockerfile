FROM node:7.4.0-alpine

RUN apk add --update --no-cache \
      gsl

RUN apk add --update --no-cache --virtual build-deps \
      autoconf \
      automake \
      g++ \
      gcc \
      git \
      libtool \
      linux-headers \
      make \
      zlib-dev

RUN cd / && \
    git clone --depth 1 --branch alpine https://gitlab.com/cgps/mash/capnproto.git && \
    cd /capnproto/c++ && \
    autoreconf -i && \
    ./configure --enable-shared CXXFLAGS=-fPIC && \
    make -j6 check && \
    make install && \
    cd / && \
    rm -rf /capnproto

COPY . /opt/wgsa/middle-end

RUN cd /opt/wgsa/middle-end/node_modules/mash-original && \
    ./bootstrap.sh && \
    ./configure CXXFLAGS=-fPIC && \
    CPPFLAGS="-fPIC" make && \
    make install

RUN apk del --purge build-deps

ENV NODE_PATH=/opt/wgsa/middle-end/src \
    NODE_ENV=production

WORKDIR /opt/wgsa/middle-end

CMD [ "node", "start.js", "--seneca.log.quiet" ]
