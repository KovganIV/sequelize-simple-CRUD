# sequelize-simple-CRUD

### Simple example of CRUD API config

    var ssCRUD = require('sequelize-simple-crud');
    
    var logController = new ssCRUD.Controller(modelsStore.LogModel);
    
    logController
      .addCreate(['severity', 'source', 'message'])
      .addUpdate([], ['severity', 'source', 'message'])
      .addQueryHelper(new ssCRUD.QueryHelper(modelsStore.sequelize,
        'offset',
        'count',
        'q',
        ['severity', 'source', 'message']
      ));


    app.get('/logs/:id', logController.getItem);
    app.get('/logs', logController.getItems);
    app.post('/logs', logController.createItem);
    app.put('/logs/:id', logController.updateItem);
    app.delete('/logs/:id', logController.deleteItem);
