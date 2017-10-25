window.onload = () => {
    const   auth = document.forms.auth,
            nick = auth.nick,
            message = document.querySelector('.form-message'),
            msgField = document.querySelector('.message-field');
            chat = document.querySelector('.chat'),
            user = document.querySelector('.user');
            

    const socket = io('http://localhost:8080');

    socket.on('connect', () => {
        auth.onsubmit = (e) => {
            e.preventDefault();
            const data = {};
            const val = nick.value;
            if(val.length < 2) {
                nick.classList.add('error');
                return;
            }
            message.style.display = 'flex';
            auth.style.display = 'none';       
            nick.value = '';
            nick.classList.remove('error');
            data.nick = val;

            socket.emit('sendNick', JSON.stringify(data));
            user.innerText = val;
        };
    });
    socket.on('newUser', (data) => {
        const newUser = JSON.parse(data);
        const li = document.createElement('li');
        li.classList.add('newUser');
        li.innerText = 'Новый участник чата ' + newUser.nick;
        chat.appendChild(li);
    });
    message.onsubmit = (e) => {
        e.preventDefault();
        const data = {};
        data.nick = user.innerText;
        data.message = msgField.value;
        msgField.value = '';
        socket.emit('message', JSON.stringify(data));
    };
    socket.on('sendMsg', (msg) => {
        const   objMessage = JSON.parse(msg),
                timeMark = objMessage.time,
                li = document.createElement('li'),
                time = document.createElement('span'),
                author = document.createElement('span'),
                message = document.createElement('span');

        const fullTime = new Date(timeMark);

        li.classList.add('post');
        time.classList.add('post-time');
        author.classList.add('post-author');
        message.classList.add('post-message');

        const minutes = fullTime.getUTCMinutes() < 10 ? "0" + fullTime.getUTCMinutes() : fullTime.getUTCMinutes();
        
        time.innerText = fullTime.getHours()+':'+minutes+':'+fullTime.getUTCSeconds();

        author.innerText = objMessage.nick+': ';
        message.innerText = objMessage.message;

        li.appendChild(time);
        li.appendChild(author);
        li.appendChild(message);
        chat.appendChild(li);

        console.log(msg);
    });
};