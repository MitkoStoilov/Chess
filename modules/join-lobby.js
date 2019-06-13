exports.joinLobby = function (socket, onlineUsers, name) {
    console.log("test");
    socket.username = name;
    if(onlineUsers.indexOf(onlineUsers.username) == -1){
      onlineUsers.push(socket.username);
      console.log("online:" + onlineUsers.length);
    }
};
