<template>
    <article class="page-doc p-2">
        <Spin fix v-if="isLoading"></Spin>
        <p>{{httpMethod}} - {{ url }}</p>
        <Tabs v-if="!isLoading" :value="activeTab" @input="changeTab">
            <TabPane label="头信息" name="0">
                <TreeDocAndPreview :tree-data="treeHeader" @save="syncDb" />
            </TabPane>
            <TabPane label="请求" name="1">
                <TreeDocAndPreview :tree-data="treeRequest" @save="syncDb" />
            </TabPane>
            <TabPane label="响应" name="2">
                <TreeDocAndPreview :tree-data="treeResponse" @save="syncDb" />
            </TabPane>

            <TabPane label="假数据" name="3">
                <TreeMockAndPreview
                    ref="mock"
                    :tree-data="treeResponse"
                    :request-params="requestParams"
                />
            </TabPane>
        </Tabs>
    </article>
</template>

<script>
import TreeDocAndPreview from './Doc/TreeDocAndPreview';
import TreeMockAndPreview from './Doc/TreeMockAndPreview';

export default {
    name: 'Doc',

    components: { TreeDocAndPreview, TreeMockAndPreview },

    data() {
        return {
            isLoading: true,
            activeTab: this.$route.query.tab || '0',
            treeHeader: [],
            treeRequest: [],
            treeResponse: [],
            url: '',
            httpMethod: '',
        };
    },

    computed: {
        id() {
            return this.$route.params.id;
        },

        requestParams() {
            const result = [];
            for (const { propName, type } of this.treeRequest[0].children) {
                result.push({ propName, type });
            }
            return result;
        },
    },

    async mounted() {
        await this.getDoc();
    },

    methods: {
        changeTab(index) {
            if (this.$route.query.tab != index) {
                if (index === '3') {
                    this.$refs.mock.refreshMock();
                }
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
            } = await this.$http.get(`/doc/${this.id}`);
            this.url = url;
            this.httpMethod = method;
            this.treeHeader = treeHeader;
            this.treeRequest = treeRequest;
            this.treeResponse = treeResponse;
            this.isLoading = false;
        },

        syncDb() {
            const { id, treeHeader, treeRequest, treeResponse } = this;
            this.$http.put('/doc', {
                id,
                treeHeader,
                treeRequest,
                treeResponse,
            });
        },
    },
};
</script>
<style lang="scss" scope>
</style>