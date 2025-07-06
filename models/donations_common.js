const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('donations_common', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    payment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'donation_categories',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    case_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'cases',
        key: 'id'
      }
    },
    gift_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'gift_donations',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending','paid'),
      allowNull: true,
      defaultValue: "pending"
    }
  }, {
    sequelize,
    tableName: 'donations_common',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
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
        name: "donations_common_ibfk_case",
        using: "BTREE",
        fields: [
          { name: "case_id" },
        ]
      },
      {
        name: "payment_id",
        using: "BTREE",
        fields: [
          { name: "payment_id" },
        ]
      },
      {
        name: "gift_id",
        using: "BTREE",
        fields: [
          { name: "gift_id" },
        ]
      },
    ]
  });
};
