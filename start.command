#!/bin/bash
cd "$(dirname "$0")"
[ ! -d node_modules ] && npm install

# Kill any processes already holding our ports
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

npm run dev &
sleep 4
open http://localhost:5173
wait
