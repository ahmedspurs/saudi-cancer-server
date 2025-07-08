const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gift_donations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    donation_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'donations_common',
        key: 'id'
      }
    },
    giver_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    receiver_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    receiver_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sms_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'gift_donations',
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
    ]
  });
};
