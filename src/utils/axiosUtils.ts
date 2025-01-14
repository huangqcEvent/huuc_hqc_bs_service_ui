import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建一个新的 axios 实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 20000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前
    const userType = config.userType || 'user'; // 默认为 user

    let token;
    if (userType === 'admin') {
      token = localStorage.getItem('adminToken');
    } else if (userType === 'user') {
      token = localStorage.getItem('userToken');
    }

    if (token) {
      config.headers['Authorization'] = `${token}`;
    }

    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  function (error) {
    // 请求错误
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 如果响应数据中的 code 为 500 或 401，则返回错误信息
    if (response.data.code === 500 || response.data.code === 401 || response.data.code === 401) {
      ElMessage({
        message: response.data.msg || '服务器错误',
        type: 'error',
        dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
      });

      // 抛出错误以中断后续处理
      return Promise.reject(new Error(response.data.msg || '服务器错误'));
    } else if (response.data.code === 200) {
      if (response.data.data == null) {
        ElMessage({
          message: response.data.msg || '操作成功',
          type: 'success',
          dangerouslyUseHTMLString: true, // 允许使用 HTML 字符串
        });
      }
    }

    return response;
  },
  function (error) {
    // 响应错误
    // 可以在这里处理全局的错误
    ElMessage({
      message: '服务器错误',
      type: 'error',
    });
    return Promise.reject(error);
  }
);

export default instance;
