const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const userRouter = require('./users/router');
const projectRouter = require('./project/router');
const taskRouter = require('./tasks/router');
const {compress} = require('./utils/compression');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection

db.on('error', (err) => {
       console.log(err);
})

db.once('open', () => {
       console.log("Database Connection established");
})

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(cors())
app.use(compress);

app.use('/user' , userRouter);
app.use('/project' , projectRouter);
app.use('/task' , taskRouter);

app.get('/', function (req, res) {
       res.send('Hello World! with MongoDB').status(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
       console.log(`Server is running on port ${port}`);
});
