<template>
    <Row>
        <!-- 主视图 -->
        <i-col :xs="24" :sm="24" :md="24" :lg="12" class="p-1">
            <Card class="flex-1 ovh" style="background: #333">
                <Spin v-if="isMockCreating" fix></Spin>
                <h2 class="text-white d-flex">
                    预览
                    <Button
                        ghost
                        class="ml-1"
                        type="success"
                        @click="mockData = mock()"
                    >
                        <Icon type="md-refresh" /> 换一批
                    </Button>

                    <Button class="ml-1" ghost type="primary" @click="saveFile">
                        <Icon type="md-cloud-download" /> 保存本地
                    </Button>

                    <Button
                        class="ml-1"
                        ghost
                        type="warning"
                        @click="saveAndGetURL"
                    >
                        <Icon type="md-cloud-download" /> 生成链接
                    </Button>
                </h2>
                <highlightjs
                    v-if="void 0 !== mockData"
                    language="json"
                    :code="JSON.stringify(mockData, null, 4)"
                />
            </Card>
        </i-col>

        <i-col :xs="24" :sm="24" :md="24" :lg="12" class="p-1">
            <Table :data="mocks" :columns="columns" border>
                <template slot-scope="{ row }" slot="action">
                    <Button type="error" size="small" @click="remove(row)"
                        >删除</Button
                    >
                </template>
            </Table>
        </i-col>
    </Row>
</template>

<script>
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import mockjs from 'mockjs';
import { VAR_TYPE } from '@/const';
import { mockString, createMockConfig } from '@/shared/mock.js';

export default {
    name: 'TreeMockAndPreview',

    props: {
        treeData: {
            required: true,
        },
    },

    data() {
        const form = {
            type: VAR_TYPE.String,
            mock: createMockConfig(),
        };
        return {
            mocks: [],
            columns: [
                {
                    title: 'id',
                    render(h,{row}){
                        return h('a',{on:{
                            click(){
                                window.location.href = `http://127.0.0.1:3000/mock/${row._id}`
                                // console.log(row)
                            }
                        }}, row._id);
                    }
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
                    width: 150,
                    align: 'center',
                },
            ],

            VAR_TYPE,
            isShowAddForm: false,
            addFormData: { ...form },
            // 生成的假数据
            mockData: void 0,

            isMockCreating: true,
        };
    },

    mounted() {
        this.refreshMock();
        this.getMockList();
    },

    methods: {
        async remove(row) {
            const data = await this.$http.delete('/mock', {
                params: { id: row._id },
            });
            this.getMockList();
            console.log(data);
        },

        async getMockList() {
            this.mocks = await this.$http.get('/mock');
        },
        /**
         * 生成在线链接
         */
        async saveAndGetURL() {
            await this.$http.post('/mock', {
                mock: this.mockData,
            });
            this.getMockList();
            // this.$router.push({ query: { id } });
        },

        saveFile() {
            var blob = new Blob([JSON.stringify(this.mockData, null, 4)], {
                type: 'text/plain;charset=utf-8',
            });
            saveAs(blob, `${dayjs().format('YYYY-MM-DD@HH-mm-ss')}.mock.json`);
        },

        refreshMock() {
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