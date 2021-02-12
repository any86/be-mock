<template>
    <article class="doc-detail">
        <Spin fix v-if="isLoading"></Spin>
        <div class="p-2 font-4">
            <b class="font-3 text-primary">{{ httpMethod }}</b> : {{ url }}
            <Button size="small" @click="$copy(url)"
                ><Icon type="md-copy" /> 复制</Button
            >
        </div>
        <Tabs v-if="!isLoading" :value="activeTab" @input="changeTab">
            <TabPane label="头信息" name="0">
                <TableEditor
                    :value="treeHeader"
                    @save="updateDoc('treeHeader', $event)"
                />
                <!-- <TreeDocAndPreview v-if="treeHeader && treeHeader.length > 0" :tree-data="treeHeader" @save="syncDb" /> -->
            </TabPane>
            <TabPane label="请求" name="1">
                <TableEditor
                    :value="treeRequest"
                    @save="updateDoc('treeRequest', $event)"
                />
            </TabPane>
            <TabPane label="响应" name="2">
                <template v-if="treeResponse && treeResponse.length > 0">
                    <TreeDocAndPreview
                        :tree-data="treeResponse"
                        @save="updateDoc('treeResponse', treeResponse)"
                    />
                    <Button
                        class="mt-2"
                        type="primary"
                        @click="treeResponse = void 0"
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

            <TabPane
                :disabled="void 0 === treeResponse"
                label="假数据"
                name="3"
            >
                <TreeMockAndPreview
                    v-if="'3' === activeTab"
                    :tree-data="treeResponse"
                    :tree-request="treeRequest"
                />
            </TabPane>
        </Tabs>
    </article>
</template>

<script>
import JSON5 from 'json5';
import genTree from '@/shared/genTree.js';
import TreeDocAndPreview from './Doc/TreeDocAndPreview';
import TreeMockAndPreview from './Doc/TreeMockAndPreview';
import TableEditor from './Doc/TableEditor';

export default {
    name: 'Doc',

    props: { docId: { type: String, required: true } },

    components: { TreeDocAndPreview, TreeMockAndPreview, TableEditor },

    data() {
        return {
            isLoading: true,
            treeHeader: [],
            treeRequest: [],
            treeResponse: [],
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
        genResponseTree() {
            this.treeResponse = genTree(JSON5.parse(this.JSONRawResponse));
            this.updateDoc('treeResponse', this.treeResponse);
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
                treeHeader,
                treeRequest,
                treeResponse,
                url,
                method,
            } = await this.$http.get(`/doc/${this.docId}`);
            this.url = url;
            this.httpMethod = method;
            this.treeHeader = treeHeader;
            this.treeRequest = treeRequest;
            this.treeResponse = treeResponse;
            this.isLoading = false;
        },
    },
};
</script>
<style lang="scss" scope>
.doc-detail {
    position: relative;
    min-width: 0;
    padding: 8px;
}
</style>