const express = require("express");
const {createTask , updateTask , allTasks} = require('../tasks/controller')
const router = express.Router();

router.post('/Add-Task', createTask);
router.post('/Update-Task' ,updateTask);
router.post('/All-Tasks' , allTasks);

module.exports = router;
