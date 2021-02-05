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

                data.text &&
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
                        [
                            h('Icon', { props: { type: 'ios-copy-outline' } }),
                            h('span', { class: ['font-6'] }, ` ${data.text}`),
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