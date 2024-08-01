import { ExtractPropTypes, PropType } from 'vue'

type key = string | number

interface TreeNode extends Required<TreeOption> {
  level: number
  rawNode: TreeOption
  children: TreeNode[]
  isLeaf: boolean
}

interface TreeOption {
  label?: key
  key?: key
  isLeaf: boolean
  children?: TreeOption[]
  [key: string]: unknown // 任意接口
}

const treeProps = {
  // props是只读的
  data: {
    type: Array as PropType<TreeOption[]>,
    required: true,
    default: () => []
  },
  labelField: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  defaultCheckedKeys: {
    type: Array as PropType<key[]>,
    default: () => []
  },
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>
} as const

const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  },
  expanded: {
    type: Boolean,
    required: true
  },
  loadingKeys: {
    type: Object as PropType<Set<key>>
  }
} as const
type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>

const treeNodeEmitts = {
  toggle: (node: TreeNode) => node
}

export {
  key,
  treeProps,
  TreeProps,
  TreeOption,
  TreeNode,
  treeNodeProps,
  treeNodeEmitts
}
