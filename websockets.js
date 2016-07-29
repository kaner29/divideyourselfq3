module.exports = app => {
  var server = require('http').createServer(),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({server: server}),
    openSockets = [];

  wss.on('connection', ws => {

    ws.on('message', e => {
      var data = JSON.parse(e),
        toUserSocket = openSockets.find(e => e.username === data.toUser),
        fromUserSocket = openSockets.find(e => e.username === data.fromUser);
      if(data.connect){
        if(fromUserSocket) fromUserSocket.ws.close();
        openSockets.forEach(userSocket => {
          userSocket.ws.send(JSON.stringify({online: true, fromUser: data.fromUser}));
        });
        openSockets.push({ws: ws, username: data.fromUser});
      }
      else if(toUserSocket){
        toUserSocket.ws.send(JSON.stringify({
          fromUser: data.fromUser,
          message: data.message,
          timestamp: data.timestamp
        }));
      }
    });

    ws.on('close', () => {
      var fromUser = openSockets.find(e => e.ws === ws).username;
      openSockets = openSockets.filter(e => e.ws !== ws);
      openSockets.forEach(userSocket => {
        userSocket.ws.send(JSON.stringify({offline: true, fromUser: fromUser}));
      });
    });

    ws.send(JSON.stringify({connect: true, message: "Chat Enabled"}));

    openSockets.forEach(userSocket => {
      ws.send(JSON.stringify({online: true, fromUser: userSocket.username}));
    });
  });

  server.on('request', app);
  server.listen(process.env.PORT || 3000);
};