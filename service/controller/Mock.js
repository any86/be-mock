const Base = require('./Base');
const Mock = require('../model/Mock');

function isMathObject(obj1 = {}, obj2) {
    for (const key in obj1) {
        if (obj1[key] != obj2[key] && '' !== obj1[key]) {
            return false;
        }
    }

    for (const key in obj2) {
        if (obj2[key] != obj1[key] && '' !== obj2[key]) {
            return false;
        }
    }
    return true;
}

module.exports = class extends Base {
    constructor() {
        super(Mock);
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
                    let activeRow;
                    let isMatch = false;
                    // 检查http-params
                    for (const row of document) {
                        isMatch = isMathObject(row.params, req.query);
                        console.log(isMatch, 1, row.params, req.query);

                        // params 匹配
                        // 开始测试body是否匹配
                        if (isMatch) {
                            isMatch = isMathObject(row.body, req.body);
                            if (isMatch) {
                                activeRow = row;
                                break;
                            }
                        }
                    }
                    console.log(isMatch, 2);
                    if (isMatch) {
                        res.status(activeRow.httpCode).json(activeRow.mock);
                    } else {
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