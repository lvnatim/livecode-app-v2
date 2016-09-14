'use strict';
module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    bio: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      //associate models here
      associate: function(models){
        Profile.belongsTo(models.User);
      }
    }  
  });
  sequelize.sync();
  return Profile;
};

