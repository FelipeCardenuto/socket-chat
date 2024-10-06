const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const createServer = (port) => {
    const app = express();
    const server = http.createServer(app);

    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'servidor.html'));
    });

    io.on('connection', (socket) => {
        console.log(`Novo usuário conectado no servidor na porta ${port}!`);

        socket.on('join room', (room) => {
            socket.join(room);
            console.log(`Usuário entrou na sala: ${room}`);
        });

        socket.on('chat message', (data) => {
            console.log(`Mensagem recebida: ${JSON.stringify(data)}`);

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

createServer(3000);
createServer(4000);
createServer(5000);
createServer(5050);