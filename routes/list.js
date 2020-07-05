var express = require('express');
var router = express.Router();

//Controllers
const listController = require("../controllers/listController");

//Middlewares
const auth = require('../middlewares/auth')

/**
    * @apiGroup lists
    * @apiVersion  1.0.0
    * @api {get} /api/v1/lists/all to get all user's lists.
    * 
    * @apiParam {string} authToken authToken of user. (body query) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "All Lists Listed",
         "status": 200,
         "data": [
            {
                createdOn: "2020-07-05T17:03:10.284Z"
                isActive: true
                listId: "aVlxl_QoL"
                modifiedOn: "2020-07-05T17:03:10.000Z"
                name: "list 1"   
            },
            ..................
        ]
       }
  */
router.route('/all').get(auth.isAuthorized, listController.getAllLists);
router.route('/')
    /**
        * @apiGroup lists
        * @apiVersion  1.0.0
        * @api {get} /api/v1/lists/ to get list.
        * 
        * @apiParam {string} authToken authToken of user. (body query) (required)
        * @apiParam {string} listId listId of list. (body query) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
             "error": false,
             "message": "List fetched",
             "status": 200,
             "data": {
                    canEdit: true
                    contributers: [
                        canEdit: true
                        createdOn: "2020-07-05T17:03:10.222Z"
                        isOwner: true
                        modifiedOn: "2020-07-05T17:03:10.222Z"
                        user_id:{
                            email: "sauravgarg001@gmail.com"
                            firstName: "Saurav"
                            lastName: "Garg"
                            userId: "xxTb61m4F"
                        },
                        .................
                    ]
                    createdOn: "2020-07-05T17:03:10.223Z"
                    listId: "aVlxl_QoL"
                    modifiedOn: "2020-07-05T17:03:10.223Z"
                    name: "list 1"
                    tasks: [
                        {
                            "subTasks": [
                                {
                                    "text": "task 1.1",
                                    "subTasks": [ ],
                                    "isOpen": true,
                                    "modifiedOn": "2020-07-05T17:03:25Z",
                                    "createdOn": "2020-07-05T17:03:25Z"
                                },
                                .................
                            ],
                            "isOpen": true,
                            "createdOn": "2020-07-05T17:03:19.000Z",
                            "modifiedOn": "2020-07-05T17:03:19.000Z",
                            "text": "task 1"
                        },
                        .................
                    ]
             }
           }
      */
    .get(auth.isAuthorized, listController.getList)
    /**
    * @apiGroup lists
    * @apiVersion  1.0.0
    * @api {post} /api/v1/lists/ to create list.
    * 
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} name name of list. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "List created",
         "status": 200,
         "data": {
                isActive: true
                listId: "aVlxl_QoL"
                name: "list 1"
         }
       }
  */
    .post(auth.isAuthorized, listController.createList)
    /**
    * @apiGroup lists
    * @apiVersion  1.0.0
    * @api {delete} /api/v1/lists/ to delete list.
    * 
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} listId listId of list. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Removed from list as contributers",
         "status": 200,
         "data": null
       }
    *
     * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "List Deleted",
         "status": 200,
         "data": null
       }
  */
    .delete(auth.isAuthorized, listController.deleteList);
/**
    * @apiGroup lists
    * @apiVersion  1.0.0
    * @api {put} /api/v1/lists/mark/active to mark list as active list.
    * 
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} listId listId of list. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "List marked as active",
         "status": 200,
         "data": {
                canEdit: true
                contributers: [
                    canEdit: true
                    createdOn: "2020-07-05T17:03:10.222Z"
                    isOwner: true
                    modifiedOn: "2020-07-05T17:03:10.222Z"
                    user_id:{
                        email: "sauravgarg001@gmail.com"
                        firstName: "Saurav"
                        lastName: "Garg"
                        userId: "xxTb61m4F"
                    },
                    .................
                ]
                createdOn: "2020-07-05T17:03:10.223Z"
                listId: "aVlxl_QoL"
                modifiedOn: "2020-07-05T17:03:10.223Z"
                name: "list 1"
                tasks: [
                    {
                        "subTasks": [
                            {
                                "text": "task 1.1",
                                "subTasks": [ ],
                                "isOpen": true,
                                "modifiedOn": "2020-07-05T17:03:25Z",
                                "createdOn": "2020-07-05T17:03:25Z"
                            },
                            .................
                        ],
                        "isOpen": true,
                        "createdOn": "2020-07-05T17:03:19.000Z",
                        "modifiedOn": "2020-07-05T17:03:19.000Z",
                        "text": "task 1"
                    },
                    .................
                ]
         }
       }
  */
router.route('/mark/active').put(auth.isAuthorized, listController.markListAsActive);
router.route('/task')
    /**
        * @apiGroup lists
        * @apiVersion  1.0.0
        * @api {post} /api/v1/lists/task to add new task to list.
        * 
        * @apiParam {string} authToken authToken of user. (body params) (required)
        * @apiParam {string} listId listId of list. (body params) (required)
        * @apiParam {string} text text of task. (body params) (required)
        * @apiParam {float} index index of task in list. (body params) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
             "error": false,
             "message": "New task added to list",
             "status": 200,
             "data": null
           }
      */
    .post(auth.isAuthorized, listController.addTask)
    /**
       * @apiGroup lists
       * @apiVersion  1.0.0
       * @api {delete} /api/v1/lists/task to delete a task from list.
       * 
       * @apiParam {string} authToken authToken of user. (query params) (required)
       * @apiParam {string} listId listId of list. (query params) (required)
       * @apiParam {float} index index of task in list. (query params) (required)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       * @apiSuccessExample {object} Success-Response:
           {
            "error": false,
            "message": "Task deleted from list",
            "status": 200,
            "data": null
          }
     */
    .delete(auth.isAuthorized, listController.deleteTask);
/**
       * @apiGroup lists
       * @apiVersion  1.0.0
       * @api {put} /api/v1/lists/task/mark/done to change status of task to done in list.
       * 
       * @apiParam {string} authToken authToken of user. (body params) (required)
       * @apiParam {string} listId listId of list. (body params) (required)
       * @apiParam {float} index index of task in list. (body params) (required)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       * @apiSuccessExample {object} Success-Response:
           {
            "error": false,
            "message": "Task marked as done",
            "status": 200,
            "data": null
          }
     */
router.route('/task/mark/done').put(auth.isAuthorized, listController.markTaskAsDone);
/**
       * @apiGroup lists
       * @apiVersion  1.0.0
       * @api {put} /api/v1/lists/task/mark/open to change status of task to open in list.
       * 
       * @apiParam {string} authToken authToken of user. (body params) (required)
       * @apiParam {string} listId listId of list. (body params) (required)
       * @apiParam {float} index index of task in list. (body params) (required)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, result.
       * 
       * @apiSuccessExample {object} Success-Response:
           {
            "error": false,
            "message": "Task marked as open",
            "status": 200,
            "data": null
          }
     */
router.route('/task/mark/open').put(auth.isAuthorized, listController.markTaskAsOpen);
router.route('/contributers')
    /**
           * @apiGroup lists
           * @apiVersion  1.0.0
           * @api {post} /api/v1/lists/contributers to add contributer to list.
           * 
           * @apiParam {string} authToken authToken of user. (body params) (required)
           * @apiParam {string} listId listId of list. (body params) (required)
           * @apiParam {string} email email address of contributer. (body params) (required)
           * @apiParam {string} name name of list. (body params) (required)
           * @apiParam {boolean} canEdit to give/not give access to edit to contributer. (body params) (required)
           *
           * @apiSuccess {object} myResponse shows error status, message, http status code, result.
           * 
           * @apiSuccessExample {object} Success-Response:
               {
                "error": false,
                "message": "Contributer added",
                "status": 200,
                "data": null
              }
         */
    .post(auth.isAuthorized, listController.addContributer)
    /**
          * @apiGroup lists
          * @apiVersion  1.0.0
          * @api {delete} /api/v1/lists/contributers to remove contributer from list.
          * 
          * @apiParam {string} authToken authToken of user. (query params) (required)
          * @apiParam {string} listId listId of list. (query params) (required)
          * @apiParam {string} email email address of contributer. (query params) (required)
          *
          * @apiSuccess {object} myResponse shows error status, message, http status code, result.
          * 
          * @apiSuccessExample {object} Success-Response:
              {
               "error": false,
               "message": "Contributer removed",
               "status": 200,
               "data": null
             }
        */
    .delete(auth.isAuthorized, listController.removeContributer);
/**
     * @apiGroup lists
     * @apiVersion  1.0.0
     * @api {put} /api/v1/lists/contributers/access/edit to give contributer edit access of list.
     * 
     * @apiParam {string} authToken authToken of user. (query params) (required)
     * @apiParam {string} listId listId of list. (query params) (required)
     * @apiParam {string} email email address of contributer. (query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
         "error": false,
        "message": "Edit access granted",
        "status": 200,
        "data": null
        }
*/
router.route('/contributers/access/edit').put(auth.isAuthorized, listController.grantAccessToEdit);
/**
     * @apiGroup lists
     * @apiVersion  1.0.0
     * @api {put} /api/v1/lists/contributers/access/edit to give contributer read only access of list.
     * 
     * @apiParam {string} authToken authToken of user. (query params) (required)
     * @apiParam {string} listId listId of list. (query params) (required)
     * @apiParam {string} email email address of contributer. (query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
         "error": false,
        "message": "Read only access granted",
        "status": 200,
        "data": null
        }
*/
router.route('/contributers/access/read').put(auth.isAuthorized, listController.grantAccessToRead);
/**
     * @apiGroup lists
     * @apiVersion  1.0.0
     * @api {put} /api/v1/lists/undo to undo last change to list.
     * 
     * @apiParam {string} authToken authToken of user. (query params) (required)
     * @apiParam {string} listId listId of list. (query params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Changes Undone",
            "status": 200,
            "data": [
                {
                    createdOn: "2020-07-05T17:03:19.000Z"
                    isOpen: true
                    modifiedOn: "2020-07-05T17:03:19.000Z"
                    subTasks: []
                    text: "task 1"
                }
            ]
        }
*/
router.route('/undo').put(auth.isAuthorized, listController.undo);
module.exports = router;