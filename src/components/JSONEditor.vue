<template>
    <div class="flex-1">
        <i-input
            style="width: 100%"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 16 }"
            placeholder="请输入JSON数据"
            v-model="content"
        >
        </i-input>
        <i-button type="primary" class="mt-1" @click="done">确定</i-button>
    </div>
</template>

<script>
const parseJson = require('parse-json');
export default {
    name: 'JSONEditor',

    props: ['value'],

    data() {
        return { content: '' };
    },

    computed: {
        JSON() {
            try {
                if ('' !== this.content.trim()) {
                    return parseJson(this.content);
                }
            } catch (error) {
                alert(error);
                return false;
            }
        },
    },

    mounted() {
        this.content = this.value;
    },

    methods: {
        done() {
            this.$emit('change', this.JSON);
        },
    },
};
</script>

<style lang="scss">
// .el-table__row:last-child{opacity: 0.4;}
</style>