"use strict";

module.exports = function (sequelize, DataTypes) {
    var UserSession = sequelize.define("UserSession", {
        id: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: DataTypes.BIGINT(20),
        token: DataTypes.STRING,
        login_time: DataTypes.DATE,
        login_location: DataTypes.STRING,
        login_device: DataTypes.STRING,
        device_id: DataTypes.STRING,
        phone: DataTypes.STRING,
        online: DataTypes.BOOLEAN,
        logout_time: DataTypes.DATE
    }, {
            tableName: 'user_session',
            underscored: true,
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            deletedAt: false,
            paranoid: true,
        });
    return UserSession;
};
