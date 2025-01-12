<template>
    <div class="upload">
        <el-upload name="file" class="avatar-uploader" action="/api/common/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="image" :src="image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
    </div>
</template>

<script setup lang="ts" name="Upload">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';

const image = ref('');
const emit = defineEmits(['upload-success']);

const handleAvatarSuccess = (
    response: any,
    uploadFile: any
) => {
    console.log('response', response);
    image.value = response.msg;
    console.log('uploadFile', uploadFile);
    emit('upload-success', response.msg); // 触发自定义事件并传递结果
};

// 上传文件时做的处理
const beforeAvatarUpload = (rawFile: any) => {
    console.log("rawFile", rawFile);
    console.log(rawFile.type);
    console.log(rawFile.size / 1024 / 1024);

    if (rawFile.type.split("/")[0] !== 'image') {
        alert('不是图片！');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
        alert('头像图片大小不能超过2MB！');
        return false;
    }
    return true;
};
</script>

<style scoped lang="scss">
.upload {
    display: flex;
    align-items: center; /* 文本和上传区域垂直居中 */
}

.text {
    margin-right: 10px; /* 文本与上传区域之间的间距 */
}

.avatar-uploader {
    border: 2px dashed var(--el-border-color);
    border-radius: 10px; /* 增加圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 180px; /* 统一宽度 */
    height: 180px; /* 统一高度 */
    background-color: white; /* 设置背景颜色为白色 */
    margin: 0 auto; /* 居中 */
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary); /* 鼠标悬停时改变边框颜色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 鼠标悬停时加深阴影 */
}

/* 中间虚线十字 */
.avatar-uploader .el-upload::before,
.avatar-uploader .el-upload::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%; /* 虚线的长度 */
    height: 1px; /* 虚线的厚度 */
    background-color: var(--el-border-color);
    border-style: dashed;
    border-width: 1px;
}

.avatar-uploader .el-upload::after {
    transform: translate(-50%, -50%) rotate(90deg);
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 10px; /* 图片圆角 */
    object-fit: cover; /* 图片填充整个区域 */
    object-position: center; /* 图片居中 */
}
</style>
