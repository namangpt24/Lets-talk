const http=require('http');
const exp=require('express');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
const app=exp();
const server=http.createServer(app);
const port=process.env.PORT || 3000;
app.use(exp.static(__dirname+'/public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})


// server side socket setup 
var users={};
const io=require('socket.io')(server);
io.on('connection',(socket)=>{
    socket.on('newuserjoined',(username)=>{
      users[socket.id]=username;
      socket.broadcast.emit('userjoined',username);
      io.emit('changelist',users);
      
})
    socket.on('disconnect',()=>{
        socket.broadcast.emit('userdisconnected',user=users[socket.id]);
        delete users[socket.id];
        io.emit('changelist',users);
    })

    socket.on('message',(data)=>{
        socket.broadcast.emit('message',data);
    })
    
})


server.listen(port,()=>{
    console.log(`Your server has started at port ${port}`);
})