define({ "api": [
  {
    "type": "post",
    "url": "/bank/transactions",
    "title": "Post transactions collection",
    "name": "PostTransactionsCollection",
    "group": "Bank",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "objectBody",
            "description": "<p>JSON body of the transactions array to save.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/bank.js",
    "groupTitle": "Bank"
  },
  {
    "type": "get",
    "url": "/data/:object",
    "title": "Get object data",
    "name": "GetObject",
    "group": "DataPoint",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "object",
            "description": "<p>Name of object to get.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "start",
            "description": "<p>Query string. Start date of range to get.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "end",
            "description": "<p>Query string. End data of range to get.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "date",
            "description": "<p>Query string. Date of objects to get.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "view",
            "description": "<p>Query string. View to use when getting.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/dataPoint.js",
    "groupTitle": "DataPoint"
  },
  {
    "type": "post",
    "url": "/data/:object",
    "title": "Post object data",
    "name": "PostObject",
    "group": "DataPoint",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "object",
            "description": "<p>Name of object to save.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "objectBody",
            "description": "<p>JSON body of the object to save.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/dataPoint.js",
    "groupTitle": "DataPoint"
  },
  {
    "type": "post",
    "url": "/data/:object/collection",
    "title": "Post object data collection",
    "name": "PostObjectCollection",
    "group": "DataPoint",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "object",
            "description": "<p>Name of object collection to post.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "objectBody",
            "description": "<p>JSON body of the object array to post.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/dataPoint.js",
    "groupTitle": "DataPoint"
  },
  {
    "type": "put",
    "url": "/data/:object",
    "title": "Put object data",
    "name": "PutObject",
    "group": "DataPoint",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "object",
            "description": "<p>Name of object to update.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "date",
            "description": "<p>Query string. Date of object to update.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "change",
            "description": "<p>Query string. Change in object to update.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/dataPoint.js",
    "groupTitle": "DataPoint"
  },
  {
    "type": "post",
    "url": "/sleep",
    "title": "Post sleep data array",
    "name": "PostSleepDataArray",
    "group": "Sleep_Data",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "objectBody",
            "description": "<p>JSON body of the sleep data array to save.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/sleep.js",
    "groupTitle": "Sleep_Data"
  }
] });