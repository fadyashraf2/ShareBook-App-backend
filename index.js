express = require("express");
app = new express();
mongoose = require("mongoose");
cors = require("cors");
bodyParser = require("body-parser");

require("./models/userModel");
require("./models/bookModel");
require("./models/commentModel");
require("./models/adsModel");
require("./models/askforModel");
require("./models/adminModel");
require("./models/inboxModel");
require("./db/db");

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const bookRouter = require("./routes/bookRouter");
const adsRouter = require("./routes/adsRouter");
const inboxRouter = require("./routes/inboxRouter");
const specialRouter = require("./specialAPIs/specialRouters");
const AskForRouter = require("./routes/askRouter");

const jwt = require("jsonwebtoken");
const multer = require("multer");
const server = require("http").createServer(app);
const socket = require("socket.io");
const io = socket.listen(server);
commentsInSocket = require("./controllers/commentsInSocket");
chat = require("./controllers/inboxController");


app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));


app.use(express.json());
app.use(express.static("uploads"));
app.use(cors());

app.use(userRouter);
app.use(bookRouter);
app.use(adsRouter);
app.use(inboxRouter);
app.use(adminRouter);
app.use(AskForRouter);
app.use(specialRouter);

// ====== comments for books =========================//
io.on("connection", function(client) {
  console.log("client connected ");
  client.on("oldComments", async id => {
    comments = await commentsInSocket.getCommentsOnBooks(id);
    io.emit("oldComments", comments);
  });

  client.on("newComment", async id => {
    console.log("new comments");
    comments = await commentsInSocket.getCommentsOnBooks(id);
    io.emit("newComment", comments);
  });

  //////////////////////////////////////////////

  //==================comments on user ================//
  client.on("UserOldComments", async sellerId => {
    comments = await commentsInSocket.getCommentsOnUser(sellerId);
    io.emit("UserOldComments", comments);
  });

  client.on("UserNewComment", async sellerId => {
    console.log("user new comments");
    comments = await commentsInSocket.getCommentsOnUser(sellerId);
    io.emit("UserNewComment", comments);
  });

  //==================Chat "inbox" ================//
  client.on("AllInbox", async (userId) => {
    const AllInbox = await chat.getAllInbox(userId);
    io.emit("AllInbox", AllInbox);
  });

  client.on("SpecificInbox", async ( userId , user2Id) => {
    const inbox = await chat.getSpecificInbox(userId, user2Id);
    io.emit("SpecificInbox", inbox);
  });
});


  app.get('/test',(req,res)=>{
  chat.getSpecificInbox('5d2cbcb7a4e1c524d4740e2e','5d2cbc26a4e1c524d4740e2c').then((data)=>{

  
    res.send(data);
  })
}) 

server.listen(3000, () => {
  console.log("App listening on port 3000!");
});
