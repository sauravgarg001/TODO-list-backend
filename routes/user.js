var express = require('express');
var router = express.Router();

//Controllers
const userController = require("../controllers/userController");

//Middlewares
const auth = require('../middlewares/auth')

router.route('/signup').post(userController.signUp);

router.route('/login').post(userController.login);

router.route('/logout').post(auth.isAuthorized, userController.logout);

router.route('/all').get(auth.isAuthorized, userController.getUsers);

router.route('/')
    .get(auth.isAuthorized, userController.getUser)
    .put(auth.isAuthorized, userController.editUser)
    .delete(auth.isAuthorized, userController.deleteUser);

router.route('/request/send').post(auth.isAuthorized, userController.requestSend);
router.route('/request/accept').put(auth.isAuthorized, userController.requestAccept);
router.route('/request/decline').delete(auth.isAuthorized, userController.requestDecline);

router.route('/friend/remove').delete(auth.isAuthorized, userController.removeFriend);

module.exports = router;