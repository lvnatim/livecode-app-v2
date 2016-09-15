'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'untitled'
    },
    content: {
      type: DataTypes.STRING(10000),
      allowNull: false,
      defaultValue: ''
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'JavaScript'
    }
  }, {
    classMethods: {
      associate: function(models) {
        Document.belongsTo(models.User, {as: "Owner"});
        Document.belongsToMany(models.User, 
          {
            through: {
              model: 'UserDocuments'
            },
            foreignKey: 'DocId'
          }
        );
      }
    }
  });
  sequelize.sync();
  return Document;
};