module.exports = class {

    constructor(model={}) {
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
            this.model.find((error, document) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            }).sort({_id:1});
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
        const { id } = req.body;
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
         this.model.remove({ _id }, (error, { _id }) => {
            if (error) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }
}