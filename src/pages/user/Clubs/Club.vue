<template>
  <div class="home">
    <div class="content">
      <!-- 招募信息部分 -->
      <div class="recruitment-container">
        <div class="section-header">社团纳新</div>
        <div class="recruitment">
          <div class="filter-form">
            <el-form :model="filterForm1" inline>
              <el-form-item label="社团名称">
                <el-input v-model="filterForm1.clubName" placeholder="请输入社团名称" @input="fetchData1"></el-input>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="filterForm1.title" placeholder="请输入标题" @input="fetchData1"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="scroll-container">
            <el-card v-for="recruitment in clubList1" :key="recruitment.id" class="box-card">
              <div class="card-header">
                <div class="header-left">
                  <span>{{ recruitment.clubName }}</span>
                </div>
                <div class="header-right">
                  <el-tooltip v-if="recruitment.timeType === 2" effect="dark"
                    :content="`${recruitment.startTime} 至 ${recruitment.endTime}`" placement="top">
                    <el-tag type='danger'>
                      {{ recruitment.timeTypeName }}
                    </el-tag>
                  </el-tooltip>
                  <el-tag v-else type='success'>
                    {{ recruitment.timeTypeName }}
                  </el-tag>
                </div>
              </div>
              <el-divider />
              <div class="card-content">
                <h2>{{ recruitment.title }}</h2>
              </div>
              <el-divider />
              <div class="card-footer">
                <div class="footer-left">
                  <p class="recruitment-status">
                    已招人数: {{ recruitment.already }}/{{ recruitment.number }}
                  </p>
                </div>
                <div class="footer-right">
                  <p class="create-time">{{ recruitment.createTime }}</p>
                </div>
              </div>
            </el-card>
            <el-pagination background layout="prev, pager, next" :total="total1" :page-size="pageSize"
              v-model:current-page="pageNumber1" @current-change="fetchData1" />
          </div>
        </div>
      </div>

      <!-- 公告部分 -->
      <div class="announcements-container">
        <div class="section-header">社团公告</div>
        <div class="announcements">
          <div class="filter-form">
            <el-form :model="filterForm2" inline>
              <el-form-item label="社团名称">
                <el-input v-model="filterForm2.clubName" placeholder="请输入社团名称" @input="fetchData2"></el-input>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="filterForm2.title" placeholder="请输入标题" @input="fetchData2"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="scroll-container">
            <el-card v-for="announcement in clubList2" :key="announcement.id" class="box-card">
              <div class="card-header">
                <div class="header-left">
                  <span>{{ announcement.clubName }}</span>
                </div>
              </div>
              <el-divider />
              <div class="card-content">
                <h2>{{ announcement.title }}</h2>
              </div>
              <el-divider />
              <div class="card-footer">
                <div class="footer-right">
                  <p class="create-time">{{ announcement.createTime }}</p>
                </div>
              </div>
            </el-card>
            <el-pagination background layout="prev, pager, next" :total="total2" :page-size="pageSize"
              v-model:current-page="pageNumber2" @current-change="fetchData2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type ClubList, type ClubPage, pageQuery } from '@/api/user/Club';

// 接受数据
let clubList1 = ref<ClubList[]>([]);
let total1 = ref(0);

let clubList2 = ref<ClubList[]>([]);
let total2 = ref(0);

const pageSize = 6;
const pageNumber1 = ref(1);
const pageNumber2 = ref(1);

// 过滤条件表单
const filterForm1 = ref<ClubPage>({
  pageNumber: pageNumber1.value,
  pageSize: pageSize,
  clubName: '',
  title: '',
  type: 1,
  status: 1,
  timeType: null,
  createTimeStart: '',
  createTimeEnd: ''
});

const filterForm2 = ref<ClubPage>({
  pageNumber: pageNumber2.value,
  pageSize: pageSize,
  clubName: '',
  title: '',
  type: 2,
  status: 1,
  timeType: null,
  createTimeStart: '',
  createTimeEnd: ''
});

function fetchData1() {
  filterForm1.value.pageNumber = pageNumber1.value;
  pageQuery(filterForm1.value, 'user')
    .then((res) => {
      clubList1.value = res.data.data.list;
      total1.value = res.data.data.total;
    });
}

function fetchData2() {
  filterForm2.value.pageNumber = pageNumber2.value;
  pageQuery(filterForm2.value, 'user')
    .then((res) => {
      clubList2.value = res.data.data.list;
      total2.value = res.data.data.total;
    });
}

function clearFilters1() {
  filterForm1.value = {
    pageNumber: 1,
    pageSize: pageSize,
    clubName: '',
    title: '',
    type: 1,
    status: 1,
    timeType: null,
    createTimeStart: '',
    createTimeEnd: ''
  };
  pageNumber1.value = 1;
  fetchData1();
}

function clearFilters2() {
  filterForm2.value = {
    pageNumber: 1,
    pageSize: pageSize,
    clubName: '',
    title: '',
    type: 2,
    status: 1,
    timeType: null,
    createTimeStart: '',
    createTimeEnd: ''
  };
  pageNumber2.value = 1;
  fetchData2();
}

onMounted(() => {
  fetchData1();
  fetchData2();
});
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f7fa;
  color: #333;
  text-align: center;
}

.content {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 40px auto;
  gap: 20px;
}

.recruitment-container,
.announcements-container {
  flex: 1;
  margin: 0 10px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border: 2px solid #333;
  /* 增加边框宽度和颜色 */
}

.section-header {
  background-color: #f0f0f0;
  padding: 16px;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  color: #333;
}

.recruitment,
.announcements {
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow-y: auto;
}

.filter-form {
  margin-bottom: 20px;
}

.scroll-container {
  flex: 1;
  padding-bottom: 60px; /* 为分页条留出空间 */
  max-height: calc(100vh - 230px); /* 减去顶部横幅和过滤表单的高度 */
  overflow-y: auto;
}

.box-card {
  margin-bottom: 20px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;
  background-color: #fff;
}

.box-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-header,
.card-content,
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
}

.card-header {
  border-bottom: 1px solid #eee;
  height: 0px;
}

.card-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;

  h2 {
    font-size: 1.4em;
    margin-bottom: 10px;
    color: #333;
    font-weight: 600;
    text-align: center;
  }
}

.card-footer {
  border-top: 1px solid #eee;
  height: 0px;
}

.header-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.footer-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.footer-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.recruitment-status {
  font-size: 0.9em;
  color: #333;
  font-weight: bold;
}

.create-time {
  font-size: 0.8em;
  color: #999;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
  margin-left: 240px; /* 移除不必要的左边距 */
  position: absolute;
  bottom: 10px;
  width: 100%;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #f0f0f0;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.el-pagination.is-background .btn-next:hover,
.el-pagination.is-background .btn-prev:hover,
.el-pagination.is-background .el-pager li:hover {
  background-color: #ddd;
  color: #333;
}

.el-pagination.is-background .el-pager li.active {
  background-color: #409eff;
  color: #fff;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.4em;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
  text-align: center;
}

p {
  font-size: 0.9em;
  color: #666;
}
</style>
