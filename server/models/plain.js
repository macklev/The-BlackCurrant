function toPlain(value) {
    return value ? JSON.parse(JSON.stringify(value)) : null;
}

module.exports = { toPlain };
