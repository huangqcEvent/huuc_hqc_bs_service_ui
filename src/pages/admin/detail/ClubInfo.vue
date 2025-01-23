<template>
    <div class="detail-info" v-if="clubDataInfo.type == 1">
        <el-divider style="margin-top: 0" />
        <div class="detail-header">
            <span>社团纳新贴详情</span>
        </div>
        <div class="detail-content">
            <div class="detail-content-base">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">标题</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.title }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">社团工作</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.daily }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">社团福利</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.welfare }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">社团要求</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.claim }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">招新计划</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.already }}/{{ clubDataInfo.number }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">招新时限</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.timeTypeName }}
                            </span>
                        </div>
                    </el-col>
                    <el-col v-if="clubDataInfo.timeType == 2" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">时间范围</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.startTime }} 至 {{ clubDataInfo.endTime }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">创建时间</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.createTime }}
                            </span>
                        </div>
                    </el-col>
                    <el-col v-if="clubDataInfo.image1" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片1</span>
                            <Image :src="clubDataInfo.image1" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="clubDataInfo.image2" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片2</span>
                            <Image :src="clubDataInfo.image2" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="clubDataInfo.image3" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片3</span>
                            <Image :src="clubDataInfo.image3" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
    <div class="detail-info" v-else-if="clubDataInfo.type == 2">
        <el-divider style="margin-top: 0" />
        <div class="detail-header">
            <span>社团公告贴详情</span>
        </div>
        <div class="detail-content">
            <div class="detail-content-base">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">标题</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.title }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">创建时间</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.createTime }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">公告内容</span>
                            <span class="base-item-content">
                                {{ clubDataInfo.claim }}
                            </span>
                        </div>
                    </el-col>
                    <el-col v-if="clubDataInfo.image1" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片1</span>
                            <Image :src="clubDataInfo.image1" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="clubDataInfo.image2" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片2</span>
                            <Image :src="clubDataInfo.image2" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="clubDataInfo.image3" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片3</span>
                            <Image :src="clubDataInfo.image3" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="ClubInfo">
import { type ClubRecruitmentNewsInfoData } from '@/api/admin/detail/detailApi'
import Image from '@/common/Image.vue';

const props = defineProps<{
    clubDataInfo: ClubRecruitmentNewsInfoData
}>()
</script>

<style lang="scss"></style>
