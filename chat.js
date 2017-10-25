const   express = require('express'),
        socket = require('socket.io');

const app = express();
app.use(express.static(__dirname + '/public'));

const io = socket.listen(app.listen(8080,() => console.log('Chat starting on port 8080')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public' + '/index.html');
});

io.on('connection', (client) => {
    client.on('sendNick', (data) => {
        client.broadcast.emit('newUser', data);
    });
    client.on('message', (data) => {
        const   time = new Date().getTime(),
                post = JSON.parse(data.toString());
        post.time = time;
        io.emit('sendMsg', JSON.stringify(post));
    });
});