#!/bin/bash

# Development setup script for PureDialog

set -e

echo "🔧 Setting up PureDialog development environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📚 Installing dependencies..."
pnpm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.template .env
    echo "⚠️  Please edit .env and add your Gemini API key"
else
    echo "✅ .env file already exists"
fi

# Check if Gemini API key is set
if grep -q "your_gemini_api_key_here" .env 2>/dev/null; then
    echo "⚠️  Warning: Please update your Gemini API key in .env file"
    echo "   Get your API key from: https://aistudio.google.com/app/apikey"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   1. Edit .env and add your Gemini API key"
echo "   2. Run: pnpm dev"
echo ""
echo "🌐 To deploy to Cloud Run:"
echo "   1. Set up Google Cloud CLI and authenticate"
echo "   2. Set environment variables (see env.template)"
echo "   3. Run: ./deploy.sh"
