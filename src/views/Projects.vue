<template>
    <article class="page-projects">
        <Modal v-model="isShowAddForm" title="创建项目" @on-ok="createProject">
            <Form>
                <FormItem label="标题">
                    <Input v-model="addForm.title" autofocus />
                </FormItem>
            </Form>
        </Modal>
        <section>
            <Button @click="isShowAddForm = true" type="primary">创建项目</Button>
        </section>
        <main>
            <Table :loading="isLoading" :columns="columns" :data="tableData">
                <template slot-scope="{ row }" slot="action">
                    <Button
                        type="primary"
                        size="small"
                        style="margin-right: 5px"
                        @click="
                            $router.push({
                                name: 'Project',
                                params: { id: 123123 },
                            })
                        "
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
export default {
    name: 'Projects',
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
            return { title: '' };
        },

        async remove(row) {
            const { _id } = row;
            await this.$http.delete('/project', { params: { id: _id } });
            await this.getList();
        },

        async getList() {
            this.isLoading = true;
            const data = await this.$http.get('/project');
            this.tableData = data;
            this.isLoading = false;
        },
        /**
         * 创建项目
         */
        async createProject() {
            const { title } = this.addForm;
            await this.$http.post('/project', { title });
            this.addForm = this.createFormData();
            await this.getList();
        },
    },
};
</script>
<style lang="scss" scoped>

</style>