var express = require('express');
var router = express.Router();

//Controllers
const listController = require("../controllers/listController");

//Middlewares
const auth = require('../middlewares/auth')

router.route('/all').get(auth.isAuthorized, listController.getAllLists);
router.route('/')
    .get(auth.isAuthorized, listController.getList)
    .post(auth.isAuthorized, listController.createList)
    .delete(auth.isAuthorized, listController.deleteList);
router.route('/mark/active').put(auth.isAuthorized, listController.markListAsActive);
router.route('/task')
    .post(auth.isAuthorized, listController.addTask)
    .delete(auth.isAuthorized, listController.deleteTask);
router.route('/task/mark/done').put(auth.isAuthorized, listController.markTaskAsDone);
router.route('/task/mark/open').put(auth.isAuthorized, listController.markTaskAsOpen);

module.exports = router;