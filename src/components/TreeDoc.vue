<template>
    <Tree ref="tree" :render="treeRender" :data="value" />
</template>

<script>
import { VAR_COLOR_MAP, VAR_TYPE } from '@/const';
export default {
    name: 'TreeDoc',

    props: {
        value: {
            required: true,
            type: Array,
        },
    },

    methods: {
        treeRender(h, { root, node, data }) {
            const { propName = '', text, type } = data;
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

                VAR_TYPE.Object === type &&
                    h(
                        'Button',
                        {
                            class: ['ml-1'],
                            props: {
                                type: 'info',
                                size: 'small',
                                ghost: true,
                            },
                            on: {
                                click: () => {
                                    this.$emit('show-node', {
                                        node,
                                        data,
                                        root,
                                    });
                                },
                            },
                        },
                        [
                            h('span', { class: ['font-6'] }, `查看`),
                            h('Icon', { props: { type: 'md-eye' } }),
                        ]
                    ),

                text &&
                    h(
                        'Button',
                        {
                            class: ['ml-1'],
                            props: {
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    this.$emit('update', { node, data, root });
                                },
                            },
                        },
                        [
                            h('span', { class: ['font-6'] }, `${text}`),
                            h('Icon', { props: { type: 'ios-copy-outline' } }),
                        ]
                    ),
            ];
            return h('b', { class: ['font-4'] }, childrenNodes);
        },
    },
};
</script>

<style lang="scss">
</style>