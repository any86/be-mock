const form = {
    labelWidth: 100,
    items: [{
            label: '名称',
            name: 'name',
            tag: 'input',
            rules: [{
                required: true,
                message: '请输入项目名称',
                trigger: 'blur'
            }]
        },
        {
            label: '描述',
            name: 'desc',
            tag: 'input'
        }
    ]
};

const Config =  {
    add: form,
    edit: form,
    table: {
        primaryKey: 'ObjectId',
        size: "medium", // small / mini / - 
        // filter,
        api: '/Project',
        columns: [{
            key: 'name',
            title: '名称',
        }, {
            key: 'desc',
            title: '描述',
        }, {
            title: '操作',
            slot: 'action',
            width: 210,
            align: 'center'
        }]
    },
}

export default Object.freeze(Config);