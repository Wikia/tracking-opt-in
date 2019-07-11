FROM node:10.15.3
ENV NPM_TOKEN ${NPM_TOKEN}
COPY . ./tracking-opt-in
RUN sh ./tracking-opt-in/release/build/build.sh
