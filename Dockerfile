# server
FROM golang:1.17-alpine3.14 as server

WORKDIR /server

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY main.go ./

RUN go build -o server

# runner
FROM node:16-alpine3.14

RUN apk add --no-cache ca-certificates tini

WORKDIR /app/

ENV PATH "/app:${PATH}"

COPY --from=server /server/server .
COPY package*.json ./
COPY docs ./docs/ 

RUN chown -R 1000:1000 /app

USER 1000
EXPOSE 8080

ENTRYPOINT ["tini", "--"]
CMD ["server"]
