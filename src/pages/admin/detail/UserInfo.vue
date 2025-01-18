<template>
    <div class="detail-info">
        <el-divider style="margin-top: 20px" />
        <div class="detail-header">
            <span>用户信息</span>
        </div>
        <div class="detail-content">
            <div class="detail-content-base">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">用户名称</span>
                            <span class="base-item-content">
                                {{ userInfo.userName }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">用户id</span>
                            <span class="base-item-content">
                                {{ userInfo.userId }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">用户头像</span>
                            <Image :src="userInfo.userHead" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="UserInfo">
import { type UserInfo } from '@/api/admin/detail/detailApi'
import Image from '@/common/Image.vue';

const props = defineProps<{
    userInfo: UserInfo
}>()
</script>

<style lang="scss"></style>
