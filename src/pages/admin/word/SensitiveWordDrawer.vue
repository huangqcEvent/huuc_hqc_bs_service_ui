<!-- SensitiveWordDrawer.vue -->
<template>
    <el-drawer :model-value="showDrawer" title="违禁词管理" @click="getWord" direction="rtl" size="50%"
        @update:model-value="updateShowDrawer">
        <el-tabs v-model="localActiveTab" class="demo-tabs">
            <el-tab-pane label="黑名单" name="first">
                <!-- 黑名单表格 -->
                <div class="word-table">
                    <div v-for="(row, index) in chunkList(blackList, 4)" :key="index" class="word-row">
                        <div v-for="(item, subIndex) in row" :key="subIndex" class="word-cell"
                            @mouseenter="showDeleteButton(item.id, 'black')" @mouseleave="hideDeleteButton(item.id)">
                            <span>{{ item.sensitiveWord }}</span>
                            <el-button v-if="item.showDelete" type="danger" size="small"
                                @click="deleteBlackById(item.id, item.sensitiveWord)" class="delete-btn">删除</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="白名单" name="second">
                <!-- 白名单表格 -->
                <div class="word-table">
                    <div v-for="(row, index) in chunkList(whiteList, 4)" :key="index" class="word-row">
                        <div v-for="(item, subIndex) in row" :key="subIndex" class="word-cell"
                            @mouseenter="showDeleteButton(item.id, 'white')" @mouseleave="hideDeleteButton(item.id)">
                            <span>{{ item.sensitiveWord }}</span>
                            <el-button v-if="item.showDelete" type="danger" size="small"
                                @click="deleteWhiteById(item.id, item.sensitiveWord)" class="delete-btn">删除</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!-- 新增敏感词按钮 -->
        <el-button type="primary" @click="showAddWordForm = true">新增敏感词</el-button>

        <!-- 新增敏感词表单 -->
        <el-dialog title="新增敏感词" v-model="showAddWordForm" width="30%">
            <el-form label-width="100px" :rules="rules">
                <el-form-item label="类型">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">黑名单</el-radio>
                        <el-radio :label="2">白名单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="敏感词" prop="word" maxlength="10" show-word-limit>
                    <el-input v-model="form.word" placeholder="请输入敏感词"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showAddWordForm = false">取消</el-button>
                    <el-button type="primary" @click="addWord(form)">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { confirm } from '@/utils/confirmUtils';
import { deleteWhite, deleteBlack, saveWord } from '@/api/admin/user/userApi';

interface BlackList {
    id: string;
    sensitiveWord: string;
    showDelete?: boolean;
}

interface WhiteList {
    id: string;
    sensitiveWord: string;
    showDelete?: boolean;
}

const props = defineProps<{
    showDrawer: boolean;
    activeTab: string;
    blackList: BlackList[];
    whiteList: WhiteList[];
    getWord: () => void;
}>();

const emit = defineEmits<{
    (e: 'update:showDrawer', value: boolean): void;
    (e: 'update:activeTab', value: string): void;
}>();

const localActiveTab = ref(props.activeTab);

const rules = reactive({
    word: [
        { required: true, message: '词语不能为空', trigger: 'blur' },
        { max: 10, message: '词语不能超过10个字', trigger: 'blur' }
    ]
})
watch(
    () => props.activeTab,
    (newVal) => {
        localActiveTab.value = newVal;
    }
);

watch(
    localActiveTab,
    (newVal) => {
        emit('update:activeTab', newVal);
    }
);

const chunkList = (list: BlackList[] | WhiteList[], chunkSize: number) => {
    const result: (BlackList[] | WhiteList[])[] = [];
    for (let i = 0; i < list.length; i += chunkSize) {
        result.push(list.slice(i, i + chunkSize));
    }
    return result;
};

// 删除黑名单
function deleteBlackById(id: string, word: string) {
    confirm("确定删除黑名单词汇" + "‘" + word + "’" + "吗？", () => {
        deleteBlack(id).then(() => {
            ElMessage.success('删除成功')
            props.getWord()
        })
    }, () => {
        console.log('取消退出');
    })
}

// 删除白名单
function deleteWhiteById(id: string, word: string) {
    confirm("确定删除白名单词汇" + "‘" + word + "’" + "吗？", () => {
        deleteWhite(id).then(() => {
            ElMessage.success('删除成功')
            props.getWord()
        })
    }, () => {
        console.log('取消退出');
    })
}

function updateShowDrawer(value: boolean) {
    emit('update:showDrawer', value);
}

// 新增敏感词表单相关
const showAddWordForm = ref(false);
const form = ref({
    type: '',
    word: ''
});

// 新增敏感词
function addWord(param: any) {
    saveWord(param).then(() => {
        ElMessage.success('新增成功');
        showAddWordForm.value = false;
        props.getWord(); // 刷新列表
        form.value = {
            type: '',
            word: ''
        }
    }).catch(() => {
        ElMessage.error('新增失败');
    });
}

// 显示删除按钮
function showDeleteButton(id: string, type: string) {
    if (type === 'black') {
        const index = props.blackList.findIndex(item => item.id === id);
        if (index !== -1) {
            props.blackList[index].showDelete = true;
        }
    } else if (type === 'white') {
        const index = props.whiteList.findIndex(item => item.id === id);
        if (index !== -1) {
            props.whiteList[index].showDelete = true;
        }
    }
}

// 隐藏删除按钮
function hideDeleteButton(id: string) {
    const blackIndex = props.blackList.findIndex(item => item.id === id);
    if (blackIndex !== -1) {
        props.blackList[blackIndex].showDelete = false;
    }

    const whiteIndex = props.whiteList.findIndex(item => item.id === id);
    if (whiteIndex !== -1) {
        props.whiteList[whiteIndex].showDelete = false;
    }
}
</script>

<style scoped>
.word-table {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 4列布局 */
    gap: 10px;
    padding: 10px;
}

.word-cell {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    font-size: 14px;
    position: relative;
}

.delete-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: none;
}

.word-cell:hover .delete-btn {
    display: inline-block;
}

@media (max-width: 768px) {
    .word-table {
        grid-template-columns: repeat(2, 1fr);
        /* 小屏幕下 2列布局 */
    }
}
</style>