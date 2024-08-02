import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue'

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
  disabled?: boolean
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
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
  sleectedKeys: {
    type: Array as PropType<key[]>
  },

  selectable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  }
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
  },
  selectedKeys: {
    type: Array as PropType<key[]>,
    default: () => []
  }
} as const
type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>

const treeNodeEmitts = {
  toggle: (node: TreeNode) => node,
  handleSelect: (node: TreeNode) => node
}
const treeEmits = {
  'update:sleectedKeys': (keys: key[]) => keys
}

interface TreeContext {
  slots: SetupContext['slots']
  // emit: SetupContext<typeof treeEmits>['emit']
}

// 此变量作为提供出去的属性
const treeNodeContentProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  }
}

const treeInjectKey = Symbol() as InjectionKey<TreeContext>
export {
  key,
  treeProps,
  TreeProps,
  TreeOption,
  TreeNode,
  treeNodeProps,
  treeNodeEmitts,
  treeEmits,
  TreeContext,
  treeInjectKey,
  treeNodeContentProps
}
