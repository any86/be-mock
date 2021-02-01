export default [{
    name: "运维监控",
    children: [{
        name: "系统管理",
        children: [{
            name: '校区',
            children: [{
                name: "列表",
                request: {
                    method: "GET",
                    header: [{
                        key: "token",
                        type: "text",
                        value: "{{token}}"
                    }],
                    url: {
                        raw: "{{host}}/campus/list?page=1&pageSize=10",
                        host: ["{{host}}"],
                        path: ["termType", "findById"],
                        query: [{
                            key: "type_id",
                            value: "0bfc511116e7495bb393f902fdea01"
                        }]
                    }
                }
            }]
        }]
    }, {
        name: "监控中心",
        request: {
            name: "编辑按钮",
            request: {
                method: "GET",
                header: [{
                    key: "token",
                    type: "text",
                    value: "{{token}}"
                }],
                url: {
                    raw: "{{host}}/termType/findById?type_id=0bfc511116e7495bb393f902fdea01",
                    host: ["{{host}}"],
                    path: ["termType", "findById"],
                    query: [{
                        key: "type_id",
                        value: "0bfc511116e7495bb393f902fdea01"
                    }]
                }
            }
        }
    }]
}]