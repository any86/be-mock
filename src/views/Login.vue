<template>
    <article>
        <h1>登录</h1>
        <Form :label-width="80">
            <FormItem>
                <i-input v-model="form.userName" placeholder="请输入用户名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>

            <FormItem>
                <i-input v-model="form.password" placeholder="请输入密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>

            <FormItem>
                <Button type="primary" long @click="login">确定</Button>
            </FormItem>
        </Form>
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
            AV.User.logIn(this.form.userName,this.form.password).then(
                (user) => {
                    console.log(user)
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