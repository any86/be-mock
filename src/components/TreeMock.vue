<template>
    <Tree ref="tree" :render="treeRender" :data="value" />
</template>

<script>
import { VAR_COLOR_MAP, VAR_TYPE } from '@/const';
export default {
    name: 'TreeMock',

    props: {
        value: {
            required: true,
            type: Array,
        },
    },

    methods: {
        treeRender(h, { root, node, data }) {
            const { propName = '', parentType, type, mock } = data;
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
                // 1 < mock.times
                //     ? h('span', { class: ['text-warning', 'font-6'] }, [
                //           `[假数据x${mock.times}]`,
                //       ])
                //     : void 0,
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
                                    this.$emit('add', { node, data, root });
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
                                this.$emit('update', { node, data, root });
                            },
                        },
                    },
                    '设置'
                ),

                // 非根才有删除按钮
                VAR_TYPE.Array === parentType &&
                    h(
                        'Button',
                        {
                            class: ['ml-1'],
                            props: {
                                type: 'warning',
                                size: 'small',
                                ghost: true,
                            },
                            on: {
                                click: () => {
                                    this.$emit('set-repeat', {
                                        node,
                                        data,
                                        root,
                                    });
                                },
                            },
                        },
                        `循环 x ${mock.times}`
                    ),

                // 非根才有删除按钮
                void 0 !== node.parent &&
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
                                    this.$emit('remove', { node, data, root });
                                },
                            },
                        },
                        '删除'
                    ),
            ];
            return h('b', { class: ['font-4'] }, childrenNodes);
        },
    },
};
</script>

<style lang="scss">
</style>