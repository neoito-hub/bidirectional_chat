

FROM node:18.12

WORKDIR /app

COPY ./shared/package.json ./ 
COPY ./shared ./

COPY . .

RUN  npm i @appblocks/bb-cli -g
RUN npm i prisma
RUN npm i pm2 -g

# ENV BB_CHAT_APP_DATABASE_URL="postgresql://postgres:postgres@postgres:5432/chat-app?schema=public"

# Expose the port the app runs on
EXPOSE 5001 5000 5002

# Command to run the application
CMD ["bb", "start"]
