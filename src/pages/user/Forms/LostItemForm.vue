<template>
    <el-form :model="form" label-width="100px">
      <el-form-item label="物品名称">
        <el-input v-model="form.itemName"></el-input>
      </el-form-item>
      <el-form-item label="丢失地点">
        <el-input v-model="form.location"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive } from 'vue'
  
  const form = reactive({
    itemName: '',
    location: ''
  })
  
  const submitForm = () => {
    console.log('提交寻物贴:', form)
  }
  </script>
  