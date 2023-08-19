<template>
    <div class="flex-wrap">
        <el-row class="tac">
            <el-col>
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-vertical-demo"
                >
                <el-menu-item index="1">
                    <span slot="title" @click="goPage('1')">自定义系列</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <span slot="title" @click="goPage('2')">热力图系列</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <div class="flex-right">
            <router-view/>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            activeIndex: '1',
        }
    },
    methods: {
        goPage(index) {
            debugger
            if (this.activeIndex === index) {
                return
            }
            // 匹配路由
            switch (index) {
                 case '1':
                    this.$router.push({path: 'Custom'})
                    break;
                case '2':
                    this.$router.push({path: 'Heatmap'})
                    break;
            }
        }
    }
}
</script>
<style lang='less'>
.flex-wrap {
    display: flex;
    .tac {
        width: 200px;
        height: 100vh;
    }
    .flex-right {
        width: calc(100% - 200px);
        height: 100vh;
    }
}
</style>