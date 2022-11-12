const http = require('http')
const express = require('express');
const socketio = require("socket.io")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const UserRoutes = require('./routes/api/users')
const morgan = require('morgan')
const cors = require('cors')
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
	socketUsers
} = require('./utils/socketUser');
const RoomRouter = require('./routes/api/Room');
const Chat = require('./models/Chat');
const ChatRouter = require('./routes/api/Chat');
const TopicRouter = require('./routes/api/TopicRouter');
const RoundRouter = require('./routes/api/RoundRouter');

const app = express();
app.use(morgan('dev'))
app.use(cors())

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./config/passport')(passport);

//DB config
const db = require('./config/keys').mongoURI;

//MongoDB connect
mongoose
	.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));


//use routes
app.use('/api/user', UserRoutes);
app.use('/api/room', RoomRouter);
app.use('/api/chat', ChatRouter);
app.use('/api/topic', TopicRouter);
app.use('/api/round', RoundRouter);


// Sockets
io.on('connect', (socket) => {
	socket.on('join', ({ name, room, topic, owner }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room, socket, topic, owner: owner });
		if (error) return callback(error);
		socket.join(user.room);
		socket.emit('message', { sms: { user: 'admin', text: `${user.userName}, Welcome Back to room ${user.room}.`, uid: socket.id }, users: socketUsers() });
		socket.broadcast.to(user.room).emit('message', { sms: { user: 'admin', text: `${user.userName} has joined!` }, users: socketUsers() });
		io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
	});
	socket.on('sendMessage', async (data) => {
		const user = getUser(socket.id);
		console.log("sms recived in server", user, data)
		var sms = { user: user.userName, text: data.message, uid: socket.id }
		await new Chat({ room: user.room, sms })
			.save()
		io.to(user.room).emit('message', { sms });
	});
	socket.on('roundPush', data => {
		console.log(data)
		socket.emit('roundPushBack', { ...data });
		socket.broadcast.to(data.room).emit('roundPushBack', { ...data });
	})
	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		console.log("User Disconnected ")
		if (user) {
			io.to(user.room).emit('message', { user: 'Admin', text: `${user.userName} has left.` });
			io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
		}
	})
});

server.listen(port, () => {
	console.log('server is running on port: ' + port);
})
