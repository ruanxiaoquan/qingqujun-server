module.exports = {
    isDev: true,
    dev: {
        server: "http://webserver-app.youxinpai.com/",
        jp_server: "https://jp-app.youxinpai.com/",
        key: "#$%^&*(*&)(*&^%HJKJH)",
        tag: "TYUIIUY(*&())",
        port: 8080,
        db: {
            host: "",
            database: "",
            username: "",
            password: "!23",
            port: 3306,
            dialect: "mysql"
        }
    },
    production: {
        server: "http://webserver.youxinpai.com/",
        jp_server: "http://webjp.youxinpai.com/",
        key: "KJHGHJ*&^^&*()",
        tag: "LKJHGJK***(*&())",
        port: 8080,
        db: {
            host: "",
            database: "",
            username: "",
            password: "",
            port: 3306,
            dialect: "mysql"
        }
    },
    log4js: {
        appenders: [{
            "type": "dateFile",
            "filename": 'logs/info/',
            "pattern": "yyyy-MM-dd hh info.log",
            "level": "INFO",
            "alwaysIncludePattern": true,
        }, {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": {
                "type": "dateFile",
                "filename": "logs/errors/",
                "pattern": "yyyy-MM-dd error.log",
                "alwaysIncludePattern": true
            }
        }],
        replaceConsole: false,
        levels: { logInfo: "INFO" }
    },
};
