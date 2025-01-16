<template>
  <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="100px" class="confession-form">
    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="form.type">
        <el-radio :label=1>纳新</el-radio>
        <el-radio :label=2>公告</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入标题" maxlength="10" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="是否公开" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio value=1>公开</el-radio>
        <el-radio value=2>私密</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="form.type === 1">
      <el-form-item label="社团工作" prop="daily">
        <el-input type="textarea" v-model="form.daily" placeholder="请输入社团工作" maxlength="1000"
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="招新要求" prop="claim">
        <el-input type="textarea" v-model="form.claim" placeholder="请输入招新要求" maxlength="1000"
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="社团福利" prop="welfare">
        <el-input type="textarea" v-model="form.welfare" placeholder="社团福利" maxlength="1000" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="计划纳新人数" prop="number">
        <el-input v-model="form.number" placeholder="请输入计划纳新人数" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="招聘计划" prop="timeType">
        <el-radio-group v-model="form.timeType">
          <el-radio :label=1>长期</el-radio>
          <el-radio :label=2>限时</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.timeType === 2">
        <el-form-item label="起始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择起始时间" format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="终止时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择终止时间" format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </template>
    </template>
    <template v-else-if="form.type === 2">
      <el-form-item label="公告内容" prop="claim">
        <el-input type="textarea" v-model="form.claim" placeholder="请输入公告内容" maxlength="1000"
          show-word-limit></el-input>
      </el-form-item>
    </template>
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
import { reactive, ref } from 'vue'
import '@/styles/userForm.scss'
import Upload from '@/common/Upload.vue';
import type { Club } from '@/api/user/Club';
import { save } from '@/api/user/Club';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const form = reactive<Club>({
  title: '',
  type: null,
  daily: undefined,
  welfare: undefined,
  claim: '',
  number: undefined,
  timeType: undefined,
  startTime: undefined,
  endTime: undefined,
  status: null
})

const router = useRouter();
const ruleFormRef = ref();

const rules = reactive({
  type: [
    { required: true, message: '请选择类型', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { max: 10, message: '标题不能超过10个字', trigger: 'blur' }
  ],
  daily: [
    { required: true, message: '社团工作不能为空', trigger: 'blur' },
    { max: 1000, message: '社团工作不能超过1000个字', trigger: 'blur' }
  ],
  welfare: [
    { required: true, message: '社团福利不能为空', trigger: 'blur' },
    { max: 1000, message: '社团福利不能超过1000个字', trigger: 'blur' }
  ],
  claim: [
    { required: true, message: '社团要求不能为空', trigger: 'blur' },
    { max: 1000, message: '社团要求不能超过1000个字', trigger: 'blur' }
  ],
  number: [
    { required: true, message: '计划纳新人数不能为空', trigger: 'blur' },
    { max: 3, message: '计划纳新人数不能超过3个字符', trigger: 'blur' }
  ],
  timeType: [
    { required: true, message: '请选择时间类型', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '起始时间不能为空', trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '终止时间不能为空', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择是否公开', trigger: 'blur' }
  ]
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
  ruleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      save(form).then(() => {
        router.push("/userIndex/club");
      })
    } else {
      ElMessage.error('请填写必填项');
      return false;
    }
  });
};
</script>