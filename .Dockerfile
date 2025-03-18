FROM node:18

# Install yt-dlp + ffmpeg
RUN apt-get update && \
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
