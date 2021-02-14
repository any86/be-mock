<template>
    <article class="api-list">
        <Modal v-model="isShowAddForm" title="新建接口文档" @on-ok="createDoc">
            <Form>
                <FormItem label="标题">
                    <Input
                        v-model="addForm.title"
                        placeholder="给接口起个名吧"
                    />
                </FormItem>
                <FormItem label="请求地址">
                    <Input v-model="addForm.url" placeholder="请求地址" />
                </FormItem>
                <FormItem label="请求类型">
                    <Select v-model="addForm.method">
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>

        <!-- 编辑 -->
        <Drawer v-model="isShowEditForm" :title="`编辑`" width="40">
            <Form>
                <FormItem label="标题">
                    <Input
                        v-model="editForm.title"
                        placeholder="给接口起个名吧"
                    />
                </FormItem>
                <FormItem label="请求地址">
                    <Input v-model="editForm.url" placeholder="请求地址" />
                </FormItem>
                <FormItem label="请求类型">
                    <Select v-model="editForm.method">
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </FormItem>

                <Button type="error" long>删除</Button>
                <Button class="mt-2" type="primary" long @click="saveDoc"
                    >保存</Button
                >
            </Form>
        </Drawer>

        <Button @click="isShowAddForm = true" type="primary"
            ><Icon type="md-add" /> 新建文档</Button
        >

        <Input class="mt-1" v-model="keywords" placeholder="过滤关键字" />

        <!-- 接口目录 -->
        <ul class="docs mt-1">
            <li
                v-for="row in listFiltered"
                :key="row._id"
                :class="{ active: docId === row._id }"
                class="d-flex align-items-center font-weight-600"
                @click="showEditForm(row)"
            >
                <b class="font-6 text-success" style="width: 36px">{{
                    row.method
                }}</b>
                <span class="flex-1 d-block ml-1">{{ row.title }}</span>
                <span class="button-more" @click="isShowEditForm = true">
                    <Icon class="icon" type="md-create" size="20" />
                </span>
            </li>
        </ul>
    </article>
</template>

<script>
function createFormData() {
    return {
        title: '',
        method: 'GET',
        url: '',
    };
}

export default {
    name: 'ApiList',

    props: {
        list: {
            type: Array,
            required: true,
        },
        docId: {
            type: String,
        },
    },

    computed: {
        listFiltered() {
            const keywords = this.keywords.trim().toLocaleLowerCase();
            if ('' === keywords) {
                return this.list;
            }
            return this.list.filter((row) => row.title.toLocaleLowerCase().includes(this.keywords));
        },
    },

    data() {
        return {
            isShowAddForm: false,
            isShowEditForm: false,
            addForm: createFormData(),
            editForm: createFormData(),
            keywords: '',
        };
    },

    methods: {
        showEditForm(row) {
            const { _id: docId, title, method, url } = row;
            this.editForm = { title, method, url };
            const { query } = this.$route;
            if (docId !== query.docId) {
                this.$router.push({ query: { ...query, docId } });
            }
        },

        async remove(row) {
            const { _id } = row;
            await this.$http.delete('/doc', { params: { id: _id } });
            this.$emit('after-remove');
            this.$emit('change');
        },
        /**
         * 创建项目
         */
        async createDoc() {
            const { title, url, method } = this.addForm;
            const { id } = await this.$http.post('/doc', {
                title,
                url,
                method,
                projectId: this.projectId,
            });
            if (id) {
                this.$emit('after-create');
                this.$emit('change');
            }
        },

        async saveDoc() {
            const { title, url, method } = this.editForm;
            await this.$http.put('/doc/' + this.docId, {
                title,
                url,
                method,
            });
            this.isShowEditForm = false;
            this.$emit('after-update', { title, url, method });
            this.$emit('change');
        },
    },
};
</script>
<style lang="scss" scope>
.api-list {
    border-right: 1px solid #eee;
    width: 236px;
    padding: 0 8px 8px 8px;
    ul.docs {
        li {
            list-style: none;
            padding: 8px;
            cursor: pointer;
            &.active {
                color: #69f;
            }
            .button-more {
                // height: 32px;
                .icon {
                    display: none;
                }
            }
            &:hover {
                background: #f5f5f5;
                .button-more {
                    .icon {
                        display: block;
                    }
                }
            }
        }
    }
}
</style>