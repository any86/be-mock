<template>
    <article class="api-runner">
        <i-input v-model="activeDoc.url">
            <Select
                slot="prepend"
                :value="activeDoc.method"
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
        activeDoc: {
            type: Object,
            required: true,
        },
    },

    components: {},

    data() {
        return { METHOD_LIST };
    },

    methods: {
        run() {
            const { method, url, requestParams, requestBody } = this.activeDoc;
            const params = [];
            const data = {};

            if (void 0 !== requestParams) {
                requestParams.forEach(({ key, value }) => {
                    if ('' !== key) {
                        params.push(`${key}=${value}`);
                    }
                });
            }

            if (void 0 !== requestBody) {
                requestBody.forEach(({ key, value }) => {
                    if ('' !== key) {
                        data[key] = value;
                    }
                });
            }

            this.$http({
                url: url + `?${params.join('&')}`,
                method: method.toLocaleLowerCase(),
                data,
            });
        },

        save() {},
    },
};
</script>
<style lang="scss" scope>
.api-runner {
    display: flex;
}
</style>