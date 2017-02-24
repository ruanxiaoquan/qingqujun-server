var crypto = require('crypto');
var config = require("../config");
var log = require("../common/log").logger("security");
var $ = require('underscore');
var DEFAULTS = {
    encoding: {
        input: 'utf8',
        output: 'hex'
    },
    algorithms: ['bf', 'blowfish', 'aes-128-cbc']
};

function MixCrypto() {
    var options = {};
    options = $.extend({}, DEFAULTS, options);
    this.key = config.dev.key;
    this.tag = config.dev.tag;
    if (!config.isDev) {
        this.key = config.production.key;
        this.tag = config.production.tag;
    }
    this.inputEncoding = options.encoding.input;
    this.outputEncoding = options.encoding.output;
    this.algorithms = options.algorithms;
}

MixCrypto.prototype.encrypt = function (plaintext) {
    if (!plaintext) return "";
    return $.reduce(this.algorithms, function (memo, a) {
        var cipher = crypto.createCipher(a, this.key);
        return cipher.update(memo, this.inputEncoding, this.outputEncoding)
            + cipher.final(this.outputEncoding)
    }, plaintext, this);
};

MixCrypto.prototype.decrypt = function (crypted) {
    try {
        if (!crypted) return "";
        return $.reduceRight(this.algorithms, function (memo, a) {
            var decipher = crypto.createDecipher(a, this.key);
            return decipher.update(memo, this.outputEncoding, this.inputEncoding)
                + decipher.final(this.inputEncoding);
        }, crypted, this);
    } catch (e) {
        return "";
    }
};


MixCrypto.prototype.setCode = function (code) {
    if (!code) return "";
    var text = this.tag.concat("$", code);
    return this.encrypt(text);
};


MixCrypto.prototype.getCode = function (code) {
    if (!code) return "";
    var text = this.decrypt(code);
    return text.split("$")[1] || "";
};

module.exports = new MixCrypto();