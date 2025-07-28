#!/bin/bash

# Netlify build script for TanStack Start with Vinxi
set -e

echo "🚀 Starting Netlify build process..."

# Check Node.js version
echo "📦 Node.js version: $(node --version)"
echo "📦 pnpm version: $(pnpm --version)"

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install --frozen-lockfile

# Run database migrations if needed (optional - only if you want to run migrations during build)
# echo "🗄️ Running database migrations..."
# pnpm db:migrate

# Build the application
echo "🏗️ Building application with vinxi..."
pnpm build

# Check if build was successful
if [ -d ".output" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory contents:"
    ls -la .output/
    
    if [ -d ".output/public" ]; then
        echo "📁 Public directory contents:"
        ls -la .output/public/
    fi
    
    if [ -d ".output/server" ]; then
        echo "📁 Server directory contents:"
        ls -la .output/server/
    fi
else
    echo "❌ Build failed - .output directory not found"
    exit 1
fi

echo "🎉 Build process completed!"
