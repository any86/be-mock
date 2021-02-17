<template>
    <article class="export-file">
        <Button>导出Markdown</Button>
        <article v-html="html" class="preview"></article>
    </article>
</template>

<script>
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import mockjs from 'mockjs';
import { VAR_TYPE } from '@/const';
import { mockString, createMockConfig } from '@/shared/mock.js';
import { objectFilterEmpty } from '@/shared/object.js';
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();
export default {
    name: 'ExportFile',

    props: {
        response: {
            required: true,
        },

        requestParams: {
            type: Array,
        },

        requestBody: {
            type: Array,
        },
    },

    data() {
        return {
            isShowQueryForm: false,
            queryString: '',
            tableData: [],
            markdown: '',
        };
    },

    computed: {
        docId() {
            return this.$route.query.docId;
        },
        html() {
            return md.render(this.markdown);
        },
    },

    mounted() {
        this.tableData = this.walkResponse(this.response);
        this.markdown = this.genMarkdown(this.tableData);
        // console.log(this.markdown);

    },

    methods: {
        genMarkdown(tableData) {
            const markdownArray = [`|键值|类型|文案|`];
            markdownArray.push(`|---|---|---|`);
            tableData.forEach(({ propName, type, text, level }) => {
                // markdown
                const space =
                    '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(level) +
                    '- '.repeat(level);
                markdownArray.push(
                    `|${space} **${propName || ''}**|${space} ${type}|${text}|`.replace('****','')
                );
            });
            return markdownArray.join('\r\n');
        },

        walkResponse(response, table = [], level = 0) {
            for (const item of response) {
                const { propName, type, text, children } = item;
                table.push({ propName, type, text, level });
                if (0 < children.length) {
                    this.walkResponse(children, table, level + 1);
                }
            }

            return table;
        },
        parseResponse() {
            // return this
        },
    },
};
</script>
<style lang="scss" scope>
.preview {
    table {
        border: 1px solid #ddd;
        border-spacing: 0;
        border-collapse: collapse;
        tr {
            width: 100%;
            td,
            th {
                padding: 8px 16px;
                border-right: 1px solid #ccc;
            }

            th {
                text-align: start;
            }

            td:nth-child(3n+3):empty:after {
                content: '未填写';
                font-size: 12px;
                color: #ccc;
            }
        }
    }
}
</style>