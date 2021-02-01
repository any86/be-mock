<template>
    <article class="page-home d-flex">
        <Modal v-model="isShowAddForm" title="新建" @on-ok="createProject">
            <Form>
                <FormItem label="标题">
                    <Input v-model="addForm.title" />
                </FormItem>
            </Form>
        </Modal>
        <header>
            <Button @click="isShowAddForm = true">新建</Button>
        </header>

        <main class="flex-1 main p-2">
            <Table :columns="columns" :data="tableData"></Table>
        </main>
    </article>
</template>

<script>
import AV from '../AV';
const project = AV.Object('Project');
export default {
    name: 'Project',
    data() {
        return {
            isShowAddForm: true,
            tableData: [],
            addForm: { title: '' },
            columns: [
                {
                    title: '标题',
                    key: 'title',
                },
            ],
        };
    },

    mounted() {
        this.getList();
    },

    methods: {
        getList() {
            const query = new AV.Query('Project');
            query.find().then((data) => {
                this.tableData = data.map((d) => d.toJSON());
            });
        },
        /**
         * 创建项目
         */
        createProject() {
            project.set('title', this.addForm.title);
            project.save().then(
                (todo) => {
                    this.getList();
                },
                (error) => {}
            );
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