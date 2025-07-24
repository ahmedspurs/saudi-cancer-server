const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('static_sections', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "slug_unique"
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title_ar: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    content_ar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meta_title_ar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meta_title_en: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meta_description_ar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_description_en: {
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
    tableName: 'static_sections',
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
        name: "slug",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slug" },
        ]
      },
      {
        name: "slug_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slug" },
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
