<template>
  <div class="form-container">
    <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="100px" class="confession-form">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">寻物</el-radio>
          <el-radio :label="2">寻主</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="物品名称" prop="itemName">
        <el-input v-model="form.itemName" placeholder="请输入物品名称" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <div class="image-uploads">
          <Upload @upload-success="getImage1"></Upload>
          <Upload @upload-success="getImage2"></Upload>
          <Upload @upload-success="getImage3"></Upload>
        </div>
      </el-form-item>
      <el-form-item label="丢失地点" prop="location">
        <el-input v-model="form.location" placeholder="请输入丢失地点" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入联系方式（电话）" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="详细描述" prop="itemDesc">
        <el-input type="textarea" placeholder="请输入详细描述" v-model="form.itemDesc" :rows="4" maxlength="100"
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Upload from '@/common/Upload.vue';
import type { LostItem } from '@/api/user/LostItemApi'
import { saveLostItem } from '@/api/user/LostItemApi';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const ruleFormRef = ref();

const form = reactive<LostItem>({
  itemName: '',
  type: null,
  itemDesc: '',
  location: '',
  phone: '',
  image1: '',
  image2: '',
  image3: '',
});

const rules = reactive({
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  itemName: [
    { required: true, message: '请输入物品名称', trigger: 'blur' },
    { max: 10, message: '物品名称最多10个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入丢失地点', trigger: 'blur' },
    { max: 10, message: '丢失地点最多10个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  itemDesc: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { max: 100, message: '详细描述最多100个字符', trigger: 'blur' }
  ]
});

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
  ruleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      saveLostItem(form).then((response) => {
        ElMessage.success(response.data.msg);
        router.push("/userIndex/notice");
      });
    } else {
      ElMessage.error('请填写必填项');
      return false;
    }
  });
};
</script>

<style scoped>
.confession-form {
  width: 100%;
  max-width: 1500px;
  height: 500px; /* 设置表单高度 */
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 当内容超出时显示垂直滚动条 */
}

.confession-form .el-form-item {
  margin-bottom: 20px;
}

.confession-form .el-form-item__label {
  white-space: nowrap;
  /* 防止文字换行 */
}

.confession-form .el-input,
.confession-form .el-textarea {
  width: 100%;
}

.confession-form .el-button {
  width: 100%;
}

.image-uploads {
  display: flex;
  gap: 10px;
}
</style>
