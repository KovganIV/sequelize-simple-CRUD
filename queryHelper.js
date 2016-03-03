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
      if (q && searchArray.length > 0) {
        config.where.$or = [];
        for (var i = 0; i < searchArray.length; i++) {
          config.where.$or.push(
            sequelize.where(sequelize.cast(sequelize.col(searchArray[i]), 'TEXT'), 'ILIKE', '%' + q + '%'));
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

      if (offset) config.offset = offset;
      if (count) config.limit = count;
      config.subQuery = false;
      return config;
    }
  }
};