"use strict";

module.exports = function (sequelize, DataTypes) {
    var VUserInfo = sequelize.define("VUserInfo", {
        user_id: DataTypes.BIGINT(20),
        nick_name: DataTypes.STRING,
        birthday: DataTypes.STRING,
        age: DataTypes.INTEGER(10),
        photo: DataTypes.STRING,
        phone: DataTypes.STRING,
        is_lock: DataTypes.BOOLEAN,
        loaction: DataTypes.STRING,
        signature: DataTypes.STRING, 
        create_time: DataTypes.DATE, 
    }, {
            tableName: 'v_user_info',
            underscored: false, 
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            deletedAt: false
        });
    return VUserInfo;
};
