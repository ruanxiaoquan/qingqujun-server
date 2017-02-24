
let regs = {
    number: /^[0 - 9] * $/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    phone: /^0*(13|14|15|17|18)\d{9}$/,
};

String.prototype.isEmail = function () {
    return regs.email.test(this);
}

String.prototype.isPhone = function () {
    return regs.phone.test(this)
}

module.exports = regs;