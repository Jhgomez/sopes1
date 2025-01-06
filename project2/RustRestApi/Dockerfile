FROM rust:1.83

WORKDIR /usr/src/redis_client

COPY . .

RUN cargo install --path .

# FROM debian:bullseye-slim

# RUN apt-get update && apt-get install -y glibc-source && rm -rf /var/lib/apt/lists/*

# COPY --from=builder /usr/local/cargo/bin/redis_client /usr/local/bin/redis_client

CMD ["redis_client"]


# /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.33' not found (required by redis_client)

# Switch to Alpine but see here
# https://github.com/orgs/pyinstaller/discussions/5924