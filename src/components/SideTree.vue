<template>
    <ul class="flex-1 side-tree">
        <li v-for="(item,index) in data" :key="index">
            <p><i class="el-icon-arrow-right"/><i class="el-icon-folder"/>{{item.name}}</p>
            <side-tree v-if="void 0 !== item.children" :data="item.children"></side-tree>
        </li>
    </ul>
</template>

<script>
import SideTree from './SideTree';
export default {
    name: "SideTree",

    components:{SideTree},

    props:{
        data:{
            type: Array,
            default:()=>[]
        }
    },
    data() {
        return {
            
        };
    }
};
</script>
<style lang="scss" scoped>
ul.side-tree {
    li {
        padding: 16px;
        p:hover{
            cursor: pointer;
            color: #69c;
        }
    }
}
</style>