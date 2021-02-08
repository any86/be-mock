const Base = require('./Base');
const Doc = require('../model/Doc');

module.exports = class extends Base {
    constructor() {
        super(Doc);
    }

    get(req, res) {
        const { id: _id } = req.params;
        if (_id) {
            this.model.findOne({ _id }, (error, document) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            });
        } else {
            const { projectId } = req.query;
            this.model.find({ projectId }).sort({ createAt: -1 }).exec((error, document) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            });
        }

    }
}