<template>
    <section class="table-editor">
        <Table class="mt-2" :data="tableData" :columns="columns" border>
            <template
                v-for="{ slot,title } in inputsConfig"
                slot-scope="{ index }"
                :slot="slot"
            >
                <Input
                    :key="slot"
                    v-model="tableData[index][slot]"
                    :placeholder="`请输入${title}`"
                    @on-keyup="addRow(index)"
                />
            </template>

            <template slot-scope="{ index }" slot="action">
                <Button v-if="index < tableData.length-1" type="error" @click="removeRow(index)">删除</Button>
            </template>
        </Table>
        <p align="right">
            <Button tton class="mt-2" size="large" type="primary" @click="save"
                >保存</Button
            >
        </p>
    </section>
</template>

<script>
function createRow() {
    return { key: '', value: '', desc: '' };
}

const inputsConfig = [
    { title: '名称', slot: 'key' },
    // { title: '值', slot: 'value' },
    { title: '描述', slot: 'desc' },
];
export default {
    name: 'TableEditor',

    props: {
        value: {
            required: true,
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            inputsConfig,
            columns: [
                ...inputsConfig,
                { title: '操作', slot: 'action', width: 120 },
            ],
            tableData: [],
        };
    },

    computed: {},

    // watch: {
    //     tableData: {
    //         deep: true,
    //         handler(tableData) {
    //             this.$emit('input', tableData);
    //         },
    //     },
    // },

    mounted() {
        this.tableData = 0 < this.value.length ? this.value : [createRow()];
    },

    methods: {
        save() {
            // const tableDataPure = this.tableData.filter((row) => {
            //     return inputsConfig.some(({ slot }) => {
            //         return '' !== row[slot].trim();
            //     });
            // });

            this.$emit('save', this.tableData);

        },

        removeRow(index) {
            this.tableData.splice(index, 1);
        },

        addRow(index) {
            if (
                this.hasContentInRow(index) &&
                this.tableData.length - 1 == index
            ) {
                this.tableData.push(createRow());
            }
        },

        hasContentInRow(index) {
            const row = this.tableData[index];
            for (const key in row) {
                const value = row[key];
                if ('' !== value.trim()) {
                    return true;
                }
            }
            return false;
        },
    },
};
</script>
<style lang="scss" scope>
.table-editor {
}
</style>