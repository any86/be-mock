<template>
    <article class="tree-mock-and-preview">
        <Modal
            v-model="isShowQueryForm"
            title="请确认请求参数"
            @on-ok="saveAndGetURL"
        >
            <Form inline>
                <Divider>Params</Divider>
                <template v-for="{ key } in requestParams">
                    <FormItem :label="key" v-if="'' !== key" :key="key">
                        <Input
                            v-model="httpParams[key]"
                            clearable
                            placeholder="请输入模拟值"
                        />
                    </FormItem>
                </template>

                <Divider>Body</Divider>

                <template v-for="{ key } in requestBody">
                    <FormItem :label="key" v-if="'' !== key" :key="key">
                        <Input
                            v-model="httpBody[key]"
                            clearable
                            placeholder="请输入模拟值"
                        />
                    </FormItem>
                </template>

                <Divider>状态码</Divider>
                <FormItem label="http状态码">
                    <Input v-model="httpCode" />
                </FormItem>
            </Form>
        </Modal>

        <Row>
            <!-- 主视图 -->
            <i-col :xs="24" :sm="24" :md="12" :lg="12" class="p-1">
                <Card class="flex-1 ovh" style="background: #333">
                    <Spin v-if="isMockCreating" fix></Spin>
                    <div class="mt-1">
                        <Button
                            class="mr-1 mb-1"
                            ghost
                            type="success"
                            @click="refreshMock"
                        >
                            <Icon type="md-refresh" /> 换一批
                        </Button>

                        <Button
                            class="mr-1 mb-1"
                            ghost
                            type="primary"
                            @click="saveFile"
                        >
                            <Icon type="md-cloud-download" /> 保存本地
                        </Button>

                        <Button
                            class="mr-1 mb-1"
                            ghost
                            type="warning"
                            @click="isShowQueryForm = true"
                        >
                            <Icon type="md-cloud-download" /> 生成链接
                        </Button>
                    </div>
                    <highlightjs
                        v-if="!isMockCreating && void 0 !== mockData"
                        language="json"
                        :code="JSON.stringify(mockData, null, 4)"
                    />
                </Card>
            </i-col>

            <i-col :xs="24" :sm="24" :md="12" :lg="12" class="p-1">
                <Table :data="mocks" :columns="columns" border>
                    <template slot-scope="{ row }" slot="action">
                        <Button
                            type="success"
                            size="small"
                            @click="copyURL(row)"
                            >复制链接</Button
                        >
                        <Button
                            class="ml-1"
                            type="error"
                            size="small"
                            @click="remove(row)"
                            >删除</Button
                        >
                    </template>
                </Table>
            </i-col>
        </Row>
    </article>
</template>

<script>
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import mockjs from 'mockjs';
import { VAR_TYPE } from '@/const';
import { mockString, createMockConfig } from '@/shared/mock.js';
import {objectFilterEmpty } from '@/shared/object.js';


export default {
    name: 'TreeMockAndPreview',

    props: {
        treeData: {
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
        const form = {
            type: VAR_TYPE.String,
            mock: createMockConfig(),
        };

        const httpParams = {};
        if (void 0 !== this.requestParams) {
            this.requestParams.forEach(({ key }) => {
                if ('' !== key.trim()) {
                    httpParams[key] = '';
                }
            });
        }

        const httpBody = {};
        if (void 0 !== this.requestBody) {
            this.requestBody.forEach(({ key }) => {
                if ('' !== key.trim()) {
                    httpBody[key] = '';
                }
            });
        }

        return {
            isShowQueryForm: false,
            queryString: '',
            httpParams,
            httpBody,
            httpCode: 200,
            mocks: [],
            columns: [
                {
                    title: '请求params',
                    render(h, { row }) {
                        return h('span', JSON.stringify(row.params));
                    },
                },
                {
                    title: '请求body',
                    render(h, { row }) {
                        return h('span', JSON.stringify(row.body));
                    },
                },
                {
                    title: '状态码',
                    key: 'httpCode',
                },
                {
                    title: '创建时间',
                    render(h, { row }) {
                        return h('Time', { props: { time: row.createAt } });
                    },
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 170,
                    align: 'center',
                },
            ],

            VAR_TYPE,
            isShowAddForm: false,
            addFormData: { ...form },
            // 生成的假数据
            mockData: void 0,

            isMockCreating: true,

            isTableLoading: true,
        };
    },

    computed: {
        docId() {
            return this.$route.query.docId;
        },
    },

    mounted() {
        this.refreshMock();
        this.getMockList();
    },

    methods: {
        copyURL(row) {
            const query = [];
            for (const key in row.params) {
                query.push(`${key}=${row.params[key]}`);
            }

            const URL = `http://127.0.0.1:3000/mock/${row.docId}?${query.join(
                '&'
            )}`;

            console.log(URL);
            this.$copyText(URL)
                .then((e) => {
                    this.$Message.success('复制成功');
                })
                .catch((e) => {
                    this.$Message.error('复制失败, 请重试');
                });
        },

        async remove(row) {
            await this.$http.delete('/mock/'+row._id);
            this.getMockList();
        },

        async getMockList() {
            this.isTableLoading = true;
            this.mocks = await this.$http.get('/mock', {
                params: { docId: this.docId },
            });
            this.isTableLoading = false;
        },
        /**
         * 生成在线链接
         */
        async saveAndGetURL() {
            await this.$http.post('/mock', {
                mock: this.mockData,
                params: objectFilterEmpty(this.httpParams),
                body:objectFilterEmpty(this.httpBody),
                httpCode:this.httpCode,
                docId: this.docId,
            });
            this.getMockList();
        },

        saveFile() {
            var blob = new Blob([JSON.stringify(this.mockData, null, 4)], {
                type: 'text/plain;charset=utf-8',
            });
            saveAs(blob, `${dayjs().format('YYYY-MM-DD@HH-mm-ss')}.mock.json`);
        },

        refreshMock() {
            this.isMockCreating = true;
            setTimeout(() => {
                this.mockData = this.mock();
            }, 500);
        },

        /**
         * 生成假数据
         */
        mock(node, activeMockData) {
            if (void 0 === this.treeData) return;

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

                return Object.freeze(array);
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
                return Object.freeze(object);
            }
            // 非引用型数据
            else {
                this.isMockCreating = false;
                return Object.freeze(this.mockPrimitiveData(type, mock));
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