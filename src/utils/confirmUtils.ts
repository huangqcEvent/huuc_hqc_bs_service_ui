// utils/confirm.ts
import { ElMessageBox } from 'element-plus';

export function confirm(msg:string ,onConfirm: () => void, onCancel: () => void) {
  ElMessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    onConfirm(); // 用户点击了确定按钮
  }).catch(() => {
    onCancel(); // 用户点击了取消按钮或关闭了对话框
  });
}
