<template>
    <div class="flex-wrap">
        <el-row class="tac">
            <el-col>
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-vertical-demo"
                >
                <el-menu-item index="1" @click="goPage('1')">
                    <span slot="title">自定义系列</span>
                </el-menu-item>
                <el-menu-item index="2" @click="goPage('2')">
                    <span slot="title">热力图系列</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <div class="flex-right">
            <div class="felx-main-con">
                <router-view/>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            activeIndex: '',
        }
    },
    watch: {
        $route:{
            handler: function(to) {
                this.activeIndex = to.path === '/Custom' ? '1' : '2'
            },
            immediate: true,
            deep: true,
        }
    },
    methods: {
        goPage(index) {
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
    },
}
</script>
<style lang='less'>
.flex-wrap {
    display: flex;
    .tac {
        width: 200px;
        height: 100vh;
        border-right: 1px solid #f1f1f1;
    }
    .flex-right {
        width: calc(100% - 200px);
        height: 100vh;
        .felx-main-con {
            margin-left: 100px;
        }
    }
}
</style>