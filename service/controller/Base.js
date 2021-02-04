export default class {

    constructor(model) {
        this.model = model;
    }

    get(req, res) {
        const { id: _id } = req.query;
        if (_id) {
            this.model.findOne({ _id }, (err, document) => {
                if (err) {
                    res.send(error);
                } else {
                    res.send(document);
                }

            });
        } else {
            this.model.find((err, document) => {
                if (err) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            });
        }
    }

    create(req, res) {
        this.model.create({ ...req.body, createAt: Date.now() }, (err, { _id }) => {
            if (err) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }

    update(req, res) {
        const { id: _id } = req.query;
        const { _id } = this.model.updateOne({ _id }, { ...req.body, updateAt: Date.now() }, (err, { _id }) => {
            if (err) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }

    remove(req, res) {
        const { id: _id } = req.query;
        await this.model.remove({ _id }, (err, { _id }) => {
            if (err) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }
}