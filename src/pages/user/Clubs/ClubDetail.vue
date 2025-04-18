<template>
    <div>
        <el-page-header @back="goBack">
            <template #content>
                <span class="text-large font-600 mr-3">来自 {{ clubDetail?.clubName }} 的 {{ clubDetail?.typeName }}贴</span>
            </template>
        </el-page-header>
        <div class="card-detail-container">
            <div v-if="clubDetail" class="card-detail">
                <h1>{{ clubDetail.title }}</h1>
                <div class="user-info">
                    <img v-if="clubDetail.clubHead" :src="clubDetail.clubHead" alt="User Head" class="user-head">
                    <p><strong>社团名称:</strong> {{ clubDetail.clubName }}</p>
                </div>
                <template v-if="clubDetail.type === 1">
                    <p><strong>社团工作:</strong> {{ clubDetail.daily }}</p>
                    <p><strong>社团福利:</strong> {{ clubDetail.welfare }}</p>
                    <p><strong>社团要求:</strong> {{ clubDetail.claim }}</p>
                    <p><strong>招新计划: {{ clubDetail.already }} / {{ clubDetail.number }}</strong></p>
                    <p><strong>时间类型:</strong> {{ clubDetail.timeTypeName }}</p>
                    <template v-if="clubDetail.timeType === 2">
                        <p><strong>时间范围:</strong> {{ clubDetail.startTime }} 至 {{ clubDetail.endTime }}</p>
                    </template>
                </template>
                <template v-else-if="clubDetail.type === 2">
                    <p><strong>公告内容:</strong> {{ clubDetail.claim }}</p>
                </template>
                <p><strong>创建时间:</strong> {{ clubDetail.createTime }}</p>
                <div class="image-container">
                    <Image v-for="(image, index) in images" :key="index" :src="image" :width="200" class="image" />
                </div>
                <div class="action-buttons">
                    <el-button @click="handleLike" :type="isLiked ? 'success' : 'default'">
                        <font-awesome-icon :icon="['fas', 'thumbs-up']" />
                        点赞
                    </el-button>
                    <el-button @click="handleCollect" :type="isFavored ? 'warning' : 'default'">
                        <font-awesome-icon :icon="['fas', 'star']" />
                        收藏
                    </el-button>
                </div>
            </div>
            <div v-else class="loading">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>
        </div>
        <ElButton v-if="clubDetail?.type == 1" @click="toSetMy" class="showButton">投递简历</ElButton>
        <ElButton @click="toggleComments" class="showButton">查看评论</ElButton>
        <CommentComponent :postId="id" :isShow="isShow" :postType=3 @update:isShow="isShow = $event" />
        <el-dialog title="投递简历" width="50%" v-model="myFile" @close="handleClose">
            <el-form :model="form" :rules="rules" label-width="100px" class="confession-form" ref="formRef">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入姓名" maxlength="3" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="form.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年级" prop="grade">
                    <el-select v-model="form.grade" placeholder="请选择年级" size="large" style="width: 240px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="form.age" placeholder="请输入年龄" maxlength="2" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="专业" prop="specialized">
                    <el-input v-model="form.specialized" placeholder="请输入专业" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone" type="phone">
                    <el-input v-model="form.phone" placeholder="请输入电话" maxlength="11" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="简历" prop="file">
                    <el-upload v-model:file-list="fileList" class="upload-demo"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :on-change="handleChange"
                        :auto-upload="false">
                        <el-button type="primary">点击上传简历</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                请上传pdf格式的简历
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type Detail, getDetailById, addResume  } from '@/api/user/Club';
import Image from '@/common/Image.vue';
import { ElButton, ElMessage, type UploadProps, type UploadUserFile, type FormInstance } from 'element-plus';
import {likedOrCollect} from "@/api/commonApi/commonApi";
import CommentComponent from '@/common/CommentComponent.vue';
import '@/styles/cardDetail.scss';
import { upload } from '@/api/commonApi/commonApi'; // 引入上传函数

const route = useRoute();
const router = useRouter();

const options = [
    {
        value: '1',
        label: '大一',
    },
    {
        value: '2',
        label: '大二',
    },
    {
        value: '3',
        label: '大三',
    },
    {
        value: '4',
        label: '大四',
    },
    {
        value: '5',
        label: '研究生',
    },
];

const id = ref<string>('');
const clubDetail = ref<Detail | null>(null);
const isShow = ref(false);
const myFile = ref(false);
const isLiked = ref<number>(0);
const isFavored = ref<number>(0);

const toggleComments = () => {
    isShow.value = !isShow.value;
};

const toSetMy = () => {
    myFile.value = !myFile.value;
};

const goBack = () => {
    router.back();
};

const images = computed(() => {
    return [clubDetail.value?.image1, clubDetail.value?.image2, clubDetail.value?.image3].filter(Boolean);
});

onMounted(() => {
    id.value = route.params.id as string;
    getDetailById(id.value)
        .then((response) => {
            clubDetail.value = response.data.data;
          isLiked.value = clubDetail.value?.isLiked?clubDetail.value?.isLiked:0;
          isFavored.value = clubDetail.value?.isFavored?clubDetail.value?.isFavored:0;
        })
        .catch((error) => {
            console.error('获取详情数据失败:', error);
            ElMessage.error('加载社团详情失败，请稍后再试。');
        });
});

const fileList = ref<UploadUserFile[]>([]);

const form = reactive({
    name: '',
    age: '',
    sex: 1, // 默认选中“男”
    specialized: '',
    phone: '',
    grade: '',
    file: '' // 用于存储上传文件的URL或ID
});

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    fileList.value = uploadFiles.slice(-1); // 限制最多上传1个文件
    if (fileList.value.length > 0) {
        form.file = fileList.value[0].name; // 更新文件名到表单中
    }
};

const rules = reactive({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    age: [
        { required: true, message: '请输入年龄', trigger: 'blur' }
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'blur' }
    ],
    specialized: [
        { required: true, message: '请输入专业', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入电话', trigger: 'blur' }
    ],
    grade: [
        { required: true, message: '请输入年级', trigger: 'blur' }
    ],
    file: [
        { required: true, message: '请上传简历', trigger: 'change' }
    ]
});

const formRef = ref<FormInstance | null>(null);

const submitForm = async () => {
    if (!formRef.value) return;

    // 进行表单验证
    const isValid = await formRef.value.validate();
    if (!isValid) {
        ElMessage.error('请填写所有必填项');
        return;
    }

    if (fileList.value.length === 0) {
        ElMessage.error('请上传简历');
        return;
    }

    // 获取文件
    const file = fileList.value[0].raw;
    if (!file) {
        ElMessage.error('文件获取失败');
        return;
    }

    // 调用上传函数
    try {
        const response = await upload(file);
        if (response.status === 200) {
            form.file = response.data.msg; // 假设上传成功后返回文件的URL或ID
            const formData = {
                'name': form.name,
                'age': form.age,
                'sex': form.sex.toString(),
                'specialized': form.specialized,
                'phone': form.phone,
                'grade': form.grade,
                'fileAddress': form.file,
                'clubNewsId': clubDetail.value?.id
            };
            // 假设有一个提交表单的API
            await addResume(formData);
            handleClose();
        }
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败，请稍后再试。');
    }
};

const handleClose = () => {
    myFile.value = false;
    fileList.value = []; // 清空文件列表
    formRef.value?.resetFields(); // 重置表单
    form.file = ''; // 重置文件字段
};

const handleLike = async () => {
    if (!clubDetail.value) return;

    try {
        const response = await likedOrCollect({
          id: clubDetail.value.id,
          postType: 3,
          status: isLiked.value===0 ? 1 : 0,
          updateType: 1
        });
        if (response.status === 200) {
          isLiked.value = isLiked.value===0 ? 1 : 0
        }
    } catch (error) {
        ElMessage.error('点赞失败，请稍后再试。');
    }
};

const handleCollect = async () => {
    if (!clubDetail.value) return;

    try {
        const response = await likedOrCollect({
          id: clubDetail.value.id,
          postType: 3,
          status: isFavored.value===0 ? 1 : 0,
          updateType: 2
        });
        if (response.status === 200) {
          isFavored.value = isFavored.value===0 ? 1 : 0
        }
    } catch (error) {
        ElMessage.error('收藏失败，请稍后再试。');
    }
};
</script>

