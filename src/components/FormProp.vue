<template>
    <Form :model="formData" :label-width="110" class="form-prop">
        <FormItem
            v-if="
                void 0 !== formData.propName && void 0 !== formData.parentType
            "
            prop="propName"
            label="字段名称"
        >
            <Input
                v-model="formData.propName"
                placeholder="请输入字段名称"
                clearable
            />
        </FormItem>

        <FormItem prop="type" label="数据类型">
            <Select v-model="formData.type" @on-change="onChangeVarType">
                <Option
                    v-for="name in VAR_TYPE_LIST"
                    :key="name"
                    :label="name"
                    :value="name"
                ></Option>
            </Select>
        </FormItem>

        <FormItem prop="text" label="简述">
            <Input v-model="formData.text" placeholder="原型文档上的文案" clearable />
        </FormItem>

        <!-- 假数据设置 -->
        <section
            v-if="
                [VAR_TYPE.String, VAR_TYPE.Number].includes(formData.type) ||
                VAR_TYPE.Array === formData.parentType
            "
        >
            <Divider>假数据设置</Divider>

            <FormItem
                v-if="VAR_TYPE.String === formData.type"
                prop="mockTimes"
                label="字符模型"
            >
                <Select
                    v-model="formData.mock.type"
                    @on-change="onChangeMockType"
                >
                    <Option
                        v-for="name in MOCK_TYPES"
                        :key="name"
                        :label="MOCK_TYPE[name]"
                        :value="name"
                    ></Option>
                </Select>
            </FormItem>

            <FormItem
                v-if="
                    VAR_TYPE.String === formData.type &&
                    'Pool' === formData.mock.type
                "
                prop="mockTimes"
                label="字符集合"
            >
                <Input
                    v-model="formData.mock.pool"
                    type="textarea"
                    placeholder="多个字符请用','分割,如: '香蕉, 苹果'"
                />
            </FormItem>

            <FormItem
                v-if="
                    VAR_TYPE.String === formData.type &&
                    ['Letter', 'Other'].includes(formData.mock.type)
                "
                prop="mockTimes"
                label="字符最小长度"
            >
                <InputNumber v-model="formData.mock.min" :min="1" />
            </FormItem>

            <FormItem
                v-if="
                    VAR_TYPE.String === formData.type &&
                    ['Letter', 'Other'].includes(formData.mock.type)
                "
                prop="mockTimes"
                label="字符最大长度"
            >
                <InputNumber v-model="formData.mock.max" :min="1" />
            </FormItem>

            <!-- 仅数字类型显示 -->
            <FormItem
                v-if="
                    VAR_TYPE.Number === formData.type ||
                    'Number' == formData.mock.type
                "
                prop="mockTimes"
                label="最小值"
            >
                <InputNumber v-model="formData.mock.min" :min="1" />
            </FormItem>

            <FormItem
                v-if="
                    VAR_TYPE.Number === formData.type ||
                    'Number' == formData.mock.type
                "
                prop="mockTimes"
                label="最大值"
            >
                <InputNumber v-model="formData.mock.max" :min="1" />
            </FormItem>
            <!-- 仅数字类型显示 -->

            <FormItem
                v-if="VAR_TYPE.Array === formData.parentType"
                prop="mockTimes"
                label="循环次数"
            >
                <InputNumber v-model="formData.mock.times" :min="1" />
            </FormItem>
        </section>
        <footer>
            <Button @click="$emit('close')">取消</Button>
            <Button class="ml-1" @click="save" type="primary">确定</Button>
        </footer>
    </Form>
</template>

<script>
import { VAR_TYPE, VAR_TYPE_LIST } from '@/const';
import { MOCK_TYPES, MOCK_TYPE, createMockConfig } from '@/shared/mock.js';
export default {
    name: 'FormProp',

    props: {
        value: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            VAR_TYPE,
            VAR_TYPE_LIST,
            MOCK_TYPES,
            MOCK_TYPE,
            formData: {},
        };
    },

    watch: {
        value: {
            immediate: true,
            handler(value) {
                this.formData = value;
            },
        },
    },

    methods: {
        /**
         * 改变数据类型,
         * 重置mock设置
         */
        onChangeVarType() {
            this.$set(this.formData, 'mock', createMockConfig());
        },

        onChangeMockType(type) {
            this.$set(this.formData, 'mock', createMockConfig(type));
        },

        save() {
            this.$emit('input', this.formData);
            this.$emit('close');
        },
    },
};
</script>
<style lang="scss" scope>
.form-prop {
    padding: 8px;
    > footer {
        display: flex;
        justify-content: flex-end;
    }
}
</style>