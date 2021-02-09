module.exports = class {

    constructor(model = {}) {
        this.model = model;
    }

    get(req, res) {
        const { id: _id } = req.query;
        if (_id) {
            this.model.findOne({ _id }, (error, document) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            });
        } else {
            this.model.find().sort({ createAt: -1 }).exec((error, document) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            });
        }
    }

    post(req, res) {
        this.model.create({ ...req.body, createAt: Date.now() }, (error, { _id }) => {
            if (error) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }

    put(req, res) {
        const { id } = req.params;
        this.model.updateOne({ _id: id }, { ...req.body, updateAt: Date.now() }, (error, { _id }) => {
            if (error) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }

    delete(req, res) {
        const { id: _id } = req.query;
        this.model.deleteOne({ _id }, (error, { _id }) => {
            if (error) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }
}