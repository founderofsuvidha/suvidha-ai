#!/bin/bash
set -e

echo "Starting backend server..."
cd backend
npm install
node server.js &
cd ..

echo "Starting frontend server..."
cd frontend
npm install
npm run dev &
cd ..

wait
