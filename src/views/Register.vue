<template>
    <article>
        <h1>注册</h1>
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

export default {
    name: 'Register',

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