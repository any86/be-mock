<template>
    <section>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="desc" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small">编辑</el-button>

                    <el-button @click="view(scope.row)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            class="mt-2"
            :current-page.sync="page"
            @size-change="onPageSizeChange"
            @current-change="onPageChange"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="tableDataCount"
        ></el-pagination>
    </section>
</template>

<script>
import { PAGE_SIZE, getList } from '@/api';
export default {
    name: 'FormTpl',

    props: {
        // 结构数据
        config: {
            type: Object,
            require: true
        }
    },

    data() {
        return {
            page: 1,
            isLoading: false,
            tableData: [],
            tableDataCount: 0,
            pageSize: PAGE_SIZE
        };
    },

    mounted() {
        this.getTableData();
    },

    methods: {
        async getTableData() {
            this.isLoading = true;
            const { results, count } = await getList(
                this.config.api,
                this.page,
                this.pageSize
            );
            this.tableData = results;
            this.tableDataCount = count;
            this.isLoading = false;
        },

        view() {},

        onPageSizeChange() {},

        onPageChange() {
            this.getTableData();
        }
    }
};
</script>

<style lang="scss">
</style>