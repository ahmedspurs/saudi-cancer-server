const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_images', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    caption_ar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    caption_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'post_images',
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
        name: "post_id",
        using: "BTREE",
        fields: [
          { name: "post_id" },
        ]
      },
    ]
  });
};
