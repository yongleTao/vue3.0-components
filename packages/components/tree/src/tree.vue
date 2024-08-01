<template>
  <div :class="bem.b()">
    <zTreeNode :node="node" v-for="node in flattenTree" :key="node.key" :expanded="isExpanded(node)"
      @toggle="toggleExpand" />
  </div>
</template>

<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { treeProps, TreeNode, TreeOption } from './tree'
import { createNamespace } from '@zi-shui/utils/create';
import zTreeNode from './treeNode.vue'
defineOptions({
  name: "z-tree"
});
const bem = createNamespace('tree')

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
}, {
  immediate: true
})


// 希望将树结构拍平，点击能实现展开操作

// 需要展开的key有那些
const expandedKeysSet = ref(new Set(props.defaultCheckedKeys))
const flattenTree = computed(() => {
  const expandedKeys = expandedKeysSet.value // 要展开的keys有哪些
  // 最终拍平的节点
  const flattenNodes: TreeNode[] = [] // 这个就是拍平后的结果
  const nodes = tree.value || [] // 被格式化后的节点
  const stack: TreeNode[] = [] // 用于遍历树的栈  [40,30,31,32,41]
  // [40, 41]
  for (let i = nodes.length - 1; i >= 0; i--) {
    stack.push(nodes[i])
  }
  // [41,50,40,30]
  // 深度遍历
  while (stack.length) {
    const node = stack.pop()
    if (!node) continue
    flattenNodes.push(node)
    if (expandedKeys.has(node.key)) {
      const children = node.children // [30,31,32];
      if (children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i])
        }
      }
    }
  }
  return flattenNodes
})

function isExpanded(node: TreeNode): boolean {
  return expandedKeysSet.value.has(node.key)
}

// 折叠
function collpase(node: TreeNode) {
  return expandedKeysSet.value.delete(node.key)
}

// 展开
function expand(node: TreeNode) {
  return expandedKeysSet.value.add(node.key)
}

// 切换展开事件
function toggleExpand(node: TreeNode) {
  const expandKeys = expandedKeysSet.value
  if (expandKeys.has(node.key)) {
    collpase(node)
  } else {
    expand(node)
  }
}
</script>
