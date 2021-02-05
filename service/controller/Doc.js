const Base = require('./Base');
const Doc = require('../model/Doc');

module.exports = class extends Base {
    constructor() {
        super(Doc);
    }
}