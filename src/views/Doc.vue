<template>
    <article class="page-doc p-2">
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
                    @save="updateDoc('treeHeader',$event)"
                />
                <!-- <TreeDocAndPreview v-if="treeHeader && treeHeader.length > 0" :tree-data="treeHeader" @save="syncDb" /> -->
            </TabPane>
            <TabPane label="请求" name="1">
                <TableEditor
                    :value="treeRequest"
                    @save="updateDoc('treeRequest',$event)"
                />
            </TabPane>
            <TabPane label="响应" name="2">
                <TreeDocAndPreview
                    v-if="treeResponse && treeResponse.length > 0"
                    :tree-data="treeResponse"
                    @save="syncDb"
                />
                <p v-else>
                    <Button>创建数据</Button>
                </p>
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
import TableEditor from './Doc/TableEditor';

export default {
    name: 'Doc',

    components: { TreeDocAndPreview, TreeMockAndPreview, TableEditor },

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
            if (void 0 === this.treeRequest) return;
            const result = [];
            for (const { key, value } of this.treeRequest) {
                result.push({ key, value });
            }
            return result;
        },
    },

    async mounted() {
        await this.getDoc();
    },

    methods: {
        updateDoc(key, value) {
            console.log(key,value);
            this.$http.put('/doc/' + this.id, {
                [key]: value,
            });
        },
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