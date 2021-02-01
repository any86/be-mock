<template>
    <article class="d-flex">
        <el-input placeholder="请输入网址" v-model="url" class="flex-1">
            <el-select
                v-model="methodName"
                slot="prepend"
                placeholder="请选择"
                style="min-width:100px;"
            >
                <el-option v-for="name in API_METHODS" :key="name" :label="name" :value="name"></el-option>
            </el-select>
        </el-input>
        <el-button type="primary" icon="el-icon-s-promotion" class="ml-1">发送{{methodName}}</el-button>
    </article>
</template>

<script>
import { API_METHODS } from "@/const";
export default {
    name: "UrlBar",

    data() {
        return {
            methodName: API_METHODS[0],
            API_METHODS,
            url: ""
        };
    }
};
</script>

<style lang="scss">
</style>