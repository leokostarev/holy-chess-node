const Flog = require("log-to-file");

require("./utils"); //rjust

let LOG_TO_CONSOLE = true;

class Logger {
    constructor(who) {
        this.who = who;
    }

    log(level, message) {
        log(this.who, level, message);
    }

    info(message) {
        log(this.who, "INFO", message);
    }

    warning(message) {
        log(this.who, "WARNING", message);
    }

    fatal(message) {
        log(this.who, "FATAL", message);
    }

}

function log(who, level, message) {
    level = level.rjust(8);
    who = who.rjust(who, 10);
    if (LOG_TO_CONSOLE) {
        console.log(
            `${level} ${new Date().toISOString()} ${who} |> ${message}`,
        );
    }
    Flog(
        `${level} ${who} |> ${message}`,
        "log.log",
    );

}

module.exports = exports = {
    Logger:         Logger,
    LOG_TO_CONSOLE: LOG_TO_CONSOLE,

    log: log,
    info(who, message) {
        log(who, "INFO", message);
    },
    warning(who, message) {
        log(who, "WARNING", message);
    },

    fatal(who, message) {
        log(who, "FATAL", message);
    },
};
