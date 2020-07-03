const mongoose = require('mongoose');
const shortid = require('shortid');

//Libraries
const time = require('../libs/timeLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const validate = require('../libs/validationLib');
const check = require('../libs/checkLib');

//Models
const UserModel = mongoose.model('User');
const ListModel = mongoose.model('List');

//Commom Functions Start-->

let validateUserListAccess = (data) => {
    return new Promise((resolve, reject) => {
        let findQuery = {
            userId: data.userId,
            lists: {
                $elemMatch: {
                    listId: data.listId
                }
            }
        }

        UserModel.findOne(findQuery, { _id: 0, "lists.$": 1 })
            .then((user) => {
                if (check.isEmpty(user.lists)) {
                    logger.info('User List Access Not Validated', 'listController: validateUserListAccess()');
                    reject(response.generate(false, 'Unauthorized Access', 401, null));
                } else {
                    logger.info('User List Access Validated', 'listController: validateUserListAccess()');
                    resolve();
                }
            })
            .catch((err) => {
                logger.error(err.message, 'listController: validateUserListAccess()', 10);
                reject(response.generate(true, `Failed to perform action`, 500, null));
            });
    });
};

let getUserObjectId = (userId) => {
    return new Promise((resolve, reject) => {

        UserModel.findOne({ userId: userId }, { _id: 1 })
            .then((user) => {
                if (check.isEmpty(user)) {
                    logger.error('No User Found', 'listController: getUserObjectId()', 7);
                    reject(response.generate(true, 'No User Found', 404, null));
                } else {
                    logger.info('User Found', 'listController: getUserObjectId()', 10);
                    resolve(user._id);
                }
            })
            .catch((err) => {
                logger.error(err.message, 'listController: getUserObjectId()', 10);
                reject(response.generate(true, 'Failed to perform action', 500, null));
            });
    });
};

//<--Commom Functions End

let listController = {

    getAllLists: (req, res) => {
        //Local Function Start-->

        let findLists = () => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    userId: req.user.userId
                }

                UserModel.findOne(findQuery, { _id: 0, lists: 1 })
                    .then((user) => {
                        if (check.isEmpty(user.lists)) {
                            logger.info('No Lists Found', 'listController: findLists()');
                            reject(response.generate(false, 'No Lists Found', 200, null));
                        } else {
                            logger.info('Lists Found', 'listController: findLists()');
                            resolve(response.generate(false, 'All Lists Listed', 200, user.lists))
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: findLists()', 10);
                        reject(response.generate(true, `Failed to perform action`, 500, null));
                    });
            });
        }

        //<--Local Functions End

        findLists()
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    getList: (req, res) => {

        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.query.listId)) {
                    logger.error('Parameters Missing', 'listController: getList(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: getList(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.query.listId });
                }
            });
        }

        let findList = () => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.query.listId
                }
                ListModel.findOne(findQuery, { _id: 0, __v: 0 })
                    .populate('contributers.user_id', 'userId firstName lastName -_id')
                    .exec()
                    .then((list) => {
                        if (check.isEmpty(list)) {
                            logger.info('No List Found', 'listController: findList()');
                            reject(response.generate(false, 'No List Found', 200, null));
                        } else {
                            logger.info('List Found', 'listController: findList()');
                            resolve(response.generate(false, 'List fetched', 200, list));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: findList()', 10);
                        reject(response.generate(true, `Failed to perform action`, 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(findList)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    createList: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.name)) {
                    logger.error('Parameters Missing', 'listController: createList(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: createList(): validateParams()', 9);
                    resolve(req.user.userId);
                }
            });
        }

        let createList = (user_id) => {
            return new Promise((resolve, reject) => {
                let newList = {
                    listId: shortid.generate(),
                    name: req.body.name,
                    tasks: [],
                    contributers: [{
                        user_id: user_id,
                        isOwner: true,
                        canEdit: true,
                    }]
                };

                ListModel.create(newList)
                    .then((list) => {
                        delete newList.tasks;
                        delete newList.contributers;
                        newList['isActive'] = false;
                        logger.info('List Created', 'listController: createList()');
                        resolve(response.generate(false, 'List created', 200, newList));
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: createList()', 10);
                        reject(response.generate(true, `Failed to perform action`, 500, null));
                    });
            });
        }

        let updateUser = (apiResponse) => {
            return new Promise((resolve, reject) => {

                UserModel.update({
                        userId: req.user.userId,
                    }, {
                        $addToSet: {
                            lists: apiResponse.data
                        },
                        modifiedOn: time.now()
                    })
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('User Updated', 'userController: createList(): updateUser()', 10);
                            resolve(apiResponse);
                        } else {
                            logger.error('User Not Updated', 'userController: createList(): updateUser()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: createList(): updateUser()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(getUserObjectId)
            .then(createList)
            .then(updateUser)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    deleteList: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.query.listId)) {
                    logger.error('Parameters Missing', 'listController: deleteList(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: deleteList(): validateParams()', 9);
                    resolve();
                }
            });
        }

        let updateUser = () => {
            return new Promise((resolve, reject) => {

                UserModel.update({
                        userId: req.user.userId,
                    }, {
                        $pull: {
                            lists: {
                                listId: req.query.listId
                            }
                        },
                        modifiedOn: time.now()
                    })
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('User Updated', 'userController: deleteList(): updateUser()', 10);
                            resolve(req.user.userId);
                        } else {
                            logger.error('User Not Updated', 'userController: deleteList(): updateUser()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'userController: deleteList(): updateUser()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let getList = (user_id) => {
            req.user._id = user_id;
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.query.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: user_id
                        }
                    }
                }

                ListModel.findOne(findQuery, { _id: 0, "contributers.$": 1 })
                    .exec()
                    .then((list) => {
                        if (check.isEmpty(list)) {
                            logger.info('No List Found', 'listController: deleteList(): findList()');
                            reject(response.generate(true, `Failed to perform action`, 403, null));
                        } else {
                            logger.info('List Found', 'listController: deleteList(): findList()');
                            resolve(list.contributers[0]);
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: findList()', 10);
                        reject(response.generate(true, `Failed to perform action`, 500, null));
                    });
            });
        }

        let deleteList = (contributer) => {
            return new Promise((resolve, reject) => {

                if (contributer.isOwner) {
                    ListModel.deleteOne({
                            listId: req.query.listId
                        })
                        .then((result) => {
                            if (result.deletedCount == 1) {
                                logger.info('List Deleted', 'listController: deleteList()', 10);
                                resolve(response.generate(false, 'List deleted', 200, null));
                            } else {
                                logger.error('List Not Deleted', 'listController: deleteList()', 10);
                                reject(response.generate(true, 'Failed to perform action', 500, null));
                            }
                        }).catch((err) => {
                            logger.error(err.message, 'listController: deleteList()', 10);
                            reject(response.generate(true, 'Failed to perform action', 500, null));
                        });
                } else {
                    ListModel.update({
                            listId: req.query.listId,
                        }, {
                            $pull: {
                                contributers: {
                                    user_id: req.user._id
                                }
                            },
                            modifiedOn: time.now()
                        })
                        .then((result) => {
                            if (result.nModified != 0) {
                                logger.info('Removed from list as contributers', 'listController: deleteList()', 10);
                                resolve(response.generate(false, 'Removed from list as contributers', 200, null));
                            } else {
                                logger.error('Not removed from list', 'listController: deleteList()', 10);
                                resolve(response.generate(true, 'Failed to perform action', 403, null));
                            }
                        })
                        .catch((err) => {
                            logger.error(err.message, 'listController: deleteList()', 10);
                            reject(response.generate(true, 'Failed to perform action', 500, null));
                        });
                }
            });
        }

        //<--Local Functions End

        validateParams()
            .then(updateUser)
            .then(getUserObjectId)
            .then(getList)
            .then(deleteList)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    markListAsActive: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId)) {
                    logger.error('Parameters Missing', 'listController: markListAsActive(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: markListAsActive(): validateParams()', 9);
                    resolve();
                }
            });
        }

        let updateAllListAsNotActive = () => {
            return new Promise((resolve, reject) => {

                let findQuery = {
                    userId: req.user.userId
                }
                let updateQuery = {
                    $set: {
                        "lists.$[i].isActive": false,
                        "lists.$[i].modifiedOn": time.now()
                    }
                };
                let options = {
                    arrayFilters: [{
                        "i.isActive": true
                    }]
                }

                UserModel.update(findQuery, updateQuery, options)
                    .then((result) => {
                        if (result.n != 0) {
                            logger.info('User All List Marked As Not Active', 'listController: markListAsActive(): updateAllListAsNotActive()', 10);
                            resolve();
                        } else {
                            logger.error('User Not Updated', 'listController: markListAsActive(): updateAllListAsNotActive()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: markListAsActive(): updateAllListAsNotActive()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let updateUser = () => {
            return new Promise((resolve, reject) => {

                let findQuery = {
                    userId: req.user.userId
                }
                let updateQuery = {
                    $set: {
                        "lists.$[i].isActive": true,
                        "lists.$[i].modifiedOn": time.now()
                    }
                };

                let options = {
                    arrayFilters: [{
                        "i.listId": req.body.listId
                    }]
                }

                UserModel.update(findQuery, updateQuery, options)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('User Updated', 'listController: markListAsActive(): updateUser()', 10);
                            resolve(response.generate(false, 'List marked as active', 200, null));
                        } else {
                            logger.error('User Not Updated', 'listController: markListAsActive(): updateUser()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: markListAsActive(): updateUser()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let getList = (apiResponse) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.body.listId
                }

                ListModel.findOne(findQuery, { _id: 0, __v: 0 })
                    .populate('contributers.user_id', 'userId firstName lastName -_id')
                    .exec()
                    .then((list) => {
                        if (check.isEmpty(list)) {
                            logger.info('No List Found', 'listController: markListAsActive(): findList()');
                            reject(response.generate(true, `Failed to perform action`, 403, null));
                        } else {
                            logger.info('List Found', 'listController: markListAsActive(): findList()');
                            apiResponse.data = list;
                            resolve(apiResponse);
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: markListAsActive(): findList()', 10);
                        reject(response.generate(true, `Failed to perform action`, 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(updateAllListAsNotActive)
            .then(updateUser)
            .then(getList)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    addTask: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.text) || check.isEmpty(req.body.index)) {
                    logger.error('Parameters Missing', 'listController: addTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.index(req.body.index)) {
                    logger.error('Invalid Index Parameter', 'listController: addTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: addTask(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.body.listId });
                }
            });
        }

        let addTask = () => {
            return new Promise((resolve, reject) => {
                let index = req.body.index;
                let findQuery = {
                    listId: req.body.listId
                }

                ListModel.findOne(findQuery)
                    .then((list) => {
                        if (index == -1) {
                            list.tasks.push({ text: req.body.text, subTasks: mongoose.Types.Array(), isOpen: true, modifiedOn: time.now(), createdOn: time.now() });
                        } else {
                            let tempTasks = list.tasks;
                            let tempTask;
                            while (true) {
                                if (index.indexOf('.') == -1) {
                                    tempTask = tempTasks[parseInt(index)];
                                    break;
                                } else
                                    tempTask = tempTasks[parseInt(index.substring(0, index.indexOf('.')))];
                                tempTasks = tempTask.subTasks;
                                index = index.substring(index.indexOf('.') + 1);
                            }
                            tempTask.subTasks.push({ text: req.body.text, subTasks: mongoose.Types.Array(), isOpen: true, modifiedOn: time.now(), createdOn: time.now() });
                        }
                        list.markModified('tasks');
                        list.save(function(err) {
                            if (err) {
                                logger.error(err.message, 'listController: addTask()', 10);
                                resolve(response.generate(true, 'Failed to perform action', 500, null));
                            } else {
                                logger.info('Task Added', 'listController: addTask()', 10);
                                resolve(response.generate(false, 'New task added to list', 200, null));
                            }
                        });
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: addTask()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(addTask)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    deleteTask: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.query.listId) || check.isEmpty(req.query.index)) {
                    logger.error('Parameters Missing', 'listController: deleteTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.index(req.query.index)) {
                    logger.error('Invalid Index Parameter', 'listController: deleteTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: deleteTask(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.query.listId });
                }
            });
        }

        let deleteTask = () => {
            return new Promise((resolve, reject) => {
                let index = req.query.index;
                let findQuery = {
                    listId: req.query.listId
                }

                ListModel.findOne(findQuery)
                    .then((list) => {
                        let tempTasks = list.tasks;
                        let tempTask;
                        while (true) {
                            if (index.indexOf('.') == -1 || index == -1) {
                                break;
                            } else
                                tempTask = tempTasks[parseInt(index.substring(0, index.indexOf('.')))];
                            tempTasks = tempTask.subTasks;
                            index = index.substring(index.indexOf('.') + 1);
                        }
                        tempTasks.splice(parseInt(index), 1);
                        list.markModified('tasks');
                        list.save(function(err) {
                            if (err) {
                                logger.error(err.message, 'listController: addTask()', 10);
                                resolve(response.generate(true, 'Failed to perform action', 500, null));
                            } else {
                                logger.info('Task Deleted', 'listController: deleteTask()', 10);
                                resolve(response.generate(false, 'Task deleted from list', 200, null));
                            }
                        });
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: deleteTask()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(deleteTask)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    markTaskAsDone: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.index)) {
                    logger.error('Parameters Missing', 'listController: deleteTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.index(req.body.index)) {
                    logger.error('Invalid Index Parameter', 'listController: deleteTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: deleteTask(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.body.listId });
                }
            });
        }

        let changeStatusToDone = () => {
            return new Promise((resolve, reject) => {
                let index = req.body.index;
                let findQuery = {
                    listId: req.body.listId
                }

                ListModel.findOne(findQuery)
                    .then((list) => {
                        let tempTasks = list.tasks;
                        let tempTask;
                        while (true) {
                            if (index.indexOf('.') == -1 || index == -1) {
                                break;
                            } else
                                tempTask = tempTasks[parseInt(index.substring(0, index.indexOf('.')))];
                            tempTasks = tempTask.subTasks;
                            index = index.substring(index.indexOf('.') + 1);
                        }
                        tempTasks[parseInt(index)].isOpen = false;
                        list.markModified('tasks');
                        list.save(function(err) {
                            if (err) {
                                logger.error(err.message, 'listController: changeStatusToDone()', 10);
                                resolve(response.generate(true, 'Failed to perform action', 500, null));
                            } else {
                                logger.info('Task Deleted', 'listController: changeStatusToDone()', 10);
                                resolve(response.generate(false, 'Task deleted from list', 200, null));
                            }
                        });
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: changeStatusToDone()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(changeStatusToDone)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    markTaskAsOpen: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.index)) {
                    logger.error('Parameters Missing', 'listController: deleteTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.index(req.body.index)) {
                    logger.error('Invalid Index Parameter', 'listController: deleteTask(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: deleteTask(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.body.listId });
                }
            });
        }

        let changeStatusToOpen = () => {
            return new Promise((resolve, reject) => {
                let index = req.body.index;
                let findQuery = {
                    listId: req.body.listId
                }

                ListModel.findOne(findQuery)
                    .then((list) => {
                        let tempTasks = list.tasks;
                        let tempTask;
                        while (true) {
                            if (index.indexOf('.') == -1 || index == -1) {
                                break;
                            } else
                                tempTask = tempTasks[parseInt(index.substring(0, index.indexOf('.')))];
                            tempTasks = tempTask.subTasks;
                            index = index.substring(index.indexOf('.') + 1);
                        }
                        tempTasks[parseInt(index)].isOpen = true;
                        list.markModified('tasks');
                        list.save(function(err) {
                            if (err) {
                                logger.error(err.message, 'listController: changeStatusToOpen()', 10);
                                resolve(response.generate(true, 'Failed to perform action', 500, null));
                            } else {
                                logger.info('Task Deleted', 'listController: changeStatusToOpen()', 10);
                                resolve(response.generate(false, 'Task deleted from list', 200, null));
                            }
                        });
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: changeStatusToOpen()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(changeStatusToOpen)
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

module.exports = listController;