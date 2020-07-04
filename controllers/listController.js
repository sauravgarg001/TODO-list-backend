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

let getUserObjectId = (data) => {
    return new Promise((resolve, reject) => {
        let findQuery;
        if (data.userId) {
            findQuery = { userId: data.userId };
        } else if (data.email) {
            findQuery = { email: data.email };
        }
        UserModel.findOne(findQuery, { _id: 1 })
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
                ListModel.findOne(findQuery, { _id: 0, __v: 0, changes: 0 })
                    .populate('contributers.user_id', 'userId email firstName lastName -_id')
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
                    resolve({ userId: req.user.userId });
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
                        delete newList.changes;
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
                            logger.info('User Updated', 'listController: createList(): updateUser()', 10);
                            resolve(apiResponse);
                        } else {
                            logger.error('User Not Updated', 'listController: createList(): updateUser()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: createList(): updateUser()', 10);
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
                    resolve({ userId: req.user.userId });
                }
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
                req.user.isOwner = contributer.isOwner;
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

        let updateUser = (apiResponse) => {
            return new Promise((resolve, reject) => {
                let findQuery;
                if (req.user.isOwner)
                    findQuery = {
                        lists: {
                            $elemMatch: {
                                listId: req.query.listId
                            }
                        }
                    };
                else
                    findQuery = { userId: req.user.userId };
                UserModel.updateMany(findQuery, {
                        $pull: {
                            lists: {
                                listId: req.query.listId
                            }
                        },
                        $set: { modifiedOn: time.now() }
                    })
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('User Updated', 'listController: deleteList(): updateUser()', 10);
                            resolve(apiResponse);
                        } else {
                            logger.error('User Not Updated', 'listController: deleteList(): updateUser()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: deleteList(): updateUser()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(getUserObjectId)
            .then(getList)
            .then(deleteList)
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

        let updateUserListsAsNotActive = () => {
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
                        "i.listId": { $ne: req.body.listId }
                    }]
                }

                UserModel.update(findQuery, updateQuery, options)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('User List Marked as Unactive', 'listController: markListAsActive(): updateUserListsAsNotActive()', 10);
                            resolve();
                        } else {
                            logger.error('No User List Marked as Unactive', 'listController: markListAsActive(): updateUserListsAsNotActive()', 10);
                            resolve();
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: markListAsActive(): updateUserListsAsNotActive()', 10);
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

                ListModel.findOne(findQuery, { _id: 0, __v: 0, changes: 0 })
                    .populate('contributers.user_id', 'email userId firstName lastName -_id')
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
            .then(updateUserListsAsNotActive)
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

        let callObject = () => {
            return new Promise((resolve, reject) => {
                resolve({ userId: req.user.userId });
            });
        }

        let addTask = (user_id) => {
            return new Promise((resolve, reject) => {
                let index = req.body.index;
                let findQuery = {
                    listId: req.body.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: user_id,
                            canEdit: true
                        }
                    }
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
                        list.changes.push({
                            by: user_id,
                            operationToUndo: 'deleteTask',
                            paramsToUndo: {
                                index: req.body.index
                            },
                            createdOn: time.now()
                        });
                        list.markModified('changes');
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
            .then(callObject)
            .then(getUserObjectId)
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

        let callObject = () => {
            return new Promise((resolve, reject) => {
                resolve({ userId: req.user.userId });
            });
        }

        let deleteTask = (user_id) => {
            return new Promise((resolve, reject) => {
                let index = req.query.index;
                let findQuery = {
                    listId: req.query.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: user_id,
                            canEdit: true
                        }
                    }
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
                        let text = tempTasks[index].text;
                        let modifiedOn = tempTasks[index].modifiedOn;
                        let createdOn = tempTasks[index].createdOn;
                        let isOpen = tempTasks[index].isOpen;
                        let subTasks = tempTasks[index].subTasks;
                        tempTasks.splice(parseInt(index), 1);

                        list.changes.push({
                            by: user_id,
                            operationToUndo: 'addTask',
                            paramsToUndo: {
                                index: req.query.index,
                                text: text,
                                isOpen: isOpen,
                                subTasks: subTasks,
                                createdOn: createdOn,
                                modifiedOn: modifiedOn
                            },
                            createdOn: time.now(),
                        });
                        list.markModified('changes');
                        list.markModified('tasks');
                        list.save(function(err) {
                            if (err) {
                                logger.error(err.message, 'listController: deleteTask()', 10);
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
            .then(callObject)
            .then(getUserObjectId)
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

        let callObject = () => {
            return new Promise((resolve, reject) => {
                resolve({ userId: req.user.userId });
            });
        }

        let changeStatusToDone = (user_id) => {
            return new Promise((resolve, reject) => {
                let index = req.body.index;
                let findQuery = {
                    listId: req.body.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: user_id,
                            canEdit: true
                        }
                    }
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
                        let modifiedOn = time.now();
                        tempTasks[parseInt(index)].modifiedOn = modifiedOn;
                        list.changes.push({
                            by: user_id,
                            operationToUndo: 'markTaskAsOpen',
                            paramsToUndo: {
                                index: req.body.index,
                                modifiedOn: modifiedOn
                            },
                            createdOn: time.now()
                        });
                        list.markModified('changes');
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
            .then(callObject)
            .then(getUserObjectId)
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

        let callObject = () => {
            return new Promise((resolve, reject) => {
                resolve({ userId: req.user.userId });
            });
        }

        let changeStatusToOpen = (user_id) => {
            return new Promise((resolve, reject) => {
                let index = req.body.index;
                let findQuery = {
                    listId: req.body.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: user_id,
                            canEdit: true
                        }
                    }
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
                        let modifiedOn = time.now();
                        tempTasks[parseInt(index)].modifiedOn = modifiedOn;
                        list.changes.push({
                            by: user_id,
                            operationToUndo: 'markTaskAsDone',
                            paramsToUndo: {
                                index: req.body.index,
                                modifiedOn: modifiedOn
                            },
                            createdOn: time.now()
                        });
                        list.markModified('changes');
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
            .then(callObject)
            .then(getUserObjectId)
            .then(changeStatusToOpen)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    addContributer: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.email) || check.isEmpty(req.body.canEdit), check.isEmpty(req.body.name)) {
                    logger.error('Parameters Missing', 'listController: addContributer(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.body.email)) {
                    logger.error('Invalid Index Parameter', 'listController: addContributer(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: addContributer(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.body.listId });
                }
            });
        }

        let callObject = () => {
            return new Promise((resolve, reject) => {
                logger.error('Call Object called', 'listController: addContributer(): callObject()', 9);
                resolve({ userId: req.user.userId });
            });
        }

        let callSenderObject = (user_id) => {
            req.user._id = user_id;
            return new Promise((resolve, reject) => {
                logger.error('Call Sender Object called', 'listController: addContributer(): callObject()', 9);
                resolve({ email: req.body.email });
            });
        }

        let addContributer = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.body.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: req.user._id,
                            isOwner: true
                        }
                    }
                }
                let updateQuery = {
                    $addToSet: {
                        contributers: {
                            user_id: user_id,
                            canEdit: req.body.canEdit
                        }
                    }
                }

                ListModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Added Contributer', 'listController: addContributer()', 10);
                            resolve(response.generate(false, 'Contributer added', 200, null));
                        } else {
                            logger.error('No Contributer Added', 'listController: addContributer()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: addContributer()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let updateUser = (apiResponse) => {
            return new Promise((resolve, reject) => {

                UserModel.update({
                        email: req.body.email,
                    }, {
                        $addToSet: {
                            lists: {
                                listId: req.body.listId,
                                name: req.body.name
                            }
                        },
                        modifiedOn: time.now()
                    })
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('User Updated', 'listController: addContributer(): updateUser()', 10);
                            resolve(apiResponse);
                        } else {
                            logger.error('User Not Updated', 'listController: addContributer(): updateUser()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: addContributer(): updateUser()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(callObject)
            .then(getUserObjectId)
            .then(callSenderObject)
            .then(getUserObjectId)
            .then(addContributer)
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

    removeContributer: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.query.listId) || check.isEmpty(req.query.email)) {
                    logger.error('Parameters Missing', 'listController: removeContributer(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.query.email)) {
                    logger.error('Invalid Index Parameter', 'listController: removeContributer(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: removeContributer(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.query.listId });
                }
            });
        }

        let callObject = () => {
            return new Promise((resolve, reject) => {
                logger.error('Call Object called', 'listController: removeContributer(): callObject()', 9);
                resolve({ userId: req.user.userId });
            });
        }

        let callSenderObject = (user_id) => {
            req.user._id = user_id;
            return new Promise((resolve, reject) => {
                logger.error('Call Sender Object called', 'listController: removeContributer(): callObject()', 9);
                resolve({ email: req.query.email });
            });
        }

        let removeContributer = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.query.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: req.user._id,
                            isOwner: true
                        }
                    }
                }
                let updateQuery = {
                    $pull: {
                        contributers: {
                            user_id: user_id
                        }
                    }
                }

                ListModel.update(findQuery, updateQuery)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Removed Contributer', 'listController: removeContributer()', 10);
                            resolve(response.generate(false, 'Contributer removed', 200, null));
                        } else {
                            logger.error('No Contributer Removed', 'listController: removeContributer()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: removeContributer()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let updateUser = (apiResponse) => {
            return new Promise((resolve, reject) => {

                UserModel.update({
                        email: req.query.email,
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
                            logger.info('User Updated', 'listController: removeContributer(): updateUser()', 10);
                            resolve(apiResponse);
                        } else {
                            logger.error('User Not Updated', 'listController: removeContributer(): updateUser()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: removeContributer(): updateUser()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(callObject)
            .then(getUserObjectId)
            .then(callSenderObject)
            .then(getUserObjectId)
            .then(removeContributer)
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
    grantAccessToEdit: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.email)) {
                    logger.error('Parameters Missing', 'listController: grantAccessToEdit(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.body.email)) {
                    logger.error('Invalid Index Parameter', 'listController: grantAccessToEdit(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: grantAccessToEdit(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.body.listId });
                }
            });
        }

        let callObject = () => {
            return new Promise((resolve, reject) => {
                logger.error('Call Object called', 'listController: grantAccessToEdit(): callObject()', 9);
                resolve({ userId: req.user.userId });
            });
        }

        let callSenderObject = (user_id) => {
            req.user._id = user_id;
            return new Promise((resolve, reject) => {
                logger.error('Call Sender Object called', 'listController: grantAccessToEdit(): callObject()', 9);
                resolve({ email: req.body.email });
            });
        }

        let giveEditAccess = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.body.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: req.user._id,
                            isOwner: true
                        }
                    }
                }
                let updateQuery = {
                    $set: {
                        "contributers.$[i].canEdit": true,
                        "contributers.$[i].modifiedOn": time.now()
                    }
                };

                let options = {
                    arrayFilters: [{
                        "i.user_id": user_id,
                        "i.canEdit": false
                    }]
                }

                ListModel.update(findQuery, updateQuery, options)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Given Edit Access', 'listController: giveEditAccess()', 10);
                            resolve(response.generate(false, 'Edit access granted', 200, null));
                        } else {
                            logger.error('Not Given Edit Access', 'listController: giveEditAccess()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: giveEditAccess()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(callObject)
            .then(getUserObjectId)
            .then(callSenderObject)
            .then(getUserObjectId)
            .then(giveEditAccess)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    grantAccessToRead: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.email)) {
                    logger.error('Parameters Missing', 'listController: grantAccessToRead(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else if (!validate.email(req.body.email)) {
                    logger.error('Invalid Index Parameter', 'listController: grantAccessToRead(): validateParams()', 9);
                    reject(response.generate(true, 'parameters invalid.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: grantAccessToRead(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.body.listId });
                }
            });
        }

        let callObject = () => {
            return new Promise((resolve, reject) => {
                logger.error('Call Object called', 'listController: grantAccessToRead(): callObject()', 9);
                resolve({ userId: req.user.userId });
            });
        }

        let callSenderObject = (user_id) => {
            req.user._id = user_id;
            return new Promise((resolve, reject) => {
                logger.error('Call Sender Object called', 'listController: grantAccessToRead(): callObject()', 9);
                resolve({ email: req.body.email });
            });
        }

        let giveEditAccess = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.body.listId,
                    contributers: {
                        $elemMatch: {
                            user_id: req.user._id,
                            isOwner: true
                        }
                    }
                }
                let updateQuery = {
                    $set: {
                        "contributers.$[i].canEdit": false,
                        "contributers.$[i].modifiedOn": time.now()
                    }
                };

                let options = {
                    arrayFilters: [{
                        "i.user_id": user_id,
                        "i.canEdit": true
                    }]
                }

                ListModel.update(findQuery, updateQuery, options)
                    .then((result) => {
                        if (result.nModified != 0) {
                            logger.info('Given Read Access', 'listController: grantAccessToRead()', 10);
                            resolve(response.generate(false, 'Read only access granted', 200, null));
                        } else {
                            logger.error('Not Given Read Access', 'listController: grantAccessToRead()', 10);
                            resolve(response.generate(true, 'Failed to perform action', 500, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: grantAccessToRead()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(callObject)
            .then(getUserObjectId)
            .then(callSenderObject)
            .then(getUserObjectId)
            .then(giveEditAccess)
            .then((apiResponse) => {
                res.status(apiResponse.status);
                res.send(apiResponse);
            })
            .catch((error) => {
                res.status(error.status);
                res.send(error);
            });
    },
    undo: (req, res) => {
        //Local Function Start-->

        let validateParams = () => {
            return new Promise((resolve, reject) => {
                if (check.isEmpty(req.body.listId)) {
                    logger.error('Parameters Missing', 'listController: undo(): validateParams()', 9);
                    reject(response.generate(true, 'parameters missing.', 403, null));
                } else {
                    logger.info('Parameters Validated', 'listController: undo(): validateParams()', 9);
                    resolve({ userId: req.user.userId, listId: req.body.listId });
                }
            });
        }

        let callObject = () => {
            return new Promise((resolve, reject) => {
                resolve({ userId: req.user.userId });
            });
        }

        let getList = (user_id) => {
            return new Promise((resolve, reject) => {
                let findQuery = {
                    listId: req.body.listId
                }

                ListModel.findOne(findQuery)
                    .then((list) => {
                        let canEdit = false;
                        for (let i = 0; i < list.contributers.length; i++) {
                            if (list.contributers[i].user_id.toString() == user_id.toString() && list.contributers[i].canEdit) {
                                canEdit = true;
                                break;
                            }
                        }
                        if (canEdit) {
                            logger.info('Has List Edit Access', 'listController: undo(): getList()', 9);
                            resolve(list);
                        } else {
                            logger.error(err.message, 'listController: undo(): getList()', 10);
                            reject(response.generate(true, 'Unauthorized Access', 403, null));
                        }
                    })
                    .catch((err) => {
                        logger.error(err.message, 'listController: undo(): getList()', 10);
                        reject(response.generate(true, 'Failed to perform action', 500, null));
                    });
            });
        }

        let undoChanges = (list) => {
            return new Promise((resolve, reject) => {
                if (list.changes.length == 0) {
                    logger.error("No More Changes Left", 'listController: undoChanges()', 10);
                    reject(response.generate(true, 'No More Undo Operations', 403, null));
                } else {
                    let changes = list.changes[list.changes.length - 1];
                    let index = changes.paramsToUndo.index;
                    if (changes.operationToUndo == 'addTask') {
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
                        tempTasks.push({
                            text: changes.paramsToUndo.text,
                            subTasks: changes.paramsToUndo.subTasks,
                            isOpen: changes.paramsToUndo.isOpen,
                            modifiedOn: changes.paramsToUndo.modifiedOn,
                            createdOn: changes.paramsToUndo.createdOn
                        });
                    } else if (changes.operationToUndo == 'deleteTask') {
                        if (index == -1) {
                            list.tasks.pop();
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
                            tempTask.subTasks.pop();
                        }
                    } else if (changes.operationToUndo == 'markTaskAsDone') {
                        let tempTasks = list.tasks;
                        let tempTask;
                        while (true) {
                            if (index.indexOf('.') == -1) {
                                break;
                            } else
                                tempTask = tempTasks[parseInt(index.substring(0, index.indexOf('.')))];
                            tempTasks = tempTask.subTasks;
                            index = index.substring(index.indexOf('.') + 1);
                        }
                        tempTasks[parseInt(index)].isOpen = false;
                        tempTasks[parseInt(index)].modifiedOn = changes.paramsToUndo.modifiedOn;
                    } else if (changes.operationToUndo == 'markTaskAsOpen') {
                        let tempTasks = list.tasks;
                        let tempTask;
                        while (true) {
                            if (index.indexOf('.') == -1) {
                                break;
                            } else
                                tempTask = tempTasks[parseInt(index.substring(0, index.indexOf('.')))];
                            tempTasks = tempTask.subTasks;
                            index = index.substring(index.indexOf('.') + 1);
                        }
                        tempTasks[parseInt(index)].isOpen = true;
                        tempTasks[parseInt(index)].modifiedOn = changes.paramsToUndo.modifiedOn;
                    }
                    list.changes.pop();
                    list.markModified('changes');
                    list.markModified('tasks');
                    list.save(function(err) {
                        if (err) {
                            logger.error(err.message, 'listController: undoChanges()', 10);
                            reject(response.generate(true, 'Failed to perform action', 500, null));
                        } else {
                            logger.info('Task Deleted', 'listController: undoChanges()', 10);
                            resolve(response.generate(false, 'Changes Undone', 200, list.tasks));
                        }
                    });
                }
            });
        }

        //<--Local Functions End

        validateParams()
            .then(validateUserListAccess)
            .then(callObject)
            .then(getUserObjectId)
            .then(getList)
            .then(undoChanges)
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