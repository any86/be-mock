<template>
    <article class="page-project">
        <Modal v-model="isShowAddForm" title="新建" @on-ok="createDoc">
            <Form>
                <FormItem label="标题">
                    <Input
                        v-model="addForm.title"
                        placeholder="给接口起个名吧"
                    />
                </FormItem>

                <FormItem label="JSON数据">
                    <Input
                        v-model="addForm.JSONRaw"
                        type="textarea"
                        :rows="10"
                        placeholder="请输入JSON数据"
                    />
                </FormItem>
            </Form>
        </Modal>
        <section>
            <Button @click="isShowAddForm = true" type="primary"
                >新建接口文档</Button
            >
        </section>
        <h1>接口列表</h1>
        <main>
            <Table :loading="isLoading" :columns="columns" :data="tableData">
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
        </main>
    </article>
</template>

<script>
import JSON5 from 'json5';
import genTree from '@/shared/genTree.js';
export default {
    name: 'Project',
    data() {
        return {
            isLoading: true,
            isShowAddForm: false,
            tableData: [],
            addForm: this.createFormData(),
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

    mounted() {
        this.getList();
    },

    methods: {
        createFormData() {
            return { title: '', JSONRaw: '' };
        },

        changeTextJSON(rawJSON) {
            this.$store.commit('changeRawJSON', rawJSON);
        },

        async remove(row) {
            const { _id } = row;
            await this.$http.delete('/doc', { params: { id: _id } });
            await this.getList();
        },

        async getList() {
            this.isLoading = true;
            const data = await this.$http.get('/doc');
            this.tableData = data;
            this.isLoading = false;
        },
        /**
         * 创建项目
         */
        async createDoc() {
            const { title, JSONRaw } = this.addForm;
            const tree = genTree(JSON5.parse(JSONRaw));
            const { id } = await this.$http.post('/doc', { title, tree });
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

.main {
}
</style>