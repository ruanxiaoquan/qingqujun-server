
let models = require("../../models");

let proto = module.exports = function () {
    function SessionService() {

    }
    SessionService.__proto__ = proto;
    return SessionService;
}

proto.getAllSession = function () {
    return models.UserSession.findAll();
}