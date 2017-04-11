FROM node:7.4.0-alpine

RUN apk add --update --no-cache \
      autoconf \
      automake \
      file \
      g++ \
      gcc \
      git \
      gsl \
      gsl-dev \
      libtool \
      linux-headers \
      make \
      python \
      zlib-dev

RUN git clone --depth 1 --branch alpine https://gitlab.com/cgps/mash/capnproto.git /capnproto && \
    cd /capnproto/c++ && \
    autoreconf -i && \
    ./configure --enable-shared CXXFLAGS=-fPIC && \
    make -j6 check && \
    make install && \
    cd / && \
    rm -rf /capnproto

COPY ./node_modules/mash-original /opt/wgsa/middle-end/node_modules/mash-original

RUN cd /opt/wgsa/middle-end/node_modules/mash-original && \
    ./bootstrap.sh && \
    ./configure CXXFLAGS=-fPIC && \
    CPPFLAGS="-fPIC" make && \
    make install

WORKDIR /opt/wgsa/middle-end

CMD [ "npm", "rebuild" ]
