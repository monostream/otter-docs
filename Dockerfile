# builder
FROM golang:1.17-alpine3.14 as builder

WORKDIR /builder

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go build

# runner
FROM node:16-alpine3.14

RUN apk add --no-cache ca-certificates tini

WORKDIR /app/

ENV PATH "/app:${PATH}"

COPY --from=builder /builder/otter-docs .
COPY package*.json ./
COPY vuepress ./vuepress/ 

RUN chown -R 1000:1000 /app

USER 1000
EXPOSE 8080

ENTRYPOINT ["tini", "--"]
CMD ["otter-docs"]
