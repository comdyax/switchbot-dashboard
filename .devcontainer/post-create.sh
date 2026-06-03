#!/bin/bash
set -e

sudo apt update
sudo apt install -y postgresql-client

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r ./backend/requirements.txt

echo "Installing Claude CLI..."
npm install -g @anthropic-ai/claude-code

echo "Setting Claude config permissions..."
sudo chown -R vscode:vscode /home/vscode/.claude
ln -sf /home/vscode/.claude/.claude.json /home/vscode/.claude.json

echo "dev environment ready."