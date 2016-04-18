# sequelize-simple-CRUD

Sequelize-simple-CRUD is a Sequelize based API builder for Node.js.

## Installation

`npm install sequelize-simple-crud`

## API responses example

Get item
```
    {"item": {"id": 1}}
```
Get items
```
    {"items": [{"id": 1}, {"id": 2}], "count": 2}
```
With error
```
    {"error": "Wrong params"}
```

## Base objects

New controller object
```
    new ssCRUD.Controller(YourModel);
```
Your query configurator
```
    new ssCRUD.QueryHelper(sequelize,
     offsetFieldName,
     countFieldName,
     searchQFieldName,
     arrayWithSearchFields,
     filterFieldName,
     arrayOfAvailableFieldsForFilter);
```

## Controller functions

Configure your C(create) and U(update) method fields

```
    var logController = new ssCRUD.Controller(LogModel);
    logController
          .addCreate(arrayOfMandatoryFields, arrayOfNotMandatoryFields)
          .addUpdate(arrayOfMandatoryFields, arrayOfNotMandatoryFields)
```

## CRUD API config example

LogModel
```
    module.exports.defineModel = function(sequelize, DataTypes) {
      return sequelize.define('LogModel', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        source: DataTypes.STRING,
        severity: DataTypes.INTEGER,
        message: DataTypes.STRING
      });
    };
```

Your router
```
    var ssCRUD = require('sequelize-simple-crud');

    var LogModel = require('../models/LogModel').defineModel(sequelize, Sequelize);
    var logController = new ssCRUD.Controller(LogModel);

    logController
      .addCreate(['severity', 'source', 'message'])
      .addUpdate([], ['severity', 'source', 'message'])
      .addQueryHelper(new ssCRUD.QueryHelper(modelsStore.sequelize,
        'offset',
        'count',
        'q',
        ['severity', 'source', 'message'], // You can use relation fields. Example: 'UserModel.name'
        'filter',
        ['severity', 'source', 'message']
      ));


    app.get('/logs/:id', logController.getItem);
    app.get('/logs', logController.getItems);
    app.post('/logs', logController.createItem);
    app.put('/logs/:id', logController.updateItem);
    app.delete('/logs/:id', logController.deleteItem);
```