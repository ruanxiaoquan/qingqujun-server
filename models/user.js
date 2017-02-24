"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        id: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        is_lock: DataTypes.BOOLEAN,
        register_time: DataTypes.DATE,
        register_location: DataTypes.STRING,
        last_time: DataTypes.DATE,
        create_time: DataTypes.DATE,
    }, {
            tableName: 'user',
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            deletedAt: false,
            underscored: true,
            paranoid: true,
        });
    return User;
};
