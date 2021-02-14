<template>
    <section v-if="treeData" class="row-doc p-2">
        <!-- 添加字段 -->
        <Modal title="添加" v-model="isShowAddForm" footer-hide>
            <FormProp
                v-model="addFormData"
                @input="addTreeNode"
                @close="isShowAddForm = false"
            />
        </Modal>

        <!-- 编辑字段 -->
        <Drawer v-model="isShowEditForm" :title="`编辑字段`" width="40">
            <template v-slot:title>
                <h1>编辑</h1>
            </template>
            <FormProp
                v-model="editFormData"
                @input="updateTreeNode"
                @close="isShowEditForm = false"
            />
        </Drawer>

        <Drawer
            v-model="isShowNodeDetail"
            placement="left"
            :title="`查看`"
            width="60"
        >
            <h1>iview table</h1>
            <highlightjs
                v-if="void 0 !== iviewColumnTpl"
                language="json"
                :code="iviewColumnTpl"
            />
        </Drawer>

        <!-- 主视图 -->
        <div class="d-flex mt-2">
            <Card class="flex-1">
                <h2 class="d-flex">当前数据</h2>
                <TreeMock
                    class="mt-1"
                    :tree-data="treeData"
                    @add="showAddForm"
                    @update="showEditForm"
                    @remove="removeTreeNode"
                    @set-repeat="showMockRepeatForm"
                />
            </Card>

            <Card class="ml-2 flex-1">
                <h2>预览</h2>
                <TreeDoc class="mt-1" :value="treeData" @show-node="showNode" />
            </Card>
        </div>
    </section>
</template>

<script>
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import mockjs from 'mockjs';
import cloneDeep from 'lodash/cloneDeep';
import TreeMock from '@/components/TreeMock.vue';
import TreeDoc from '@/components/TreeDoc.vue';
import FormProp from '@/components/FormProp.vue';
import { VAR_TYPE, VAR_TYPE_LIST } from '@/const';
import {
    MOCK_TYPES,
    MOCK_TYPE,
    mockString,
    createMockConfig,
} from '@/shared/mock.js';

export default {
    name: 'TreeDocAndPreview',

    props: {
        treeData: {
            required: true,
        },
    },

    components: { TreeDoc, TreeMock, FormProp },

    data() {
        const form = {
            type: VAR_TYPE.String,
            mock: createMockConfig(),
        };
        return {
            VAR_TYPE,
            VAR_TYPE_LIST,
            MOCK_TYPES,
            MOCK_TYPE,
            isShowAddForm: false,
            isShowEditForm: false,
            addFormData: { ...form },
            editFormData: { ...form },
            // 生成的假数据
            mockData: void 0,
            // 当前节点数据
            activeNodeData: void 0,

            isMockCreating: true,

            isShowTextareaJSON: true,

            // 临时变量
            _activeMockTimes: 1,

            isShowNodeDetail: false,
        };
    },

    computed: {
        // JSON() {
        //     return this.$store.state.JSON;
        // },

        id() {
            return this.$route.params.id;
        },

        // iview table列配置模板数据
        iviewColumnTpl() {
            if (this.isShowNodeDetail) {
                const columns = [];
                const { children } = this.activeNodeData;
                for (const { propName, text } of children) {
                    const column = { title: text, key: propName };
                    columns.push(column);
                }
                return JSON.stringify(columns, null, 4);
            }
        },
    },

    mounted() {
        this.refreshTree();
    },

    methods: {
        showNode({ node, root, data }) {
            this.isShowNodeDetail = true;
            this.activeNodeData = data;
            console.log({ node, root, data });
        },

        /**
         * 生成在线链接
         */
        async saveAndGetURL() {
            const { id } = await this.$http.post('/tree', {
                tree: this.treeData,
                mock: this.mockData,
            });
            this.$router.push({ query: { id } });
        },

        saveFile() {
            var blob = new Blob([JSON.stringify(this.mockData, null, 4)], {
                type: 'text/plain;charset=utf-8',
            });
            saveAs(blob, `${dayjs().format('YYYY-MM-DD@HH-mm-ss')}.mock.json`);
        },

        editDataSource() {
            this.$Modal.confirm({
                title: '注意',
                content: '修改会清空当前所有设置',
                onOk: () => {
                    this.$router.push({ path: '/' });
                },
            });
        },

        refreshTree() {
            // this.treeData = this.genTree(this.JSON);
            this.mockData = this.mock();
        },
        /**
         * 显示编辑表单
         */
        showEditForm({ data }) {
            // activeNodeData用来做指针
            this.activeNodeData = data;
            this.editFormData = cloneDeep(data);
            this.isShowEditForm = true;
        },

        /**
         * 显示添加表单
         */
        showAddForm({ data }) {
            const { type } = data;
            this.activeNodeData = data;
            this.addFormData = {
                type: VAR_TYPE.String,
                parentType: type,
                propName: VAR_TYPE.Object === type ? '' : void 0,
                mock: createMockConfig(),
                children: [],
                expand: false,
            };
            this.isShowAddForm = true;
        },

        /**
         * 添加数据节点
         */
        addTreeNode() {
            this.activeNodeData.expand = true;
            this.activeNodeData.children.push(this.addFormData);
            this.mockData = this.mock();
            this.$emit('save');
            this.isShowAddForm = false;
        },

        /**
         * 改变数据类型,
         * 重置mock设置
         */
        onChangeVarType() {
            this.$set(this.editFormData, 'mock', createMockConfig());
        },

        /**
         * 修改树
         */
        updateTreeNode() {
            // 切换数据类型必须清空子节点
            if (this.activeNodeData.type !== this.editFormData.type) {
                this.$set(this.editFormData, 'children', []);
            }

            this.$emit('save');

            Object.assign(this.activeNodeData, this.editFormData);
            this.mockData = this.mock();
            this.isShowEditForm = false;
        },

        /**
         * 设置mock数据循环次数
         */
        showMockRepeatForm({ data }) {
            // console.log(data.mock.times);
            this.$Modal.confirm({
                title: '对应假数据循环次数',
                render: (h) => {
                    return h(
                        'div',
                        {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                            },
                        },
                        [
                            // h('Slider', {
                            //     class: ['flex-1', 'mr-1'],
                            //     props: { min: 1, value: data.mock.times },
                            //     on: {
                            //         ['on-change']: (value) => {
                            //             this._activeMockTimes = value;
                            //         },
                            //     },
                            // }),
                            h('InputNumber', {
                                props: {
                                    min: 1,
                                    value: data.mock.times,
                                    size: 'large',
                                },
                                on: {
                                    ['on-change']: (value) => {
                                        this._activeMockTimes = value;
                                    },
                                },
                            }),
                        ]
                    );
                },
                onOk: () => {
                    data.mock.times = this._activeMockTimes;
                    this.mockData = this.mock();
                    this.$emit('save');
                },
            });
            // console.log(data.times);
        },

        removeTreeNode({ node, root }) {
            const parentKey = node.parent;
            const parent = root.find(({ nodeKey }) => nodeKey == parentKey);
            if (void 0 !== parent) {
                const index = parent.children.findIndex(
                    (key) => key == node.nodeKey
                );
                parent.node.children.splice(index, 1);
            }
            this.mockData = this.mock();
            this.$emit('save');
        },

        /**
         * 生成假数据
         */
        mock(node, activeMockData) {
            this.isMockCreating = true;
            // 当前数据节点
            const activeNode = node || this.treeData[0];
            const { type, mock } = activeNode;
            // console.log(type);
            // 数组
            if (VAR_TYPE.Array === type) {
                const array = [];
                for (const childNode of activeNode.children) {
                    for (let i = 0; i < childNode.mock.times; i++) {
                        array.push(this.mock(childNode));
                    }
                }
                this.isMockCreating = false;

                return array;
            }
            // 对象
            else if (VAR_TYPE.Object === type) {
                const object = activeMockData || {};
                for (const childNode of activeNode.children) {
                    object[childNode.propName] = this.mock(
                        childNode,
                        object[childNode.propName]
                    );
                }
                this.isMockCreating = false;
                return object;
            }
            // 非引用型数据
            else {
                this.isMockCreating = false;

                return this.mockPrimitiveData(type, mock);
            }
        },

        /**
         * 判断字符串可能的含义
         */
        mockPrimitiveData(type, mock) {
            const { min, max } = mock;
            if (VAR_TYPE.Number === type) {
                return mockjs.Random.natural(min, max);
            } else if (VAR_TYPE.String === type) {
                return mockString(mock);
            } else if (VAR_TYPE.Boolean === type) {
                return mockjs.Random.boolean();
            } else if (VAR_TYPE.Null === type) {
                return null;
            }
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