<template>
    <article class="api-runner">
        <i-input v-model="url">
            <Select
                slot="prepend"
                :value="method"
                @on-change="$emit('update:method', $event)"
                style="width: 80px"
            >
                <Option
                    v-for="method in METHOD_LIST"
                    :key="method"
                    :value="method"
                    >{{ method }}</Option
                >
            </Select>
        </i-input>

        <Button class="ml-1" type="primary" @click="run"
            ><Icon type="ios-send" /> 运行</Button
        >
        <Button class="ml-1" type="success" @click="save"
            ><Icon type="md-cloud-upload" /> 保存</Button
        >
    </article>
</template>

<script>
import { METHOD_LIST } from '@/const';
export default {
    name: 'ApiRunner',

    props: {
        url: {
            type: String,
            required: true,
        },

        method: {
            type: String,
            required: true,
        },
    },

    components: {},

    data() {
        return { METHOD_LIST };
    },

    methods:{
        run(){
            this.$http[this.method.toLocaleLowerCase()](this.url);
        },

        save(){},
    }
};
</script>
<style lang="scss" scope>
.api-runner {
    display: flex;
}
</style>