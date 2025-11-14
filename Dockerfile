# Stage 1 — Development
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin seluruh source code
COPY . .

# Expose port (sesuai dev server kamu, misal Vite: 5173)
EXPOSE 5173

# Jalankan dev server
CMD ["npm", "run", "dev"]
