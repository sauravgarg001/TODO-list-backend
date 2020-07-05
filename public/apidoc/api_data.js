define({ "api": [
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/v1/lists/",
    "title": "to delete list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Removed from list as contributers\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        },
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"List Deleted\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "DeleteApiV1Lists"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/v1/lists/contributers",
    "title": "to remove contributer from list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of contributer. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Contributer removed\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "DeleteApiV1ListsContributers"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/v1/lists/task",
    "title": "to delete a task from list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "float",
            "optional": false,
            "field": "index",
            "description": "<p>index of task in list. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Task deleted from list\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "DeleteApiV1ListsTask"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/lists/",
    "title": "to get list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body query) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (body query) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"List fetched\",\n  \"status\": 200,\n  \"data\": {\n         canEdit: true\n         contributers: [\n             canEdit: true\n             createdOn: \"2020-07-05T17:03:10.222Z\"\n             isOwner: true\n             modifiedOn: \"2020-07-05T17:03:10.222Z\"\n             user_id:{\n                 email: \"sauravgarg001@gmail.com\"\n                 firstName: \"Saurav\"\n                 lastName: \"Garg\"\n                 userId: \"xxTb61m4F\"\n             },\n             .................\n         ]\n         createdOn: \"2020-07-05T17:03:10.223Z\"\n         listId: \"aVlxl_QoL\"\n         modifiedOn: \"2020-07-05T17:03:10.223Z\"\n         name: \"list 1\"\n         tasks: [\n             {\n                 \"subTasks\": [\n                     {\n                         \"text\": \"task 1.1\",\n                         \"subTasks\": [ ],\n                         \"isOpen\": true,\n                         \"modifiedOn\": \"2020-07-05T17:03:25Z\",\n                         \"createdOn\": \"2020-07-05T17:03:25Z\"\n                     },\n                     .................\n                 ],\n                 \"isOpen\": true,\n                 \"createdOn\": \"2020-07-05T17:03:19.000Z\",\n                 \"modifiedOn\": \"2020-07-05T17:03:19.000Z\",\n                 \"text\": \"task 1\"\n             },\n             .................\n         ]\n  }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "GetApiV1Lists"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/lists/all",
    "title": "to get all user's lists.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body query) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"All Lists Listed\",\n  \"status\": 200,\n  \"data\": [\n     {\n         createdOn: \"2020-07-05T17:03:10.284Z\"\n         isActive: true\n         listId: \"aVlxl_QoL\"\n         modifiedOn: \"2020-07-05T17:03:10.000Z\"\n         name: \"list 1\"   \n     },\n     ..................\n ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "GetApiV1ListsAll"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/lists/",
    "title": "to create list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>name of list. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"List created\",\n  \"status\": 200,\n  \"data\": {\n         isActive: true\n         listId: \"aVlxl_QoL\"\n         name: \"list 1\"\n  }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PostApiV1Lists"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/lists/contributers",
    "title": "to add contributer to list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of contributer. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>name of list. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "canEdit",
            "description": "<p>to give/not give access to edit to contributer. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Contributer added\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PostApiV1ListsContributers"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/lists/task",
    "title": "to add new task to list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>text of task. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "float",
            "optional": false,
            "field": "index",
            "description": "<p>index of task in list. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"New task added to list\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PostApiV1ListsTask"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/lists/contributers/access/edit",
    "title": "to give contributer edit access of list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of contributer. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n \"error\": false,\n\"message\": \"Edit access granted\",\n\"status\": 200,\n\"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PutApiV1ListsContributersAccessEdit"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/lists/contributers/access/edit",
    "title": "to give contributer read only access of list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of contributer. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n \"error\": false,\n\"message\": \"Read only access granted\",\n\"status\": 200,\n\"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PutApiV1ListsContributersAccessEdit"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/lists/mark/active",
    "title": "to mark list as active list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"List marked as active\",\n  \"status\": 200,\n  \"data\": {\n         canEdit: true\n         contributers: [\n             canEdit: true\n             createdOn: \"2020-07-05T17:03:10.222Z\"\n             isOwner: true\n             modifiedOn: \"2020-07-05T17:03:10.222Z\"\n             user_id:{\n                 email: \"sauravgarg001@gmail.com\"\n                 firstName: \"Saurav\"\n                 lastName: \"Garg\"\n                 userId: \"xxTb61m4F\"\n             },\n             .................\n         ]\n         createdOn: \"2020-07-05T17:03:10.223Z\"\n         listId: \"aVlxl_QoL\"\n         modifiedOn: \"2020-07-05T17:03:10.223Z\"\n         name: \"list 1\"\n         tasks: [\n             {\n                 \"subTasks\": [\n                     {\n                         \"text\": \"task 1.1\",\n                         \"subTasks\": [ ],\n                         \"isOpen\": true,\n                         \"modifiedOn\": \"2020-07-05T17:03:25Z\",\n                         \"createdOn\": \"2020-07-05T17:03:25Z\"\n                     },\n                     .................\n                 ],\n                 \"isOpen\": true,\n                 \"createdOn\": \"2020-07-05T17:03:19.000Z\",\n                 \"modifiedOn\": \"2020-07-05T17:03:19.000Z\",\n                 \"text\": \"task 1\"\n             },\n             .................\n         ]\n  }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PutApiV1ListsMarkActive"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/lists/task/mark/done",
    "title": "to change status of task to done in list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "float",
            "optional": false,
            "field": "index",
            "description": "<p>index of task in list. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Task marked as done\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PutApiV1ListsTaskMarkDone"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/lists/task/mark/open",
    "title": "to change status of task to open in list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "float",
            "optional": false,
            "field": "index",
            "description": "<p>index of task in list. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Task marked as open\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PutApiV1ListsTaskMarkOpen"
  },
  {
    "group": "lists",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/lists/undo",
    "title": "to undo last change to list.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of list. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"Changes Undone\",\n    \"status\": 200,\n    \"data\": [\n        {\n            createdOn: \"2020-07-05T17:03:19.000Z\"\n            isOpen: true\n            modifiedOn: \"2020-07-05T17:03:19.000Z\"\n            subTasks: []\n            text: \"task 1\"\n        }\n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/list.js",
    "groupTitle": "lists",
    "name": "PutApiV1ListsUndo"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/v1/users/friend/remove",
    "title": "to remove user from friends.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user whom to remove. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Friend removed\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "DeleteApiV1UsersFriendRemove"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/v1/users/request/decline",
    "title": "to decline friend request to user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user whose's friend request is declined. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Request Deleted\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "DeleteApiV1UsersRequestDecline"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/users/",
    "title": "to get details of user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"User Details Found\",\n  \"status\": 200,\n  \"data\": {\n     email: \"abc@gmail.com\"\n     firstName: \"ABC\"\n     friendRequests: [\n         createdOn: \"2020-07-05T10:56:46.077Z\"\n         user_id:{\n             email: \"xyz@gmail.com\"\n             firstName: \"XYZ\"\n             lastName: \"123\"\n         }\n     ]\n     friends: [\n         createdOn: \"2020-07-05T10:56:46.077Z\"\n         user_id:{\n             email: \"mno@gmail.com\"\n             firstName: \"MNO\"\n             lastName: \"456\"\n         }\n     ]\n     lastName: \"978\"\n     mobileNumber: 9876543210\n     userId: \"xxTb61m4F\"\n }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "GetApiV1Users"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/users/all",
    "title": "to get details of all users.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (query params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"All User Details Found\",\n  \"status\": 200,\n  \"data\": [\n     {\n         email: \"abc@gmail.com\"\n         firstName: \"ABC\"\n         lastName: \"DEF\"\n     },\n     {\n         email: \"xyz@gmail.com\"\n         firstName: \"XYZ\"\n         lastName: \"123\"\n     },\n     .........................\n  ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "GetApiV1UsersAll"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/forgot/password",
    "title": "to send OTP to user's registered email address.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"OTP send to registered email\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersForgotPassword"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/forgot/password",
    "title": "to send OTP to user's registered email address.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "OTP",
            "description": "<p>OTP of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "newPassword",
            "description": "<p>new password of user account. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Password changed\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersForgotPassword"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/login",
    "title": "to login into user's account.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of user's account. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Login Successful\",\n  \"status\": 200,\n  \"data\": {\n         \"userId\": \"xxTb61m4F\",\n         \"firstName\": \"ABC\",\n         \"lastName\": \"EFG\",\n         \"email\": \"abc@gmail.com\",\n         \"mobileNumber\": 9876543210\n  }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersLogin"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/logout",
    "title": "to log out from user's account.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Logged Out Successfully\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersLogout"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/request/accept",
    "title": "to accept friend request to user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user whose's friend request is accepted. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Request accepted\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersRequestAccept"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/request/send",
    "title": "to send friend request to user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "authToken",
            "description": "<p>authToken of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user whom to send request. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"Request send\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        },
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"New request send again\",\n  \"status\": 200,\n  \"data\":null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersRequestSend"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/signup",
    "title": "to create a new user account.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>first name of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>last name of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mobileNumber",
            "description": "<p>mobile number of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email address of user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of user's account. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "countryCode",
            "description": "<p>country code of user's mobile number. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n  \"error\": false,\n  \"message\": \"User created\",\n  \"status\": 200,\n  \"data\": null\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersSignup"
  }
] });
