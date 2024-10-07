// arquivo: server.js

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

const PORTS = [3000, 4000, 5000, 5050];

const createServerInstance = (port) => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*", // Permite todas as origens. Para produção, especifique as origens permitidas.
            methods: ["GET", "POST"]
        }
    });

    // Serve arquivos estáticos da pasta 'public'
    app.use(express.static(path.join(__dirname, 'public')));

    // Rota principal
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html')); // Assegure-se de que o arquivo HTML está nomeado corretamente
    });

    io.on('connection', (socket) => {
        console.log(`Novo usuário conectado no servidor na porta ${port}!`);

        socket.on('join room', (room) => {
            socket.join(room);
            console.log(`Usuário entrou na sala: ${room}`);
        });

        socket.on('chat message', (data) => {
            console.log(`Mensagem recebida: ${JSON.stringify(data)}`);
            // Emite a mensagem para todos os clientes na sala específica
            io.to(data.servidor).emit('chat message', data);
        });

        socket.on('disconnect', () => {
            console.log(`Usuário desconectado do servidor na porta ${port}`);
        });
    });

    server.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
};

// Cria instâncias do servidor para cada porta especificada
PORTS.forEach(port => createServerInstance(port));
