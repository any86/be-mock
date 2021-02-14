<template>
    <article class="doc-detail">
        <Spin fix v-if="isLoading"></Spin>

        <Tabs v-if="!isLoading" :value="activeTab" @input="changeTab">
            <TabPane label="头信息" name="0">
                <TableEditor
                    :value="header"
                    @save="updateDoc('header', $event)"
                />
                <!-- <TreeDocAndPreview v-if="header && header.length > 0" :tree-data="header" @save="syncDb" /> -->
            </TabPane>
            <TabPane label="请求(Param)" name="1">
                <TableEditor
                    :value="requestParam"
                    @save="updateDoc('requestParam', $event)"
                />
            </TabPane>

            <TabPane label="请求(Body)" name="2">
                <TableEditor
                    :value="requestBody"
                    @save="updateDoc('requestBody', $event)"
                />
            </TabPane>

            <TabPane label="响应" name="3">
                <template v-if="response && response.length > 0">
                    <TreeDocAndPreview
                        :tree-data="response"
                        @save="updateDoc('response', response)"
                    />
                    <Button
                        class="mt-2"
                        type="primary"
                        @click="response = void 0"
                        >清空</Button
                    >
                </template>
                <p v-else>
                    <Input
                        v-model="JSONRawResponse"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入JSON数据"
                    />
                    <Button class="mt-2" type="primary" @click="genResponseTree"
                        >保存</Button
                    >
                </p>
            </TabPane>

            <TabPane :disabled="void 0 === response" label="假数据" name="4">
                <TreeMockAndPreview
                    v-if="'4' === activeTab"
                    :tree-data="response"
                    :tree-request="requestBody"
                />
            </TabPane>
        </Tabs>
    </article>
</template>

<script>
import JSON5 from 'json5';
import genTree from '@/shared/genTree.js';
import TreeDocAndPreview from './ApiDetail/TreeDocAndPreview';
import TreeMockAndPreview from './ApiDetail/TreeMockAndPreview';
import TableEditor from './ApiDetail/TableEditor';

export default {
    name: 'ApiDetail',

    props: { docId: { type: String } },

    components: {
        TreeDocAndPreview,
        TreeMockAndPreview,
        TableEditor,
    },

    data() {
        return {
            isLoading: true,
            header: [],
            requestBody: [],
            requestParam: [],
            response: [],
            url: '',
            httpMethod: '',
            JSONRawResponse: '',
        };
    },

    computed: {
        activeTab() {
            return this.$route.query.tab || '0';
        },
    },

    watch: {
        docId: {
            immediate: true,
            handler() {
                this.getDoc();
            },
        },
    },

    methods: {
        run() {
            const { httpMethod, url } = this;
            this.$http[httpMethod.toLocaleLowerCase()](url);
        },

        genResponseTree() {
            this.response = genTree(JSON5.parse(this.JSONRawResponse));
            this.updateDoc('response', this.response);
        },

        /**
         * 更新头/参数/响应数据
         */
        updateDoc(key, value) {
            this.$http.put('/doc/' + this.docId, {
                [key]: value,
            });
            this[key] = value;
        },

        changeTab(index) {
            if (this.$route.query.tab != index) {
                this.$router.replace({
                    query: { ...this.$route.query, tab: index },
                });
            }
        },

        async getDoc() {
            this.isLoading = true;
            const {
                header,
                requestParam,
                requestBody,
                response,
                url,
                method,
            } = await this.$http.get(`/doc/${this.docId}`);
            this.url = url;
            this.httpMethod = method;
            this.header = header;
            this.requestParam = requestParam;
            this.requestBody = requestBody;
            this.response = response;
            this.isLoading = false;
            this.$emit('active',{url,method})
        },
    },
};
</script>
<style lang="scss" scope>
.doc-detail {
    position: relative;
    min-width: 0;
}
</style>