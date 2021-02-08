<template>
    <div id="app">
        <header class="header">
            <div class="flex-1">
                <span class="header__logo" @click="$router.push({path:'/'})">BMOCK</span>
            </div>
            <a target="_new" href="https://github.com/any86/be-mock">
                <img
                    width="100"
                    class="d-block"
                    src="https://img.shields.io/github/stars/any86/be-mock?style=social"
                />
            </a>
        </header>
        <main class="body">
            <router-view />
        </main>
    </div>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
}
body{
    overflow-x: hidden;
    overflow-y: scroll;

}
$headerHeight: 60px;
.header {
    position: fixed;
    z-index: 1986;
    top: 0;
    left: 0;
    background: #fff;
    display: flex;
    align-items: center;
    z-index: 1;
    width: 100%;
    height: $headerHeight;
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
    padding: 0 16px;
    font-size: 18px;
    &__logo {
        font-weight: 900;
        cursor: pointer;
    }
}

.body {
    padding-top: $headerHeight;
    height: 100vh;
}

.ivu-tree {
    .ivu-tree-arrow {
        .ivu-icon {
            font-size: 16px;
        }
    }
}

.ivu-table-cell>span:empty:after{
    content:'暂无数据';
    font-size:12px;
    color:#ccc;
}
</style>
