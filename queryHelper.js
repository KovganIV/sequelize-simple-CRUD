// sequelize - sequelize object(your var sequelize = new Sequelize();)
// request - Express request
// offsetF - name of offset field from response query. Example: 'offset'
// countF - name of count field from response query
// qF - name of q field from response query
// searchArray - array of search columns
// sortField - name of q sort field from response query. Example: 'filter'. Field data: 'name' or '-name' etc.
// sortFields - array of arrays with filter names and table columns. Example: [['name', 'name'], ['createdAt', 'createdAt']] and with relations [['date', '"Orders"."orderDate"']]

module.exports = function(sequelize, offsetF, countF, qF, searchArray, sortField, sortFields) {
  return {
    getConfig: function(request) {
      var config = {};

      var q = request.query[qF];
      var offset = request.query[offsetF];
      var count = request.query[countF];

      config.where = {};
      if (q && searchArray.length > 0) {
        config.where.$or = [];
        for (var i = 0; i < searchArray.length; i++) {
          config.where.$or.push(
            sequelize.where(sequelize.cast(sequelize.col(searchArray[i]), 'TEXT'), 'ILIKE', '%' + q + '%'));
        }
      }

      if (sortField && sortFields) {
        config.order = {};
        var isRevers = sortField.indexOf('-') == 0;
        if (isRevers) sortField = sortField.substr(1, sortField.length);
        for (var i = 0; i < sortFields.length; i++) {
          var map = sortFields[i];
          if (map[0] == sortField) {
            if (sortField == 'createdAt' || sortField == 'updatedAt') {
              config.order = [[sortField, isRevers ? 'ASC' : 'DESC']]
            } else config.order = (map[1] + ' ' + (isRevers ? 'ASC' : 'DESC'));
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