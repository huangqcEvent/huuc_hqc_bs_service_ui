<template>
    <div class="detail-info">
        <el-divider style="margin-top: 0" />
        <div class="detail-header">
            <span>表白墙{{ confessionInfoData.typeName }}贴详情</span>
        </div>
        <div class="detail-content">
            <div class="detail-content-base">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">标题</span>
                            <span class="base-item-content">
                                {{ confessionInfoData.title }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">概述</span>
                            <span class="base-item-content">
                                {{ confessionInfoData.summary }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item" v-if="confessionInfoData.type == 1">
                            <span class="base-item-label">对另一半的期望</span>
                            <span class="base-item-content">
                                {{ confessionInfoData.toUserInfo }}
                            </span>
                        </div>
                        <div class="base-item" v-if="confessionInfoData.type == 2">
                            <span class="base-item-label">对她（他）的描述</span>
                            <span class="base-item-content">
                                {{ confessionInfoData.toUserInfo }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">内容</span>
                            <span class="base-item-content">
                                {{ confessionInfoData.content }}
                            </span>
                        </div>
                    </el-col>

                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">创建时间</span>
                            <span class="base-item-content">
                                {{ confessionInfoData.createTime }}
                            </span>
                        </div>
                    </el-col>
                    <el-col v-if="confessionInfoData.image1" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片1</span>
                            <Image :src="confessionInfoData.image1" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="confessionInfoData.image2" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片2</span>
                            <Image :src="confessionInfoData.image2" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="confessionInfoData.image3" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片3</span>
                            <Image :src="confessionInfoData.image3" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="ClubInfo">
import { type ConfessionInfoData } from '@/api/admin/detail/detailApi'
import Image from '@/common/Image.vue';

const props = defineProps<{
    confessionInfoData: ConfessionInfoData
}>()
</script>

<style lang="scss"></style>
