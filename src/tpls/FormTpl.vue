<template>
    <el-form
        :label-width="labelWidth"
        :label-position="labelPosition"
        :model="formData"
        :rules="rules"
    >
        <el-form-item
            v-for="(item,index) in items"
            :key="index"
            :label="item.label"
            :prop="item.name"
        >
            <component v-model="formData[item.name]" :is="`el-${item.tag}`"></component>
        </el-form-item>

        <el-form-item>
            <el-button @click="save" type="primary">确定</el-button>
            <el-button @click="cancel" class="ml-1">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'FormTpl',

    props: {
        labelWidth: {
            type: String,
            default: `60px`
        },

        labelPosition: {
            type: String,
            default: 'right'
        },

        // 结构数据
        config: {
            type: Object,
            require: true
        }
    },

    data() {
        return {
            formData: {}
        };
    },

    computed: {
        rules() {
            return {};
        },

        items() {
            return this.config.items;
        }
    },

    created() {
        this.items.forEach(({ name, defaultValue }) => {
            this.$set(this.formData, name, defaultValue);
        });
    },

    methods: {
        save() {
            this.$emit('save', this.formData);
        },

        cancel() {
            this.$emit('cancel', this.formData);
        }
    }
};
</script>

<style lang="scss">
</style>