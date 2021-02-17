const Base = require('./Base');
const Project = require('../model/Project');

module.exports = class extends Base {
    constructor() {
        super(Project);
    }

    delete(req, res) {
        const { id: _id } = req.params;
        this.model.deleteOne({ _id }, (error, { _id }) => {
            if (error) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }
}