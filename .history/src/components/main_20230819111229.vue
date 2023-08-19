<template>
    <div>
        <el-row class="tac">
            <el-col :span="12">
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                >
                <el-menu-item index="1">
                    <i class="el-icon-message"></i>
                    <span slot="title">自定义系列</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">热力图系列</span>
                </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <router-view/>
    </div>
</template>