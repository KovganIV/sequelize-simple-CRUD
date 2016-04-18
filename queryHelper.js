// sequelize - sequelize object(your var sequelize = new Sequelize();)
// request - Express request
// offsetF - name of offset field from response query. Example: 'offset'
// countF - name of count field from response query
// qF - name of q field from response query
// searchArray - array of search columns
// sortField - name of q sort field from response query. Example: 'filter'. Field data: 'name' or '-name' etc.
// sortFields - array of arrays with filter names and table columns. Example: [['name', 'name'], ['createdAt', 'createdAt']] and with relations [['date', '"Orders"."orderDate"']]

module.exports = function(sequelize, offsetF, countF, qF, searchArray, sortFieldF, sortFields) {
  return {
    getConfig: function(request) {
      var config = {};

      var q = request.query[qF];
      var offset = request.query[offsetF];
      var count = request.query[countF];
      var sortField = request.query[sortFieldF];

      config.where = {};
      config.include = [];
      // Supports relations or search
      if (q && searchArray.length > 0) {
        config.where.$or = [];
        var putToInclude;
        for (var i = 0; i < searchArray.length; i++) {
          if (searchArray[i].indexOf('.') != -1) {
            putToInclude = true;
            break;
          }
        }

        var likes = [];
        for (var i = 0; i < searchArray.length; i++) {
          if (searchArray[i].indexOf('.') != -1) {
            var model = sequelize.model(searchArray[i].substr(0, searchArray[i].indexOf('.')));
            if (model) {
              config.include.push({model: model, where: {$or: []}});
            }
          }
          var likeQuery = sequelize.where(sequelize.cast(sequelize.col(searchArray[i]), 'TEXT'), 'ILIKE', '%' + q + '%');

          if (!putToInclude) config.where.$or.push(likeQuery);
          else likes.push(likeQuery);
        }

        if (putToInclude && config.include.length > 0) {
          config.include[0].where.$or = likes;
        }
      }

      if (sortField && sortFields) {
        var isRevers = sortField.indexOf('-') == 0;
        if (isRevers) sortField = sortField.substr(1, sortField.length);
        for (var i = 0; i < sortFields.length; i++) {
          var map = sortFields[i];
          if (map == sortField) {
            if (!config.order) config.order = {};
            config.order = [[sortField, isRevers ? 'DESC' : 'ASC']]
          }
        }
      }

      if (offset && !isNaN(offset)) config.offset = offset;
      if (count && !isNaN(offset)) config.limit = count;
      config.subQuery = false;
      return config;
    }
  }
};