<template>
  <div class="Tree">
    <h2>Tree</h2>
  </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { treeProps, TreeNode, TreeOption } from './tree'
defineOptions({
  name: "z-tree"
});


const props = defineProps(treeProps)
// 有了props要对用户的数据进行格式化，格式化一个固定的结果
// label,key,children
const tree = ref<TreeNode[]>([])



function createOptions(key: string, label: string, children: string) {
  return {
    getKey(node: TreeOption) {
      return node[key] as string
    },
    getLabel(node: TreeOption) {
      return node[label] as string
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]
    }
  }
}

const treeOptions = createOptions(
  props.keyField,
  props.labelField,
  props.childrenField
)


function createTree(data: TreeOption[], parent: TreeNode | null = null) {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map(node => {
      const children = treeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [], // 默认为空
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        // 判断节点是否自带isLeaf 如果自带了 以自带的为准，如果没有自带的则看一下有没有children属性
        // 对 ||的增强操作  ?.  ??
        isLeaf: node.isLeaf ?? children.length == 0,
        disabled: !!node.disabled // 添加disabled属性
      }
      if (children.length > 0) {
        // 有孩子再去递归孩子，将其格式化成treeNode类型
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }
  const result: TreeNode[] = traversal(data, parent)
  return result
}
//  监控数据的变化，调用格式化方法。一上来格式化一次
watch(() => props.data, (newval: TreeOption[]) => {
  tree.value = createTree(newval)
  console.log(tree.value)
}, {
  immediate: true
})
</script>
