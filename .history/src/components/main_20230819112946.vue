<template>
    <div class="flex-wrap">
        <el-row class="tac">
            <el-col :span="12">
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                >
                <el-menu-item index="1">
                    <span slot="title">自定义系列</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <span slot="title">热力图系列</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <div class="flex-right">
            <router-view/>
        </div>
    </div>
</template>
<style lang='less'>
.flex-wrap {
    display: flex;
    .tac {
        width: 200px;
        height: 100vh;
    }
    .flex-right {
        width: calc(100% -200px);
        height: 100vh;
    }
}
</style>