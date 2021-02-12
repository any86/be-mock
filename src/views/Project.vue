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
                    <Input v-model="addForm.url" placeholder="请求地址" />
                </FormItem>
                <FormItem label="请求类型">
                    <Select v-model="addForm.method">
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>

        <section class="d-flex mt-2">
            <ul class="docs">
                <li>
                    <Button @click="isShowAddForm = true" type="primary"
                        >新建</Button
                    >
                </li>
                <li
                    v-for="{ title, _id } in tableData"
                    :key="_id"
                    :class="{ active: docId === _id }"
                    @click="openDoc(_id)"
                >
                    {{ title }}
                </li>
            </ul>

            <Doc class="flex-1" :doc-id="docId" />
        </section>
    </article>
</template>

<script>
import Doc from './Doc';

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

    components: { Doc },

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
                    title: '地址',
                    key: 'url',
                },
                {
                    title: '请求方式',
                    key: 'method',
                },
                {
                    title: '最近修改',
                    render(h, { row }) {
                        return h('Time', { props: { time: row.updateAt } });
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

        docId() {
            return this.$route.query.docId;
        },
    },

    mounted() {
        this.getList();
    },

    methods: {
        openDoc(docId) {
            const { query } = this.$route;
            if (docId !== query.docId) {
                this.$router.push({ query: { ...query, docId } });
            }
        },

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
            const { title, url, method } = this.addForm;

            const { id } = await this.$http.post('/doc', {
                title,
                url,
                method,
                projectId: this.projectId,
            });
            this.goToDocPage(id);
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
    padding: 8px;
    ul.docs {
        border-right: 1px solid #eee;
        li {
            list-style: none;
            padding: 8px;
            cursor: pointer;
            &.active {
                color: #69f;
            }
        }
    }
}
</style>