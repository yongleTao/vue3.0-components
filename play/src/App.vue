<template>
  <!-- <z-icon color="red" :size="22">
    <Add></Add>
  </z-icon> -->


  <!-- <z-tree :data="data" :onLoad="handleLoad" v-model:sleected-keys="value" selectable multiple>
    <template #default="{ node }">{{ node.key }} {{ node.label }}</template>
</z-tree> -->

  <z-button size="medium" type="danger" :round="true" :loading="true" :disabled="true">按钮
    <template #icon>
      <z-icon>
        <Add></Add>
      </z-icon>
    </template>
  </z-button>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { TreeOption, key } from '@zi-shui/components/tree/src/tree'
import { Add } from '@vicons/ionicons5'
defineOptions({
  name: "App"
});
function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(20 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      label: createLabel(level), // 显示的内容
      key, // 为了唯一性
      children: createData(level - 1, key) // 孩子
    }
  })
}
const value = ref<key[]>(['40'])
function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}
function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}
// const data = ref<TreeOption[]>([
//   {
//     key: '0',
//     label: '0',
//     children: [
//       {
//         key: '0-0',
//         label: '0-0'
//       },
//       {
//         disabled: true,
//         key: '0-1',
//         label: '0-1',
//         children: [
//           {
//             label: '0-1-0',
//             key: '0-1-0'
//           },
//           {
//             label: '0-1-1',
//             key: '0-1-1'
//           }
//         ]
//       }
//     ]
//   }
// ])
// function createData() {
//   return [
//     {
//       label: nextLabel(),
//       key: 1,
//       isLeaf: false
//     },
//     {
//       label: nextLabel(),
//       key: 2,
//       isLeaf: false
//     }
//   ]
// }
const handleLoad = (node: TreeOption) => {
  // 每次实现懒加载时，会触发此方法，将当前点击的node传入
  return new Promise<TreeOption[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ])
    }, 1000)
  })

}
const data = ref(createData())

</script>


<style scoped></style>