<template>
    <article class="page-project">
        <Modal v-model="isShowAddForm" title="新建接口文档" @on-ok="createDoc">
            <Form>
                <FormItem label="标题">
                    <Input
                        v-model="addForm.title"
                        placeholder="给接口起个名吧"
                    />
                </FormItem>
                <FormItem label="请求地址">
                    <Input
                        v-model="addForm.url"
                        placeholder="请求地址"
                    />
                </FormItem>
                <FormItem label="请求类型">
                    <Select v-model="addForm.method">
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </FormItem>

                <FormItem label="请求头">
                    <Input
                        v-model="addForm.JSONRawHeader"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入JSON数据"
                    />
                </FormItem>
                <FormItem label="请求参数">
                    <Input
                        v-model="addForm.JSONRawRequest"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入JSON数据"
                    />
                </FormItem>
                <FormItem label="返回值">
                    <Input
                        v-model="addForm.JSONRawResponse"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入JSON数据"
                    />
                </FormItem>
            </Form>
        </Modal>

        <h2>接口列表</h2>

        <Button class="mt-2" @click="isShowAddForm = true" type="primary"
            >新建接口文档</Button
        >
        <Table
            class="mt-2"
            border
            :loading="isLoading"
            :columns="columns"
            :data="tableData"
        >
            <template slot-scope="{ row }" slot="action">
                <Button
                    type="primary"
                    size="small"
                    style="margin-right: 5px"
                    @click="goToDocPage(row._id)"
                    >进入</Button
                >
                <Button type="error" size="small" @click="remove(row)"
                    >删除</Button
                >
            </template>
        </Table>
    </article>
</template>

<script>
import JSON5 from 'json5';
import genTree from '@/shared/genTree.js';

function createFormData() {
    return {
        title: '',
        method: 'GET',
        url: '',
        JSONRawHeader: '',
        JSONRawRequest: '',
        JSONRawResponse: '',
    };
}

export default {
    name: 'Project',
    data() {
        return {
            isLoading: true,
            isShowAddForm: false,
            tableData: [],
            addForm: createFormData(),
            columns: [
                {
                    title: '标题',
                    key: 'title',
                },
                {
                    title: '创建时间',
                    render(h, { row }) {
                        return h('Time', { props: { time: row.createAt } });
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                },
            ],
        };
    },

    computed: {
        projectId() {
            return this.$route.params.id;
        },
    },

    mounted() {
        this.getList();
    },

    methods: {
        async remove(row) {
            const { _id } = row;
            await this.$http.delete('/doc', { params: { id: _id } });
            await this.getList();
        },

        async getList() {
            this.isLoading = true;
            this.tableData = await this.$http.get('/doc', {
                params: {
                    projectId: this.projectId,
                },
            });
            this.isLoading = false;
        },
        /**
         * 创建项目
         */
        async createDoc() {
            const {
                title,
                url,
                method,
                JSONRawResponse,
                JSONRawHeader,
                JSONRawRequest,
            } = this.addForm;

            const { id } = await this.$http.post('/doc', {
                title,url,method,
                projectId: this.projectId,
                treeRequest: genTree(JSON5.parse(JSONRawRequest)),
                treeHeader: genTree(JSON5.parse(JSONRawHeader)),
                treeResponse: genTree(JSON5.parse(JSONRawResponse)),
            });
            this.goToDocPage(id);

            // this.addForm = this.createFormData();
        },

        goToDocPage(id) {
            this.$router.push({ name: 'Doc', params: { id } });
        },
    },
};
</script>
<style lang="scss" scoped>
.side {
    position: relative;
    z-index: 1;
    width: 200px;
    height: 100vh;
    box-shadow: 1px 0 8px rgba(0, 0, 0, 0.3);
}

.page-project {
    padding: 16px;
}
</style>