<template>
    <article>
        <h1>创建接口</h1>
        <Form>
            <FormItem label="请求方式">
                <Select>
                    <Option>GET</Option>
                    <Option>POST</Option>
                    <Option>PUT</Option>
                    <Option>DELETE</Option>
                </Select>
            </FormItem>
        </Form>
        <Card>头信息</Card>
        <Card>参数信息</Card>
        <Card>返回值</Card>
    </article>
</template>

<script>
const AV = require('leancloud-storage');
AV.init({
    appId: 'd17RQjEX9eSkciEREen6TSJ6-gzGzoHsz',
    appKey: 'N8WGys9ctTNQ5oS745ltEaGh',
    serverURL: 'https://d17rqjex.lc-cn-n1-shared.com',
});
const { Query, User } = AV;

export default {
    name: 'Login',

    components: {},

    data() {
        return {
            form: {
                userName: '',
                password: '',
            },
        };
    },

    methods: {
        login() {
            AV.User.logIn(this.form.userName, this.form.password).then(
                (user) => {
                    console.log(user);
                    // 登录成功
                },
                (error) => {
                    // 登录失败（可能是密码错误）
                }
            );
        },
    },
};
</script>

<style lang="scss" scoped>
article {
    max-width: 360px;
    width: 100%;
    margin: 10% auto;
}
</style>