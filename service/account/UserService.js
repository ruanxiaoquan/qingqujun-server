
let db = require("../../models");
let _ = require("lodash");
let regs = require("../../common/reg");
let security = require("../../common/security");
let uuid = require("node-uuid");
let log = require("../../common/log").logger("UserService");

let self = module.exports = function () {
    function UserService() {

    }
    UserService.__proto__ = self;
    return UserService;
}

self.getAllUser = function () {
    return db.UserSession.findAll();
}


self.userLogin = (opts) => {
    return new Promise((success, fail) => {
        if (!opts.username.isPhone) {
            fail({ message: "请输入手机号码", code: -1 });
            return;
        }
        if (!opts.password) {
            fail({ message: "请输入密码", code: -1 });
            return;
        }
        db.User.findOne({ where: { phone: opts.username } }).then(data => {
            if (!data) fail({ code: -1, message: "帐号或密码错误" });
            let reqPwd = security.encrypt(opts.password);
            if (reqPwd != data.password) {
                fail({ message: "帐号或密码错误", code: -1 });
                return;
            }
            if (data.is_lock) {
                fail({ message: "您的账户异常", code: -1 });
                return;
            }
            let token = uuid.v4();
            db.UserSession.create({
                user_id: data.id,
                token: token,
                phone: opts.username,
                login_location: "北京市"
            }).then((session) => {
                logout(data.id, session.id);
                db.VUserInfo.findOne({
                    attributes: ["user_id", "nick_name", "birthday", "age", "photo", "is_lock", "loaction", "signature", "create_time"]
                }, { where: { user_id: { "$eq": data.id } } })
                    .then(userInfo => {
                        let resUserInfo = Object.assign({}, userInfo.dataValues, { token });
                        success({ code: 1, data: resUserInfo });
                    }).catch((err) => {
                        log.error("登录时查询用户信息失败", err);
                        fail({ message: "当前网络不稳定", code: -500 });
                    });
            }).catch((err) => {
                log.error("写入session失败", err);
                fail({ message: "当前网络不稳定", code: -500 });
            });
        }).catch(err => {
            log.error("登录失败", err);
            fail({ message: "当前网络不稳定", code: -500 });
        });
    });
}

function logout(user_id, id) {
    let oid = {};
    if (id) {
        oid = {
            "$ne": id
        }
    }
    db.UserSession.update({
        online: false,
        logout_time: new Date()
    }, {
            where: {
                user_id: user_id,
                online: true,
                id: oid
            }
        }).catch(err => {
            log.error("登录时，登出session失败", err);
        });
}