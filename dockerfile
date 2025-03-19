# Gunakan image dasar Node.js dengan versi yang sesuai
FROM node:20

# Set direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan pnpm-lock.yaml terlebih dahulu untuk mengoptimalkan cache layer
COPY package*.json ./

# Install PNPM dan nodemon terlebih dahulu
RUN npm install -g pnpm nodemon

# Install dependencies menggunakan pnpm dengan --frozen-lockfile untuk memastikan konsistensi
RUN pnpm store prune && pnpm i --no-frozen-lockfile

# Menyalin seluruh kode aplikasi ke dalam container
COPY . .

# Expose port yang akan digunakan aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi menggunakan nodemon
CMD ["nodemon", "index.js"]
