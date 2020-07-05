var express = require('express');
var router = express.Router();

//Controllers
const userController = require("../controllers/userController");

//Middlewares
const auth = require('../middlewares/auth')

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/signup to create a new user account.
    * 
    * @apiParam {string} firstName first name of user. (body params) (required)
    * @apiParam {string} lastName last name of user. (body params) (required)
    * @apiParam {string} mobileNumber mobile number of user. (body params) (required)
    * @apiParam {string} email email address of user. (body params) (required)
    * @apiParam {string} password password of user's account. (body params) (required)
    * @apiParam {string} countryCode country code of user's mobile number. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "User created",
         "status": 200,
         "data": null
       }
  */
router.route('/signup').post(userController.signUp);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/login to login into user's account.
    * 
    * @apiParam {string} email email address of user. (body params) (required)
    * @apiParam {string} password password of user's account. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Login Successful",
         "status": 200,
         "data": {
                "userId": "xxTb61m4F",
                "firstName": "ABC",
                "lastName": "EFG",
                "email": "abc@gmail.com",
                "mobileNumber": 9876543210
         }
       }
  */
router.route('/login').post(userController.login);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/logout to log out from user's account.
    * 
    * @apiParam {string} authToken authToken of user. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Logged Out Successfully",
         "status": 200,
         "data": null
       }
  */
router.route('/logout').post(auth.isAuthorized, userController.logout);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {get} /api/v1/users/all to get details of all users.
    * 
    * @apiParam {string} authToken authToken of user. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "All User Details Found",
         "status": 200,
         "data": [
            {
                email: "abc@gmail.com"
                firstName: "ABC"
                lastName: "DEF"
            },
            {
                email: "xyz@gmail.com"
                firstName: "XYZ"
                lastName: "123"
            },
            .........................
         ]
       }
  */
router.route('/all').get(auth.isAuthorized, userController.getUsers);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {get} /api/v1/users/ to get details of user.
    * 
    * @apiParam {string} authToken authToken of user. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "User Details Found",
         "status": 200,
         "data": {
            email: "abc@gmail.com"
            firstName: "ABC"
            friendRequests: [
                createdOn: "2020-07-05T10:56:46.077Z"
                user_id:{
                    email: "xyz@gmail.com"
                    firstName: "XYZ"
                    lastName: "123"
                }
            ]
            friends: [
                createdOn: "2020-07-05T10:56:46.077Z"
                user_id:{
                    email: "mno@gmail.com"
                    firstName: "MNO"
                    lastName: "456"
                }
            ]
            lastName: "978"
            mobileNumber: 9876543210
            userId: "xxTb61m4F"
        }
       }
  */
router.route('/').get(auth.isAuthorized, userController.getUser);
//For Testing Purpose:
// .put(auth.isAuthorized, userController.editUser)
// .delete(auth.isAuthorized, userController.deleteUser);

/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/request/send to send friend request to user.
    * 
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} email email address of user whom to send request. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Request send",
         "status": 200,
         "data":null
       }
    *
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "New request send again",
         "status": 200,
         "data":null
       }
  */
router.route('/request/send').post(auth.isAuthorized, userController.requestSend);
/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/request/accept to accept friend request to user.
    * 
    * @apiParam {string} authToken authToken of user. (body params) (required)
    * @apiParam {string} email email address of user whose's friend request is accepted. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Request accepted",
         "status": 200,
         "data":null
       }
  */
router.route('/request/accept').put(auth.isAuthorized, userController.requestAccept);
/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {delete} /api/v1/users/request/decline to decline friend request to user.
    * 
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} email email address of user whose's friend request is declined. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Request Deleted",
         "status": 200,
         "data":null
       }
  */
router.route('/request/decline').delete(auth.isAuthorized, userController.requestDecline);
/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {delete} /api/v1/users/friend/remove to remove user from friends.
    * 
    * @apiParam {string} authToken authToken of user. (query params) (required)
    * @apiParam {string} email email address of user whom to remove. (query params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Friend removed",
         "status": 200,
         "data":null
       }
  */
router.route('/friend/remove').delete(auth.isAuthorized, userController.removeFriend);
/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/forgot/password to send OTP to user's registered email address.
    *
    * @apiParam {string} email email address of user. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "OTP send to registered email",
         "status": 200,
         "data":null
       }
  */
router.route('/forgot/password').post(userController.forgotPassword);
/**
    * @apiGroup users
    * @apiVersion  1.0.0
    * @api {post} /api/v1/users/forgot/password to send OTP to user's registered email address.
    *
    * @apiParam {string} email email address of user. (body params) (required)
    * @apiParam {string} OTP OTP of user. (body params) (required)
    * @apiParam {string} newPassword new password of user account. (body params) (required)
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
        {
         "error": false,
         "message": "Password changed",
         "status": 200,
         "data":null
       }
  */
router.route('/change/password').put(userController.changePassword);

module.exports = router;