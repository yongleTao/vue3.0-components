<template>
  <div :class="bem.b()">
    <z-virtualList :items="flattenTree" :remain="8" :size="35">
      <template #default="{ node }">
        <zTreeNode :node="node" :key="node.key" :expanded="isExpanded(node)" @toggle="toggleExpand"
          :loadingKeys='loadingKeysRef' @handleSelect='hadleSelect' :selectedKeys="selectedKeys" />
      </template>

    </z-virtualList>



  </div>
</template>

<script setup lang='ts'>
import { computed, provide, ref, useSlots, watch } from 'vue';
import { treeProps, TreeNode, TreeOption, key, treeEmits, treeInjectKey } from './tree'
import { createNamespace } from '@zi-shui/utils/create';
import zTreeNode from './treeNode.vue'
import ZVirtualList from '@zi-shui/components/virtualList'
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

// 默认展开的节点
function isExpanded(node: TreeNode): boolean {
  return expandedKeysSet.value.has(node.key)
}

const loadingKeysRef = ref(new Set<key>())

function triggerLoading(node: TreeNode) {
  if (!node.children.length && !node.isLeaf) {
    const loadingKeys = loadingKeysRef.value
    const { onLoad } = props


    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key)
      if (onLoad) {
        onLoad(node.rawNode).then((children: TreeOption[]) => {
          node.rawNode.children = children
          node.children = createTree(children, node)
          loadingKeys.delete(node.key)
        })
      }
    }
  }
}

// 折叠
function collpase(node: TreeNode) {
  return expandedKeysSet.value.delete(node.key)
}

// 展开
function expand(node: TreeNode) {
  expandedKeysSet.value.add(node.key)
  triggerLoading(node)
}

// 切换展开事件
function toggleExpand(node: TreeNode) {
  const expandKeys = expandedKeysSet.value
  // 如果当前这个节点 正在加载中，不能收起
  if (expandKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collpase(node)
  } else {
    expand(node)
  }
}


// 实现选中节点
const emit = defineEmits(treeEmits)
const selectedKeys = ref<key[]>([])

watch(() => props.sleectedKeys, value => {
  if (value !== undefined) {
    selectedKeys.value = value
  }
}, { immediate: true })

function hadleSelect(node: TreeNode) {
  let keys = Array.from(selectedKeys.value)
  if (!props.selectable) return
  if (props.multiple) {
    const index = keys.findIndex(key => key === node.key)
    if (index > -1) {
      keys.splice(index, 1)
    } else {
      keys.push(node.key)
    }
  } else {
    if (keys.includes(node.key)) {
      keys = []
    } else {
      keys = [node.key]
    }
  }
  emit('update:sleectedKeys', keys)
}
provide(treeInjectKey, {
  slots: useSlots()
})
</script>
