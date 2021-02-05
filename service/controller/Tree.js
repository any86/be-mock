const Base = require('./Base');
const Tree = require('../model/Tree');

module.exports = class extends Base{
    constructor(){
        super(Tree);
    }
}