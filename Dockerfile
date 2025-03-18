FROM node:18

# Install yt-dlp
RUN apt-get update && apt-get install -y yt-dlp

# Copy project & install deps
WORKDIR /app
COPY . .
RUN nodemon

CMD ["node", "index.js"]
