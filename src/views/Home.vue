<template>
    <article class="page-home">
        <!-- {{$store.state.rawJSON}} -->
        <section class="textarea-json">
            <Input
                :value="JSONRaw"
                @input="changeTextJSON"
                type="textarea"
                :rows="10"
                placeholder="请输入JSON数据"
            />

            <div class="d-flex mt-2">
                <Button size="large" @click="empty"
                    >清空
                </Button>

                <Button class="ml-2" type="success" size="large" @click="loadExampleData"
                    >加载演示数据
                </Button>

                <Button class="ml-2" type="primary" size="large" @click="next"
                    >确定
                </Button>
            </div>
            <Alert
                v-show="null !== JSONError"
                class="mt-2"
                type="error"
                show-icon
            >
                JSON格式错误,请检查.
                <span slot="desc">
                    {{ JSONError }}
                </span>
            </Alert>
        </section>
    </article>
</template>

<script>
import JSON5 from 'json5';
import exampleData from '@/const/exampleData.json';
export default {
    name: 'Home',

    data() {
        return {
            JSONError: null,
        };
    },

    computed: {
        JSONRaw() {
            return this.$store.state.rawJSON;
        },
    },

    methods: {
        empty(){
            this.$store.commit('changeRawJSON', '');
        },
        changeTextJSON(rawJSON) {
            this.$store.commit('changeRawJSON', rawJSON);
        },

        loadExampleData(){
            this.$store.commit('changeRawJSON', JSON.stringify(exampleData,null,4));
            // console.log(exampleData);
        },

        /**
         * 生成JSON对象
         */
        next() {
            if ('' === this.$store.state.rawJSON.trim()) return;
            try {
                const JSON = JSON5.parse(this.$store.state.rawJSON);
                this.$store.commit('changeJSON', JSON);
                this.JSONError = null;
                this.$router.push({ path: '/mock' });
            } catch (error) {
                this.JSONError = error;
            }
        },
    },
};
</script>
<style lang="scss" >
.page-home {
    padding: 16px;
}
</style>