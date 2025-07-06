const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comprehensive_documents', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name_ar: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description_ar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'comprehensive_documents',
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
        name: "is_active_sort_order",
        using: "BTREE",
        fields: [
          { name: "is_active" },
          { name: "sort_order" },
        ]
      },
    ]
  });
};
