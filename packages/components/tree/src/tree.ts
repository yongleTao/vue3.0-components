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
  }
} as const

type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>

export { treeProps, TreeProps, TreeOption, TreeNode }
