<template>
  <div :class="bem.b()">
    <div :class="bem.e('content')" :style="{ paddingLeft: `${node.level * 16}px` }">
      <span :class="[
        bem.e('expand-icon'),
        { expanded: expanded && !node.isLeaf },
        bem.is('leaf', node.isLeaf)
      ]" @click='handleExpand'>
        <z-icon size="25">
          <Switcher v-if="!isLoading" />
          <Loading v-else />
        </z-icon>
      </span>
      <span>{{ node?.label }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Switcher from './icon/Switcher'
import ZIcon from '@zi-shui/components/icon'
import Loading from './icon/Loading'
import { treeNodeProps, treeNodeEmitts } from './tree'
import { createNamespace } from '@zi-shui/utils/create';
import { computed } from 'vue';
defineOptions({
  name: "treeNode"
});
const bem = createNamespace('tree-node')
const props = defineProps(treeNodeProps)
const emit = defineEmits(treeNodeEmitts)
function handleExpand() {
  emit('toggle', props.node)
}
const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node.key)
})
</script>
