<template>
    <article class="page-home d-flex">
        <header class="header d-flex align-items-center">
            <el-button icon="el-icon-check" type="primary" @click="isShowAdd=true">新建项目</el-button>
        </header>

        <el-dialog title="新建项目" :visible.sync="isShowAdd">
            <form-tpl :config="Config.add" @save="add"></form-tpl>
        </el-dialog>

        <table-tpl class="flex-1 main p-2" :config="Config.table"></table-tpl>
    </article>
</template>

<script>
import FormTpl from '@/tpls/FormTpl';
import TableTpl from '@/tpls/TableTpl';
import { addProject, getProjects, PAGE_SIZE } from '@/api';
import Config from './Project.config';
export default {
    name: 'Home',

    components: { FormTpl,TableTpl },

    data() {
        return {
            Config,
            isShowAdd: false,
        };
    },

    mounted() {
    },

    methods: {

        async add(formData) {
            await addProject(formData);
            this.isShowAdd = false;
            this.getProjects();
        },

        view() {},

        onPageSizeChange() {},

        onPageChange() {
            this.getProjects();
        }
    }
};
</script>
<style lang="scss" scoped>
.header {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 60px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

.main {
    aside {
        min-width: 240px;
    }
    margin-top: 60px;
}
</style>