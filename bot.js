import { ApplicationCommandOptionType, Client, Embed, EmbedBuilder, GatewayIntentBits, REST, Routes } from "discord.js";
import sharp from 'sharp';
import fs from 'fs';
import express from "express";
import ejs from "ejs";
import http from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv";
dotenv.config();

const app = express()
const server = http.createServer(app);
const io = new Server(server);
app.set('view engine', 'ejs');

const token = process.env.TOKEN
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
})

bot.on('ready', () => {
    console.log("Bot hazır!");
})

bot.on("messageCreate", (message) => {
    if (message.author.globalName != null) {
        io.emit('chat message', { ad: message.author.globalName, mesaj: message.content });
    }
});

bot.login(token)
server.listen(process.env.PORT || 8000, () => {
    console.log("Server çalışıyor!");
})

app.get('/', (req, res) => {
    res.render("index")
});

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
        const channel = bot.channels.cache.get('1010628353696481320');
        channel.send(`***${msg.ad}:*** ${msg.mesaj}`);
    });
});