const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payments', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    payment_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    donation_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'donations_common',
        key: 'id'
      }
    },
    payment_method_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'payment_methods',
        key: 'id'
      }
    },
    payment_status: {
      type: DataTypes.ENUM('success','failed','pending'),
      allowNull: true,
      defaultValue: "pending"
    },
    receipt_url: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payments',
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
        name: "donation_id",
        using: "BTREE",
        fields: [
          { name: "donation_id" },
        ]
      },
      {
        name: "payment_method_id",
        using: "BTREE",
        fields: [
          { name: "payment_method_id" },
        ]
      },
    ]
  });
};
