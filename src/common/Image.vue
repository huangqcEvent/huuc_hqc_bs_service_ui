<template>
  <div v-bind="$attrs" class="norImg">
    <img
      :src="props.src"
      alt="img"
      :width="props.width"
      :height="props.height"
    />
    <!-- 放大按钮 -->
    <div class="toBig" @click="showImg">
      <svg
        t="1718433997569"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2426"
        width="20"
        height="20"
      >
        <path
          d="M800 163H226.2c-52.8 0-95.6 42.8-95.6 95.6v573.8c0 52.8 42.8 95.6 95.6 95.6H800c52.8 0 95.6-42.8 95.6-95.6V258.6c0-52.8-42.8-95.6-95.6-95.6zM465.3 832.4H250.8c-6.7 0-12.7-2.8-17-7.2-4.6-3.9-7.5-9.6-7.5-16.7V593.3c0-13.2 10.7-23.9 23.9-23.9s23.9 10.7 23.9 23.9l-0.8 157.2 162.3-162.3 33.8 33.8-162.6 162.6h158.5c13.2 0 23.9 10.7 23.9 23.9s-10.7 23.9-23.9 23.9zM800 497.7c0 13.2-10.7 23.9-23.9 23.9s-23.9-10.7-23.9-23.9l0.8-157.2-162.4 162.3-33.8-33.8 162.5-162.5H560.8c-13.2 0-23.9-10.7-23.9-23.9s10.7-23.9 23.9-23.9h214.5c6.7 0 12.7 2.8 17 7.2 4.6 3.9 7.6 9.6 7.6 16.7v215.1z"
          fill="#140202"
          p-id="2427"
        ></path>
      </svg>
    </div>
  </div>
  <div class="fullImg" v-if="isScreen">
    <img :src="props.src" alt="img" class="fullImg-img" />
    <div class="toSmall" @click="showImg">
      <svg
        t="1718433997569"
        class="icon2"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2426"
        width="50"
        height="50"
      >
        <path
          d="M810.2 130.2H211.1c-55.1 0-99.8 44.7-99.8 99.8v599.1c0 55.1 44.7 99.8 99.8 99.8h599.1c55.1 0 99.8-44.7 99.8-99.8v-599c0-55.2-44.7-99.9-99.8-99.9z m-324.5 674c0 13.8-11.2 25-25 25s-25-11.2-25-25l0.8-164.1-169.4 169.4-35.3-35.3 169.7-169.7H236c-13.8 0-25-11.2-25-25s11.2-25 25-25h223.9c7 0 13.3 2.9 17.8 7.5 4.8 4.1 7.9 10.1 7.9 17.5v224.7z m299.5-299.6H561.3c-7 0-13.3-2.9-17.8-7.5-4.8-4.1-7.9-10.1-7.9-17.5V255c0-13.8 11.2-25 25-25s25 11.2 25 25l-0.8 164.1 169.4-169.4 35.3 35.3-169.8 169.7h165.5c13.8 0 25 11.2 25 25s-11.2 24.9-25 24.9z"
          fill="#140202"
          p-id="2427"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: "src/assets/back.png",
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
});

// 是否大屏展示
const isScreen = ref<boolean>(false);

// 点击展示
const showImg = () => {
  isScreen.value = !isScreen.value;
};
</script>

<style scoped>
.fullImg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fullImg-img {
  max-width: 80%; /* 设置最大宽度 */
  max-height: 80%; /* 设置最大高度 */
  object-fit: contain; /* 保持图片比例 */
}

.norImg {
  position: relative;
  width: auto;
  height: auto;
}

.toBig {
  display: none;
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
}

.norImg:hover .toBig {
  display: block;
}

.toSmall {
  display: block;
  position: absolute;
  top: 100px;
  right: 50px;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.icon2:hover path {
  fill: #fff;
}
</style>
