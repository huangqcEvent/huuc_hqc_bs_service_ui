<template>
    <div class="detail-info">
        <el-divider style="margin-top: 0" />
        <div class="detail-header">
            <span>寻物{{ lostItemInfoData.typeName }}贴详情</span>
        </div>
        <div class="detail-content">
            <div class="detail-content-base">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">失物名称</span>
                            <span class="base-item-content">
                                {{ lostItemInfoData.itemName }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item" v-if="lostItemInfoData.type == 1">
                            <span class="base-item-label">丢失地点</span>
                            <span class="base-item-content">
                                {{ lostItemInfoData.location }}
                            </span>
                        </div>
                        <div class="base-item" v-if="lostItemInfoData.type == 2">
                            <span class="base-item-label">发现地点</span>
                            <span class="base-item-content">
                                {{ lostItemInfoData.location }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">描述</span>
                            <span class="base-item-content">
                                {{ lostItemInfoData.itemDesc }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">联系方式（电话）</span>
                            <span class="base-item-content">
                                {{ lostItemInfoData.phone }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="base-item">
                            <span class="base-item-label">创建时间</span>
                            <span class="base-item-content">
                                {{ lostItemInfoData.createTime }}
                            </span>
                        </div>
                    </el-col>
                    <el-col v-if="lostItemInfoData.image1" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片1</span>
                            <Image :src="lostItemInfoData.image1" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="lostItemInfoData.image2" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片2</span>
                            <Image :src="lostItemInfoData.image2" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                    <el-col v-if="lostItemInfoData.image3" :span="12">
                        <div class="base-item">
                            <span class="base-item-label">图片3</span>
                            <Image :src="lostItemInfoData.image3" :width="50" :height="30"></Image>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="ClubInfo">
import { type LostItemInfoData } from '@/api/admin/detail/detailApi'
import Image from '@/common/Image.vue';

const props = defineProps<{
    lostItemInfoData: LostItemInfoData
}>()
</script>
<style lang="scss"></style>
