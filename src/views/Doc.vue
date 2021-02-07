<template>
    <article class="page-doc p-2">
        <Spin fix v-if="isLoading"></Spin>
        <Tabs v-if="!isLoading" v-model="activeTab">
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
                <TreeMockAndPreview :tree-data="treeResponse" />
            </TabPane>
        </Tabs>
    </article>
</template>

<script>
import TreeDocAndPreview from './Doc/TreeDocAndPreview';
import TreeMockAndPreview from './Doc/TreeMockAndPreview';

export default {
    name: 'Doc',

    components: { TreeDocAndPreview,TreeMockAndPreview },

    data() {
        return {
            isLoading: true,
            activeTab: '0',
            treeHeader: [],
            treeRequest: [],
            treeResponse: [],
        };
    },

    computed: {
        id() {
            return this.$route.params.id;
        },
    },

    async mounted() {
        await this.getDoc();
    },

    methods: {
        async getDoc() {
            this.isLoading = true;
            const {
                treeHeader,
                treeRequest,
                treeResponse,
            } = await this.$http.get('/doc', {
                params: { id: this.id },
            });

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
.page-mock {
    .textarea-json {
        margin: 5vw auto;
        width: 90vw;
    }
}
</style>