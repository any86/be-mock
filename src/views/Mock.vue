<template>
    <article class="page-mock p-2">
        <!-- 添加字段 -->
        <Modal title="添加" v-model="isShowAddForm" footer-hide>
            <FormProp v-model="addFormData" @input="addTreeNode" />
        </Modal>

        <!-- 编辑字段 -->
        <Drawer v-model="isShowEditForm" :title="`编辑字段`" width="40">
            <template v-slot:title>
                <h1>编辑</h1>
            </template>
            <FormProp v-model="editFormData" @input="updateTreeNode" />
        </Drawer>

        <!-- 主视图 -->
        <div class="d-flex mt-2">
            <Card class="flex-1">
                <h2 class="d-flex">
                    当前数据
                    <Button class="ml-1" type="primary" @click="editDataSource"
                        ><Icon type="md-create" /> 修改数据源
                    </Button>
                </h2>
                <TreeMock
                    class="mt-1"
                    :value="treeData"
                    @add="showAddForm"
                    @update="showEditForm"
                    @remove="removeTreeNode"
                />
            </Card>
            <Card class="ml-2 ovh" style="width: 50%; background: #333">
                <Spin v-if="isMockCreating" fix></Spin>
                <h2 class="text-white d-flex">
                    预览
                    <Button
                        class="ml-1"
                        type="success"
                        @click="mockData = mock()"
                    >
                        <Icon type="md-refresh" /> 换一批
                    </Button>
                </h2>
                <highlightjs
                    v-if="void 0 !== mockData"
                    language="json"
                    :code="JSON.stringify(mockData, null, 4)"
                />
            </Card>
        </div>
    </article>
</template>

<script>
import mockjs from 'mockjs';
import cloneDeep from 'lodash/cloneDeep';
import isPlainObject from 'lodash/isPlainObject';
import TreeMock from '@/components/TreeMock.vue';
import FormProp from '@/components/FormProp.vue';
import { VAR_TYPE, VAR_TYPE_LIST } from '@/const';
import {
    MOCK_TYPES,
    MOCK_TYPE,
    MOCK_TYPE_POOL,
    getStringType,
    mockString,
} from '@/shared/mock.js';
const createMock = (type = MOCK_TYPE_POOL) => ({
    type,
    times: 1,
    max: 7,
    min: 0,
    pool: '白日依山尽,黄河入海流,欲穷千里目,更上一层楼',
});
export default {
    name: 'Mock',

    components: { TreeMock, FormProp },

    data() {
        const form = {
            type: VAR_TYPE.String,
            mock: createMock(),
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
            // 操作区的树
            treeData: [],
            // 生成的假数据
            mockData: void 0,
            // 当前节点数据
            activeNodeData: void 0,

            isMockCreating: true,

            isShowTextareaJSON: true,
        };
    },

    computed: {
        JSON() {
            return this.$store.state.JSON;
        },
    },

    mounted() {
        if (void 0 === this.JSON) {
            this.$router.push({ path: '/' });
        }
        this.refreshTree();
    },

    methods: {
        editDataSource() {
            this.$Modal.confirm({
                title: '注意',
                content: '修改会清空当前所有设置',
                onOk:()=> {
                    this.$router.push({ path: '/' });
                },
            });
        },

        refreshTree() {
            this.treeData = this.genTree(this.JSON);
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
                mock: createMock(),
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
            this.isShowAddForm = false;
        },

        /**
         * 改变数据类型,
         * 重置mock设置
         */
        onChangeVarType() {
            this.$set(this.editFormData, 'mock', createMock());
        },
        updateTreeNode() {
            // 切换数据类型必须清空子节点
            if (this.activeNodeData.type !== this.editFormData.type) {
                this.$set(this.editFormData, 'children', []);
            }

            Object.assign(this.activeNodeData, this.editFormData);
            this.mockData = this.mock();
            this.isShowEditForm = false;
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
                    // console.log(object);
                    object[childNode.propName] = this.mock(childNode, object);
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

        /**
         * 获取输入数据的类型
         */
        getType(object) {
            let rootType = null == object ? 'null' : typeof object;
            return (
                rootType[0].toUpperCase() +
                rootType.substring(1, rootType.length)
            );
        },
        /**
         * 根据输入数据生成树形数据
         */
        genSubNodes(object, parentType, propName, level = 0) {
            const expand = 2 > level;
            let nodes = [];
            if (isPlainObject(object)) {
                const active = {
                    parentType,
                    propName,
                    expand,
                    type: VAR_TYPE.Object,
                    children: [],
                    mock: {
                        times: 1,
                    },
                };
                for (const propName in object) {
                    const value = object[propName];
                    active.children.push(
                        ...this.genSubNodes(
                            value,
                            VAR_TYPE.Object,
                            propName,
                            level + 1
                        )
                    );
                }
                nodes.push(active);
            } else if (Array.isArray(object)) {
                const active = {
                    parentType,
                    propName,
                    expand,
                    type: VAR_TYPE.Array,
                    children: [],
                    mock: {
                        times: 1,
                    },
                };
                for (const item of object) {
                    active.children.push(
                        ...this.genSubNodes(
                            item,
                            VAR_TYPE.Array,
                            void 0,
                            level + 1
                        )
                    );
                }
                nodes.push(active);
            } else {
                // 对简单数据类型的进一步判断
                const type = this.getType(object);
                if (type === VAR_TYPE.String) {
                    // console.log(object.length,Math.pow(10,object.length));
                    const mockType = getStringType(object);
                    const max =
                        VAR_TYPE.Number === mockType
                            ? '' + ~~object
                            : object.length;
                    nodes.push({
                        parentType,
                        propName: 0 == level ? '' : propName,
                        type,
                        mock: {
                            times: 1,
                            type: mockType,
                            min: 0,
                            max,
                            pool: '',
                        },
                    });
                } else if (type === VAR_TYPE.Number) {
                    nodes.push({
                        parentType,
                        propName: 0 == level ? '' : propName,
                        type,
                        // 为了如果改变成Array|Object而准备的字段
                        expand: true,
                        children: [],
                        // mock
                        mock: {
                            times: 1,
                            type: getStringType(object),
                            min: 0,
                            max: object,
                        },
                    });
                } else if (type === VAR_TYPE.Null) {
                    nodes.push({
                        parentType,
                        propName: 0 == level ? '' : propName,
                        type,
                        // 预先为了改变类型把children放这
                        children: [],
                        expand: false,
                        // mock
                        mock: {
                            times: 1,
                        },
                    });
                }
            }
            return nodes;
        },

        genTree(object) {
            return this.genSubNodes(object);
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