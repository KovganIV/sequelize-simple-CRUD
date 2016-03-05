# sequelize-simple-CRUD

Sequelize-simple-CRUD is a Sequelize based API builder for Node.js.

## Installation

`npm install sequelize-simple-crud`

### API responses example

Get item
```
    {"item": {"id": 1}}
```
Get items
```
    {"items": [{"id": 1}, {"id": 2}]}
```
With error
```
    {"error": "Wrong params"}
```

### CRUD API config example

    var ssCRUD = require('sequelize-simple-crud');
    
    var logController = new ssCRUD.Controller(modelsStore.LogModel);
    
    logController
      .addCreate(['severity', 'source', 'message'])
      .addUpdate([], ['severity', 'source', 'message'])
      .addQueryHelper(new ssCRUD.QueryHelper(modelsStore.sequelize,
        'offset',
        'count',
        'q',
        ['severity', 'source', 'message'],
        'filter',
        ['severity', 'source', 'message']
      ));


    app.get('/logs/:id', logController.getItem);
    app.get('/logs', logController.getItems);
    app.post('/logs', logController.createItem);
    app.put('/logs/:id', logController.updateItem);
    app.delete('/logs/:id', logController.deleteItem);
