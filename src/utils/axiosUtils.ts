import axios from 'axios';

// 创建一个新的 axios 实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    //在发送请求之前
    const token = localStorage.getItem('token');
    config.headers['Content-Type'] = 'application/json';
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
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
     // 如果响应数据中的 code 为 500，则返回错误信息
     if (response.data.code === 500 || response.data.code === 401) {
      alert(response.data.msg);
    }
    return response;
  },
  function (error) {
    // 响应错误
    // 可以在这里处理全局的错误
    console.error('请求失败:', error);
    return Promise.reject(error);
  }
);

export default instance;
