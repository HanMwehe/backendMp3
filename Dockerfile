FROM node:23.9.0

# Fix GPG error + Install system deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends gnupg ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean && \
    apt-get update && \
    apt-get install -y python3-pip ffmpeg && \
    pip3 install yt-dlp

# Install pnpm global
RUN npm install -g pnpm

# Set workdir
WORKDIR /app

# Copy package.json dan pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install deps pake pnpm
RUN pnpm install

# Copy semua file project
COPY . .

# Expose port + start app
EXPOSE 3000
CMD ["pnpm", "start"]
