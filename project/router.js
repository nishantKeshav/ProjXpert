const express = require("express");
const {createProject , AddUsersandAssignRoles , changeRoles , allProjects , getAllUsersinProject} = require('../project/controller');
const router = express.Router();

router.post('/Create-Project', createProject);
router.post('/Add-Members' , AddUsersandAssignRoles);
router.post('/Change-Role' , changeRoles);
router.get('/Get-Projects' , allProjects);
router.post('/Get-Members' , getAllUsersinProject);

module.exports = router;
