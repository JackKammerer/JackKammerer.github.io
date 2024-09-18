FROM rust:bullseye as builder
WORKDIR /usr/src/PersonalWebsiteBackend
COPY . .
RUN cargo install --path .



FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/PersonalWebsiteBackend /usr/local/bin/PersonalWebsiteBackend
COPY dist ./dist
COPY images ./images
COPY models ./models
COPY ./dockerFiles/webApp/startWebApp.sh /startWebApp.sh
RUN chmod +x /startWebApp.sh
CMD ["/startWebApp.sh"] 