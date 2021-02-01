<template>
    <article>
        <el-input type="textarea" placeholder="请输入内容" v-model="rawParams" />

        <el-alert title="JSON格式错误" type="error" class="mt-1"></el-alert>

        <DataTree :data="paramJSON"></DataTree>
    </article>
</template>

<script>
import { API_METHODS, VAR_TYPE_LIST } from '@/const';
import DataTree from './DataTree';
const parseJson = require('parse-json');

export default {
    name: 'ApiParams',

    components: { DataTree },

    data() {
        return {
            rawParams: '',
            VAR_TYPE_LIST,
            params: [],
            tableData: [],
            data: {
                code: 1,
                data: [
                    { term_id: 1, term_name: '计算机A' },
                    { term_id: 2, term_name: '计算机B' }
                ]
            }
        };
    },

    computed: {
        paramJSON() {
            try {
                if ('' !== this.rawParams.trim()) {
                    console.log(parseJson(this.rawParams));
                    return parseJson(this.rawParams);
                }
            } catch (error) {
                console.log(error);
                return this.rawParams;
            }
        }
    },

    created() {
        this.appendRow();
    },

    methods: {
        onFocus(index) {
            if (index === this.tableData.length - 1) {
                this.appendRow();
            }
        },

        appendRow() {
            return this.tableData.push({
                key: '',
                text: '',
                type: '',
                value: '',
                desc: ''
                // children
            });
        }
    }
};
</script>

<style lang="scss">
// .el-table__row:last-child{opacity: 0.4;}
</style>