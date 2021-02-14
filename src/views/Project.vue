<template>
    <article class="page-project">
        <Button
            v-if="void 0 === docId"
            @click="isShowAddForm = true"
            type="primary"
            ><Icon type="md-add" /> 新建文档</Button
        >
        <section v-else class="d-flex mt-2">
            <!-- 接口目录 -->
            <ApiList
                :list="apiList"
                :doc-id="docId"
                @change="getList"
                @after-update="setActiveDoc"
            />

            <div class="flex-1 ml-2">
                <ApiRunner :active-doc="activeDoc"/>
                <ApiDetail class="mt-2" :doc-id="docId" @active="setActiveDoc" />
            </div>
        </section>
    </article>
</template>

<script>
import ApiDetail from './Project/ApiDetail';
import ApiList from './Project/ApiList';
import ApiRunner from './Project/ApiRunner';

export default {
    name: 'Project',

    components: { ApiDetail, ApiList, ApiRunner },

    data() {
        return {
            isLoading: true,
            apiList: [],
            activeDoc:{},
        };
    },

    computed: {
        projectId() {
            return this.$route.params.id;
        },

        docId() {
            return this.$route.query.docId || this.apiList[0]?._id;
        },
    },

    mounted() {
        this.getList();
    },

    methods: {
        setActiveDoc(activeDoc) {
            this.$set(this,'activeDoc',activeDoc);
        },

        async getList() {
            this.isLoading = true;
            this.apiList = await this.$http.get('/doc', {
                params: {
                    projectId: this.projectId,
                },
            });
            this.isLoading = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.side {
    position: relative;
    z-index: 1;
    width: 200px;
    height: 100vh;
    box-shadow: 1px 0 8px rgba(0, 0, 0, 0.3);
}

.page-project {
    padding: 8px;
}
</style>