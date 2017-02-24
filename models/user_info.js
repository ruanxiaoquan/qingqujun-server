"use strict";

module.exports = function (sequelize, DataTypes) {
    var UserInfo = sequelize.define("UserInfo", {
        user_id: {
            type: DataTypes.BIGINT(20),
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
        },
        nick_name: DataTypes.STRING,
        birthday: DataTypes.STRING,
        age: DataTypes.INTEGER(10),
        photo: DataTypes.STRING,
        loaction: DataTypes.STRING,
        signature: DataTypes.STRING,
        last_time: DataTypes.DATE,
        create_time: DataTypes.DATE,
    }, {
            tableName: 'user_info',
            underscored: true,
            paranoid: true,
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            deletedAt: false,
        });
    return UserInfo;
};
