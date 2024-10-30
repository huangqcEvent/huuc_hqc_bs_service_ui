<template>
    <el-form :model="form" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive } from 'vue'
  
  const form = reactive({
    title: '',
    content: ''
  })
  
  const submitForm = () => {
    console.log('提交社团公告贴:', form)
  }
  </script>
  