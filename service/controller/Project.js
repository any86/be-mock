import ProjectModel from '../model/Project';
export default {
    get(req, res) {
        const { id: _id } = req.query;
        if (_id) {
            ProjectModel.findOne({ _id }, (err, document) => {
                if (err) {
                    res.send(error);
                } else {
                    res.send(document);
                }

            });
        } else {
            ProjectModel.find((err, document) => {
                if (err) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            });
        }
    },

    create(req, res) {
        ProjectModel.create({ ...req.body, createAt: Date.now() }, (err, { _id }) => {
            if (err) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    },

    update(req, res) {
        const { id: _id } = req.query;
        const { _id } = ProjectModel.updateOne({ _id }, { ...req.body, updateAt: Date.now() }, (err, { _id }) => {
            if (err) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    },

    remove(req, res) {
        const { id: _id } = req.query;
        await ProjectModel.remove({ _id }, (err, { _id }) => {
            if (err) {
                res.send(error);
            } else {
                res.json({ id: _id });
            }
        });
    }
}