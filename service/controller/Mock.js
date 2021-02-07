const Base = require('./Base');
const Mock = require('../model/Mock');

module.exports = class extends Base{
    constructor(){
        super(Mock);
    }
}