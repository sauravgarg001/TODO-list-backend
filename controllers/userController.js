const mongoose = require('mongoose');
const shortid = require('shortid');

//Libraries
const time = require('../libs/timeLib');
const password = require('../libs/passwordLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const validate = require('../libs/validationLib');
const check = require('../libs/checkLib');
const token = require('../libs/tokenLib');

//Models
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');

//Commom Functions Start-->

let getUserObjectId = (data) => {
    return new Promise((resolve, reject) => {
        let findQuery;
        if (data.email)
            findQuery = { email: data.email }
        else if (data.userId)
            findQuery = { userId: data.userId }
        UserModel.findOne(findQuery, { _id: 1 })
            .then((user) => {
                if (check.isEmpty(user)) {
                    logger.error('No User Found', 'userController: getUserObjectId()', 7);
                    reject(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('User Found', 'userController: getUserObjectId()', 10);
                    resolve(user._id);
                }
            })
            .catch((err) => {
                logger.error(err.message, 'userController: getUserObjectId()', 10);
                reject(response.generate(true, 'Failed to perform action', 500, null));
            });
    });
};

//<--Commom Functions End

let userController = {

    signUp: (req, res) => {

        //Local Function Start-->

        let validateUserInput = () => {
            return new Promise((resolve, reject) => {
                console.log(req.body);

                if (!req.body.email || !req.body.mobileNumber || !req.body.password) {
                    logger.error('Field Missing During User Creation', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'One or More Parameter(s) is missing', 400, null));
                } else if (!validate.email(req.body.email)) {
                    logger.error('Email Field Not Valid During User Creation', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Email does not met the requirement', 400, null));
                } else if (!validate.mobileNumber(req.body.mobileNumber)) {
                    logger.error('Mobile Number Field Not Valid During User Creation', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Email does not met the requirement', 400, null));
                } else if (!validate.password(req.body.password)) {
                    logger.error('Password Field Not Valid During User Creation', 'userController: validateUserInput()', 5);
                    reject(response.generate(true, 'Password does not met the requirement', 400, null));
                } else {
                    logger.info('User Input Validated', 'userController: validateUserInput()', 5);
                    resolve(req);
                }
            });
        }

        let createUser = () => {
            return new Promise((resolve, reject) => {

                let newUser = {
                    userId: shortid.generate(),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email.toLowerCase(),
                    mobileNumber: req.body.mobileNumber,
                    password: password.hashpassword(req.body.password)
                };

                UserModel.create(newUser)
                    .then((user) => {
                        logger.info('User Created', 'userController: createUser', 10);
                        resolve(user.toObject());
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: createUser', 10);
                        reject(response.generate(true, 'Failed to create user', 403, null));
                    });

            });
        }

        //<--Local Functions End

        validateUserInput(req, res)
            .then(createUser)
            .then((user) => {
                delete user.password;
                res.send(response.generate(false, 'User created', 200, user));
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });

    },

    login: (req, res) => {

        //Local Function Start-->

        let findUser = () => {
            return new Promise((resolve, reject) => {

                UserModel.findOne({ email: req.body.email })
                    .then((user) => {
                        if (check.isEmpty(user)) {
                            logger.error('No User Found', 'userController: findUser()', 7);
                            reject(response.generate(true, 'Account does not exists!', 404, null));
                        } else {
                            logger.info('User Found', 'userController: findUser()', 10);
                            resolve(user);
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: findUser()', 10);
                        reject(response.generate(true, 'Login Failed', 500, null));
                    });
            });
        }

        let validatePassword = (user) => {
            return new Promise((resolve, reject) => {
                password.comparePassword(req.body.password, user.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            logger.info('Password validated', 'userController: validatePassword()', 10);
                            let userObj = user.toObject();
                            delete userObj.password;
                            delete userObj._id;
                            delete userObj.__v;
                            delete userObj.createdOn;
                            delete userObj.modifiedOn;
                            delete userObj.friends;
                            delete userObj.friendRequests;
                            resolve(userObj);
                        } else {
                            logger.error('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10);
                            reject(response.generate(true, 'Wrong Password, Login Failed', 400, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: validatePassword()', 10);
                        reject(response.generate(true, 'Login Failed', 500, null));
                    });
            });
        }

        let generateToken = (user) => {
            return new Promise((resolve, reject) => {
                token.generateToken(user)
                    .then((tokenDetails) => {
                        logger.info('Token Generated', 'userController: generateToken()', 10);
                        tokenDetails.userId = user.userId;
                        resolve(tokenDetails);
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: generateToken()', 10);
                        reject(response.generate(true, 'Login Failed', 500, null));
                    });
            });
        }

        let saveToken = (tokenDetails) => {
            let newAuthToken = new AuthModel({
                userId: tokenDetails.userId,
                authToken: tokenDetails.token,
                tokenSecret: tokenDetails.tokenSecret,
                tokenGenerationTime: time.now()
            });
            return new Promise((resolve, reject) => {
                AuthModel.create(newAuthToken)
                    .then((token) => {
                        logger.info('Token Saved', 'userController: saveToken()', 10);
                        let responseBody = {
                            authToken: token.authToken,
                            userId: token.userId
                        }
                        resolve(responseBody);
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: saveToken()', 10);
                        req.user = { userId: tokenDetails.userId };
                        userController.logout(req, res);
                        reject(response.generate(true, 'Failed you may be login somewhere else, Try Again!', 500, null));
                    });
            });
        }

        //<--Local Functions End

        findUser(req, res)
            .then(validatePassword)
            .then(generateToken)
            .then(saveToken)
            .then((resolve) => {
                res.status(200);
                res.send(response.generate(false, 'Login Successful', 200, resolve));
            })
            .catch((err) => {
                res.status(err.status);
                res.send(err);
            });
    },

    logout: (req, res) => {

        AuthModel.findOneAndDelete({ userId: req.user.userId })
            .then((result) => {
                if (check.isEmpty(result)) {
                    logger.info('User already Loggedout', 'userController: saveToken()', 10);
                    res.send(response.generate(true, 'Already Logged Out or Invalid UserId', 404, null))
                } else {
                    logger.info('User Loggedout', 'userController: saveToken()', 10);
                    res.send(response.generate(false, 'Logged Out Successfully', 200, null));
                }
            })
            .catch((err) => {
                logger.error(err.message, 'user Controller: logout', 10);
                res.status(err.status);
                res.send(response.generate(true, `error occurred: ${err.message}`, 500, null));
            });
    },

    getUsers: (req, res) => {

        UserModel.find({
                userId: { $ne: req.user.userId }
            }, { _id: 0, firstName: 1, lastName: 1, email: 1 })
            .then((users) => {
                if (check.isEmpty(users)) {
                    logger.info('No User Found', 'User Controller: getUnspammedUsers');
                    res.status(404);
                    res.send(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('Users Found', 'User Controller: getUnspammedUsers');
                    res.status(200);
                    res.send(response.generate(false, 'All User Details Found', 200, users));
                }
            })
            .catch((err) => {
                logger.error(err.message, 'User Controller: getUnspammedUsers', 10);
                res.status(500);
                res.send(response.generate(true, 'Failed To Find User Details', 500, null));
            });
    },

    getUser: (req, res) => {

        UserModel.findOne({ 'userId': req.user.userId })
            .populate('friends.user_id', 'firstName lastName email -_id')
            .populate('friendRequests.user_id', 'firstName lastName email -_id')
            .select('-_id userId firstName lastName email mobileNumber friends friendRequests')
            .exec()
            .then((user) => {
                if (check.isEmpty(user)) {
                    logger.info('No User Found', 'User Controller:getUser');
                    res.send(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('User Found', 'User Controller:getUser');
                    res.send(response.generate(false, 'User Details Found', 200, user));
                }
            })
            .catch((err) => {
                res.status(err.status);
                logger.error(err.message, 'User Controller: getUser', 10);
                res.send(response.generate(true, 'Failed To Find User Details', 500, null));
            });
    },

    deleteUser: (req, res) => {

        UserModel.findOneAndDelete({ 'userId': req.user.userId })
            .then((result) => {
                if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: deleteUser');
                    res.send(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('User Deleted', 'User Controller: deleteUser');
                    res.send(response.generate(false, 'Deleted the user successfully', 200, result));
                }
            })
            .catch((err) => {
                res.status(err.status);
                logger.error(err.message, 'User Controller: deleteUser', 10);
                res.send(response.generate(true, 'Failed To delete user', 500, null));
            });
    },

    editUser: (req, res) => {
        let data = {};
        if (req.body.firstName)
            data['firstName'] = req.body.firstName;
        if (req.body.lastName)
            data['lastName'] = req.body.lastName;
        if (req.body.mobileNumber && validate.mobileNumber(mobileNumber))
            data['mobileNumber'] = req.body.mobileNumber;
        if (req.body.email && validate.email(email))
            data['email'] = req.body.email;
        if (req.body.password && validate.password(password))
            data['password'] = req.body.password;
        req.body['modifiedOn'] = time.now();

        UserModel.findOneAndUpdate(req.user.userId, {
                $set: data
            }, { new: true }) //To return updated document
            //.update({ 'userId': req.user.userId }, req.body) //Alternative
            .populate('friends.user_id', 'email firstName lastName -_id')
            .populate('friendRequests.user_id', 'email firstName lastName -_id')
            .select('userId firstName lastName friends friendRequests')
            .exec()
            .then((user) => {
                if (check.isEmpty(user)) {
                    logger.info('No User Found', 'User Controller: editUser');
                    res.send(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('User Updated', 'User Controller: editUser');
                    res.send(response.generate(false, 'User details edited', 200, user));
                }
            })
            .catch((err) => {
                res.status(err.status);
                logger.error(err.message, 'User Controller:editUser', 10);
                res.send(response.generate(true, 'Failed To edit user details', 500, null));
            });
    },

    requestSend: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.email)) {
                    logger.error('Parameters Missing', 'userController: requestSend(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.body.email)) {
                    logger.error('Invalid Index Parameter', 'userController: requestSend(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'userController: requestSend(): validateParams()', 9);
                    resolve({ userId: req.user.userId });
                }
            });
        }

        let removeFromFriendRequests = (user_id) => {
            req.user._id = user_id;
            return new Promise((resolve, reject) => {
                let findQuery = {
                    email: req.body.email
                }
                let updateQuery = {
                    $pull: {
                        friendRequests: { user_id: user_id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Old Request Deleted', 'userController: removeFromFriendRequests()', 10);
                            resolve(true);
                        } else {
                            logger.error('No Old Request', 'userController: removeFromFriendRequests()', 10);
                            resolve(false);
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: removeFromFriendRequests()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let addToFriendRequests = (wasSendEarlier) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    email: req.body.email
                }
                let updateQuery = {
                    $addToSet: {
                        friendRequests: { user_id: req.user._id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Request Send', 'userController: addToFriendRequests()', 10);
                            if (wasSendEarlier)
                                resolve(response.generate(false, 'New request send again', 200, null));
                            else
                                resolve(response.generate(false, 'Request send', 200, null));
                        } else {
                            logger.error('Request Not Send', 'userController: addToFriendRequests()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: addToFriendRequests()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(getUserObjectId)
            .then(removeFromFriendRequests)
            .then(addToFriendRequests)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },

    requestAccept: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.email)) {
                    logger.error('Parameters Missing', 'userController: requestAccept(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.body.email)) {
                    logger.error('Invalid Index Parameter', 'userController: requestAccept(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'userController: requestAccept(): validateParams()', 9);
                    resolve({ email: req.body.email });
                }
            });
        }

        let removeFromFriendRequests = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    userId: req.user.userId
                }
                let updateQuery = {
                    $pull: {
                        friendRequests: { user_id: user_id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Request Deleted', 'userController: removeFromFriendRequests()', 10);
                            resolve(user_id);
                        } else {
                            logger.error('No Request Deleted', 'userController: removeFromFriendRequests()', 10);
                            reject(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: removeFromFriendRequests()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let addToFriends = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    userId: req.user.userId
                }
                let updateQuery = {
                    $addToSet: {
                        friends: { user_id: user_id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Added to Friends', 'userController: addToFriends()', 10);
                            resolve({ userId: req.user.userId });
                        } else {
                            logger.error('Not Added to Friends', 'userController: addToFriends()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: addToFriends()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let addToFriendsSender = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    email: req.body.email
                }
                let updateQuery = {
                    $addToSet: {
                        friends: { user_id: user_id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Added to Friends of Sender', 'userController: addToFriendsSender()', 10);
                            resolve(response.generate(false, 'Request accepted', 200, null));
                        } else {
                            logger.error('Not Added to Friends of Sender', 'userController: addToFriendsSender()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: addToFriendsSender()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(getUserObjectId)
            .then(removeFromFriendRequests)
            .then(addToFriends)
            .then(getUserObjectId)
            .then(addToFriendsSender)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },

    requestDecline: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.query.email)) {
                    logger.error('Parameters Missing', 'userController: requestDecline(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.query.email)) {
                    logger.error('Invalid Index Parameter', 'userController: requestDecline(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'userController: requestDecline(): validateParams()', 9);
                    resolve({ email: req.query.email });
                }
            });
        }

        let removeFromFriendRequests = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    userId: req.user.userId
                }
                let updateQuery = {
                    $pull: {
                        friendRequests: { user_id: user_id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Request Deleted', 'userController: removeFromFriendRequests()', 10);
                            resolve(response.generate(false, 'Friend request declined', 200, null));
                        } else {
                            logger.error('No Request Deleted', 'userController: removeFromFriendRequests()', 10);
                            reject(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: removeFromFriendRequests()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(getUserObjectId)
            .then(removeFromFriendRequests)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },

    removeFriend: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.query.email)) {
                    logger.error('Parameters Missing', 'userController: removeFriend(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.query.email)) {
                    logger.error('Invalid Index Parameter', 'userController: removeFriend(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'userController: removeFriend(): validateParams()', 9);
                    resolve({ email: req.query.email });
                }
            });
        }

        let removeFromFriends = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    userId: req.user.userId
                }
                let updateQuery = {
                    $pull: {
                        friends: { user_id: user_id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Friend Removed', 'userController: removeFromFriends()', 10);
                            resolve({ userId: req.user.userId });
                        } else {
                            logger.error('No Friend Removed', 'userController: removeFromFriends()', 10);
                            reject(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: removeFromFriends()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let removeFromFriendsOther = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    email: req.query.email
                }
                let updateQuery = {
                    $pull: {
                        friends: { user_id: user_id }
                    },
                }

                UserModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Friend Removed', 'userController: removeFromFriendsOther()', 10);
                            resolve(response.generate(false, 'Friend removed', 200, null));
                        } else {
                            logger.error('No Friend Removed', 'userController: removeFromFriendsOther()', 10);
                            reject(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: removeFromFriendsOther()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(getUserObjectId)
            .then(removeFromFriends)
            .then(getUserObjectId)
            .then(removeFromFriendsOther)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    }

}

module.exports = userController;