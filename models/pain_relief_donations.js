const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pain_relief_donations', {
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
    program_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'pain_relief_programs',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    donation_option_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pain_relief_options',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pain_relief_donations',
    timestamps: false,
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
        name: "program_id",
        using: "BTREE",
        fields: [
          { name: "program_id" },
        ]
      },
      {
        name: "donation_option_id",
        using: "BTREE",
        fields: [
          { name: "donation_option_id" },
        ]
      },
    ]
  });
};
