# Builder image
FROM node:16.15.1-alpine3.16 AS builder

# Copy source code
WORKDIR /package
COPY . /package

# Install dependencies
RUN rm package-lock.json
RUN npm install

# Final image
FROM node:16.15.1-alpine3.16 AS final

WORKDIR /app
COPY --from=builder /package .

# Execute
ENTRYPOINT ["node", "app.js"]