const Base = require('./Base');
const Project = require('../model/Project');

module.exports = class extends Base {
    constructor() {
        super(Project);
    }
}