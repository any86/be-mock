const Base = require('./Base');
const Mock = require('../model/Mock');

module.exports = class extends Base {
    constructor() {
        super(Mock);
    }

    /**
     * 根据参数和id返回mock数据
     */
    get(req, res) {
        // 投params上有id就是查询列表
        // id是docId
        if (req.params.id) {
            this.model.find({ docId: req.params.id }, (error, document) => {
                if (error) {
                    res.send(error);
                } else {
                    let isMatch = true;
                    for (const row of document) {
                        isMatch = true;
                        for (const key in req.query) {
                            if (row.params[key] != req.query[key]) {
                                isMatch = false;
                                break;
                            }
                        }
                        if (isMatch) {
                            res.json(row.mock);
                            break;
                        }
                    }
                    if(!isMatch){
                        res.status(404).send('<h1>接口不存在,请检查参数</h1>');
                    }
                }
            });
        } else {
            this.model.find({ docId: req.query.docId }).sort({ createAt: -1 }).exec((error, document) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(document);
                }
            });
        }
    }
}