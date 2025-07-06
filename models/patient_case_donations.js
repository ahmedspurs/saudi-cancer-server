const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patient_case_donations', {
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
    patient_case_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'patients_cases',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'patient_case_donations',
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
        name: "patient_case_id",
        using: "BTREE",
        fields: [
          { name: "patient_case_id" },
        ]
      },
    ]
  });
};
