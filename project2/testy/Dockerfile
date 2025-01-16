FROM golang:alpine AS build

WORKDIR /usr/src/app/client

COPY . .

# only redownloading dependencies them in subsequent builds if they change
RUN go mod download && go mod verify

RUN go build -v -o /usr/local/bin/app ./...

EXPOSE 8000

CMD ["app"]