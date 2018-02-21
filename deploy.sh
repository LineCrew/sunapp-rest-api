npm run compile
pm2 delete main
pm2 start ./build/main.js
