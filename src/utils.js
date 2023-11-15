//overrides
String.prototype.rjust = function (width, padding) {
    padding = padding || " ";
    padding = padding[0];
    if (this.length < width)
        return this + padding.repeat(width - this.length);
    else
        return this.toString();
};

module.exports = exports = {
    raise(err) {
        throw err;
    },

    raise_if(err) {
        if (err) throw err;
    },
};
