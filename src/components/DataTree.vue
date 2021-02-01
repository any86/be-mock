<template>
    <article class="pos-r">
        <header class="d-flex">
            <h2>编辑模式</h2>
        </header>

        <Button type="primary" class="button-save" @click="$emit('save')"
            >保存</Button
        >

        <Button type="warning" class="button-mock" @click="$emit('mock')"
            >生成假数据</Button
        >

        <Tree ref="tree" :render="treeRender" :data="tree"> </Tree>

        <!-- <pre>
            <code>
            {{JSON.stringify(tree,null,4)}}
            </code>
        </pre> -->

        <!-- 添加字段 -->
        <Modal title="添加" v-model="addFormVisible" @on-ok="addProp">
            <Form v-if="activeNodeData" :label-width="80">
                <FormItem
                    v-if="'Object' === activeNodeData.type"
                    label="属性名"
                >
                    <Input v-model="addFormData.propName" />
                </FormItem>

                <FormItem label="数据类型">
                    <Select v-model="addFormData.type">
                        <Option
                            v-for="name in VAR_TYPE_LIST"
                            :key="name"
                            :label="name"
                            :value="name"
                        ></Option>
                    </Select>
                </FormItem>

                <FormItem label="文案">
                    <Input v-model="addFormData.text" />
                </FormItem>

                <FormItem label="补充说明">
                    <Input v-model="addFormData.desc" />
                </FormItem>
            </Form>
        </Modal>

        <!-- 编辑字段 -->
        <Drawer v-model="editFormVisible" title="编辑字段" width="40">
            <template v-slot:title>
                <h1>编辑</h1>
            </template>
            <Form
                v-if="activeNodeData"
                :model="editFormData"
                :label-width="100"
                class="p-2"
            >
                <FormItem prop="type" label="数据类型">
                    <Select v-model="editFormData.type">
                        <Option
                            v-for="name in VAR_TYPE_LIST"
                            :key="name"
                            :label="name"
                            :value="name"
                        ></Option>
                    </Select>
                </FormItem>

                <template v-if="editFormData.propName">
                    <FormItem prop="propName" label="属性名">
                        <Input v-model="editFormData.propName" />
                    </FormItem>

                    <FormItem prop="text" label="文案">
                        <Input v-model="editFormData.text" />
                    </FormItem>
                </template>

                <FormItem prop="mockTimes" label="假数据数">
                    <InputNumber v-model="editFormData.mock.times" />
                </FormItem>

                <FormItem prop="mockTimes" label="假数据数类型">
                    <Input v-model="editFormData.mock.type" />
                </FormItem>

                <FormItem prop="mockTimes" label="假数据数长度">
                    <InputNumber v-model="editFormData.mock.length" />
                </FormItem>

                <FormItem prop="desc" label="补充说明">
                    <Input v-model="editFormData.desc" />
                </FormItem>

                <FormItem>
                    <Button @click="editProp" type="primary">确定</Button>
                </FormItem>
            </Form>
        </Drawer>
    </article>
</template>

<script>
import isPlainObject from 'lodash/isPlainObject';
import cloneDeep from 'lodash/cloneDeep';
import { API_METHODS, VAR_TYPE_LIST, VAR_COLOR_MAP } from '@/const';

export default {
    name: 'DataTree',

    props: {
        data: {},

        id: {
            type: String,
            default: '5f02bf467de7870009e69ac7',
        },
    },

    data() {
        const form = {
            name: '',
            type: 'String',
            text: '',
            desc: '',
            mock: { times: 1, type: '', length: 0 },
        };
        return {
            VAR_TYPE_LIST,
            activeNodeData: { ...form },
            activeNode: { ...form },
            // 新增
            addFormVisible: false,
            addFormData: { ...form },
            // 编辑
            editFormVisible: false,
            editFormData: { ...form },
            tree: [],
            rootType: '',
        };
    },

    watch: {
        data: {
            immediate: true,
            handler() {
                this.tree = this.genTree(this.data);
                this.$nextTick(() => {
                    this.$emit('update', this.tree);
                });
            },
        },
    },

    methods: {
        treeRender(h, { root, node, data }) {
            // console.log(data);
            const { propName = '', type, mock } = data;
            const childrenNodes = [
                // 属性名
                propName,
                // 类型
                h(
                    'span',
                    {
                        style: {
                            color: VAR_COLOR_MAP[type],
                        },
                    },
                    `(${type}${
                        'children' in data && ['Object', 'Array'].includes(type)
                            ? ` [${data.children.length}]`
                            : ''
                    })
                    `
                ),
                1 < mock.times
                    ? h('span', { class: ['text-warning', 'font-6'] }, [
                          `[假数据x${mock.times}]`,
                      ])
                    : void 0,
                // 按钮
                ['Object', 'Array'].includes(type) &&
                    h(
                        'Button',
                        {
                            class: ['ml-1'],
                            props: {
                                type: 'primary',
                                size: 'small',
                                ghost: true,
                            },
                            on: {
                                click: () => {
                                    this.showAddPropForm(node, data);
                                },
                            },
                        },
                        '添加'
                    ),

                h(
                    'Button',
                    {
                        class: ['ml-1'],
                        props: {
                            type: 'success',
                            size: 'small',
                            ghost: true,
                        },
                        on: {
                            click: () => {
                                this.showEditPropForm(node, data);
                            },
                        },
                    },
                    '编辑'
                ),

                h(
                    'Button',
                    {
                        class: ['ml-1'],
                        props: {
                            type: 'error',
                            size: 'small',
                            ghost: true,
                        },
                        on: {
                            click: () => {
                                this.removeProp(node, data, root);
                            },
                        },
                    },
                    '删除'
                ),
            ];
            return h('b', { class: ['font-4'] }, childrenNodes);
        },

        removeProp(node, data, root) {
            const parentKey = node.parent;
            const parent = root.find(({ nodeKey }) => nodeKey == parentKey);
            if (void 0 !== parent) {
                const index = parent.children.findIndex(
                    (key) => key == node.nodeKey
                );
                parent.node.children.splice(index, 1);
            }
        },

        importJSON(json) {
            this.tree = this.genTree(json);
            return this.tree;
        },

        importTree(tree) {
            this.tree = tree;
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
                    text: '',
                    type: 'Object',
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
                            'Object',
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
                    text: '',
                    type: 'Array',
                    children: [],
                    mock: {
                        times: 1,
                    },
                };
                for (const item of object) {
                    active.children.push(
                        ...this.genSubNodes(item, 'Array', void 0, level + 1)
                    );
                }
                nodes.push(active);
            }
            // 不可变数据, String, Null, Number
            else {
                const type = this.getType(object);
                nodes.push({
                    parentType,
                    propName: 0 == level ? '' : propName,
                    type,
                    text: '',
                    // 为了如果改变成Array|Object而准备的字段
                    expand: true,
                    children: [],
                    // mock
                    mock: {
                        times: 1,
                        type:
                            parseFloat(object) == object ? 'Number' : 'String',
                        // 规避null
                        length: (object || '').length,
                    },
                });
            }
            return nodes;
        },

        genTree(object) {
            return this.genSubNodes(object);
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
         * 显示编辑表单
         */
        showEditPropForm(node, data) {
            this.activeNode = node.node;
            this.activeNodeData = data;
            this.editFormData = cloneDeep(data);
            this.editFormVisible = true;
        },

        /**
         * 编辑属性
         */
        editProp() {
            // 如果数据类型改变, 那么children
            if (this.activeNodeData.type !== this.editFormData.type) {
                // this.editFormData.children = [];
                this.$set(this.editFormData, 'children', []);
            }
            Object.assign(this.activeNodeData, this.editFormData);
            // this.$set(this,'activeNodeData',this.editFormData)
            this.editFormVisible = false;
            // this.$forceUpdate();
            this.$emit('update', this.tree);
        },

        /**
         * 显示添加属性菜单
         */
        showAddPropForm(node, data) {
            this.activeNode = node.node;
            this.activeNodeData = data;
            this.addFormVisible = true;
        },

        /**
         * 添加属性
         */
        addProp() {
            // 检查属性是否存在
            const { propName, type } = this.addFormData;
            if (void 0 === this.activeNodeData.children) {
                this.$set(this.activeNodeData, 'children', []);
            }
            // 展开子节点
            this.$set(this.activeNodeData, 'expand', true);

            const hasSamePropName =
                'Object' === this.activeNode.type &&
                this.activeNodeData.children.some((node) => {
                    return node.propName == propName;
                });

            if (hasSamePropName) {
                this.$Modal.error({
                    title: '错误',
                    content: `"${propName}" 字段已经存在!`,
                });
            } else {
                this.activeNodeData.children.push(cloneDeep(this.addFormData));
                // this.$forceUpdate();
            }
            this.addFormVisible = false;
            this.$emit('update', this.tree);
        },
    },
};
</script>

<style lang="scss">
// .el-tree-node
.ivu-tree {
    .ivu-tree-arrow {
        .ivu-icon {
            font-size: 16px;
        }
    }
}

.button-save {
    position: absolute;
    top: 8px;
    right: 8px;
}

.button-mock {
    position: absolute;
    top: 8px;
    right: 78px;
}
</style>