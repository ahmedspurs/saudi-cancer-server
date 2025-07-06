const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('social_media_links', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    platform: {
      type: DataTypes.ENUM('facebook','twitter','instagram','linkedin','youtube','tiktok','snapchat','threads','whatsapp','other'),
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'social_media_links',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "platform_active_sort",
        using: "BTREE",
        fields: [
          { name: "platform" },
          { name: "is_active" },
          { name: "sort_order" },
        ]
      },
    ]
  });
};
