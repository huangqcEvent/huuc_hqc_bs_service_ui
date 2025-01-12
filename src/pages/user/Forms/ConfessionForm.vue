<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="confession-form">
    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="form.type">
        <el-radio value="1">表白</el-radio>
        <el-radio value="0">找对象</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入标题" maxlength="10" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="概要" prop="summary">
      <el-input v-model="form.summary" placeholder="请输入概要" maxlength="20" show-word-limit></el-input>
    </el-form-item>
    <el-form-item :label="form.type == 1 ? '描述' : '期望'" prop="toUserInfo">
      <el-input v-model="form.toUserInfo" :placeholder="'请输入对他(她)的' + (form.type == 1 ? '描述' : '期望')" maxlength="25"
        show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input type="textarea" v-model="form.content" placeholder="请输入内容" rows="5" maxlength="1000"
        show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="是否匿名" prop="isAnonymous">
      <el-radio-group v-model="form.isAnonymous">
        <el-radio value="1">是</el-radio>
        <el-radio value="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否公开" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio value="1">公开</el-radio>
        <el-radio value="2">私密</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="图片">
      <div class="image-uploads">
        <Upload @upload-success="getImage1"></Upload>
        <Upload @upload-success="getImage2"></Upload>
        <Upload @upload-success="getImage3"></Upload>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import Upload from '@/common/Upload.vue';
import { saveConfession } from '@/api/user/ConfessionWallApi';
import '@/styles/userForm.scss'

const router = useRouter();

const form = reactive({
  title: '',
  content: '',
  summary: '',
  toUserInfo: '',
  isAnonymous: 0,
  type: 0,
  status: 1,
  image1: '',
  image2: '',
  image3: ''
})

const rules = reactive({
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { max: 10, message: '标题不能超过10个字', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '概要不能为空', trigger: 'blur' },
    { max: 20, message: '概要不能超过20个字', trigger: 'blur' }
  ],
  toUserInfo: [
    { required: true, message: '对他(她)的描述不能为空', trigger: 'blur' },
    { max: 25, message: '描述不能超过25个字', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { max: 1000, message: '内容不能超过1000个字', trigger: 'blur' }
  ],
  isAnonymous: [
    { required: true, message: '请选择是否匿名', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择是否公开', trigger: 'change' }
  ],
})

const getImage1 = (result: string) => {
  form.image1 = result;
};

const getImage2 = (result: string) => {
  form.image2 = result;
};

const getImage3 = (result: string) => {
  form.image3 = result;
};

const submitForm = () => {
  saveConfession(form).then((response) => {
    ElMessage.success(response.data.msg)
    router.push("/userIndex/confessionWall")
  }).catch(
    (response) => {
      ElMessage.success(response.data.msg)
    }
  )
}
// 确保返回 void
</script>