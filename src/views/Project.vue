<template>
    <article class="page-project">
        <Drawer v-model="isShowProjectEditForm">
            <Form>
                <FormItem label="项目名">
                    <Input v-model="projectTitle" />
                </FormItem>
            </Form>
            <Button type="primary" long @click="saveProject">保存</Button>
            <Button class="mt-2" type="error" long @click="removeProject"
                >删除</Button
            >
        </Drawer>
        <h2 class="mt-1 ml-1">
            {{ projectTitle }}
            <Button
                class="ml-1"
                shape="circle"
                @click="isShowProjectEditForm = true"
                type="primary"
                ghost
                ><Icon type="md-cog" />设置</Button
            >
        </h2>

        <Button
            v-if="void 0 === docId"
            @click="isShowAddForm = true"
            type="primary"
            ><Icon type="md-add" />新建文档</Button
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
                <ApiRunner :active-doc="activeDoc"> </ApiRunner>
                <ApiDetail
                    class="mt-2"
                    :doc-id="docId"
                    @active="setActiveDoc"
                />
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
            isShowProjectEditForm: false,
            apiList: [],
            activeDoc: {},
        };
    },

    computed: {
        projectTitle: {
            set(title) {
                this.$store.commit('setActiveProject', {
                    ...this.$store.state.activeProject,
                    title,
                });
            },

            get() {
                return this.$store.state.activeProject.title;
            },
        },
        projectId() {
            return this.$route.params.id;
        },

        docId() {
            return this.$route.query.docId || this.apiList[0]?._id;
        },
    },

    mounted() {
        this.getList();
        if (void 0 === this.projectTitle) {
            this.getProject();
        }
    },

    methods: {
        async removeProject() {
            await this.$http.delete(`/project/${this.projectId}`);
            this.$router.push({path:'/'})
        },

        async getProject() {
            const data = await this.$http.get(`/project/${this.projectId}`);
            this.$store.commit('setActiveProject', data);
        },
        async saveProject() {
            await this.$http.put(`/project/${this.projectId}`, {
                title: this.projectTitle,
            });
            this.isShowProjectEditForm = false;
        },

        setActiveDoc(activeDoc) {
            this.$set(this, 'activeDoc', activeDoc);
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