const  WebSocket  = require("ws");
const UserModel = require("../../models/UserModel");
const { generateUUID } = require("../utils/generator");

const wss = new WebSocket.Server({ port: 3000 });
let clients = [];

// WebSocket server to manage real-time communication
wss.on('connection', (ws) => {
  clients.push(ws);
  
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });
});

const confirmTvConnection = async (req, res) => {
  console.log("Calling this");
  console.log(req.body);
  const user = await UserModel.findOne({email: req.body.email});
    if(!user) {
      return res.status(401).json({ success : false,  message: 'user-not-found' });
    }
    
  clients.forEach(client => {
    client.send(JSON.stringify({event: 'confirmConnection', tvId: req.body.data.tvId, userId: user.userId, data: req.body.data }));
  });
  
  res.status(200).json({success: true, message: "connection-in-progress"});

};


const confirmationFromTv = (req,res) => {
  clients.forEach(client => {
    client.send(JSON.stringify({event: 'confirmedTv', userId: req.body.userId, data: req.body }));
  });
  res.status(200).json({success: true, message: "connection-completed"});
}

// Handle post request from App A
const postFromA = (req, res) => {
  // Notify App B through WebSocket
  console.log("from app");

  clients.forEach(client => {
    client.send(JSON.stringify({event: 'getAppUsage', tvId: req.body.tvId, data: "need app usage" }));
  });
  res.status(200).send('Data sent to App B');
};

// Handle post request from App B
const postFromB = (req, res) => {
  console.log("from tv");
  console.log(req.params.userId);
  // Notify App A that App B has responded
  clients.forEach(client => {
    client.send(JSON.stringify({event: 'responseAppUsage', userId: req.params.userId, data: req.body }));
  });
  res.status(200).send('Data sent to App A');
};


module.exports = {
    postFromA, 
    postFromB,
    confirmTvConnection,
  confirmationFromTv,
}