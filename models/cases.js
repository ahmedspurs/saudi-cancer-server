const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cases', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'donation_categories',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('major','minor','urgent'),
      allowNull: true,
      defaultValue: "minor"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    target_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    progress: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true,
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.ENUM('open','completed'),
      allowNull: false,
      defaultValue: "open"
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'cases',
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
        name: "category_id",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
