<template>
    <div
            @click.stop="handleClick"
            v-show="node.visible">
        <div
                :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px', fontSize: tree.fontSize + 'px', lineHeight: (tree.fontSize * 2 - 1) + 'px'}">
      <span :class="arrowClasses" @click.stop="handleExpandIconClick">
          <Icon v-if="!node.isLeaf" type="ios-arrow-forward"></Icon>
      </span>
            <Checkbox
                    v-if="showCheckbox"
                    :value="node.checked"
                    :indeterminate="node.indeterminate"
                    :disabled="!!node.disabled"
                    @click.native.stop
                    @on-change="handleCheckChange"></Checkbox>
            <span
                    v-if="node.loading"
                    class="ivu-load-loop">
      </span>
            <node-content v-if="$parent.renderContent" :node="node"></node-content>
            <span v-else>
        <span v-if="!showCheckbox">&nbsp;</span>
        <Icon v-if="tree.showIcon" :size="tree.iconSize"
              :type="node.childNodes.length > 0 ? tree.parentIcon : tree.leafIcon"></Icon>
        <span :class="titleClasses" @click="handleSelect">{{node.label}}</span>
      </span>
        </div>
        <collapse-transition>
            <div
                    v-show="expanded">
                <el-tree-node
                        :render-content="renderContent"
                        v-for="child in node.childNodes"
                        :key="getNodeKey(child)"
                        :node="child"
                        @node-expand="handleChildNodeExpand">
                </el-tree-node>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
  import CollapseTransition from 'iview/src/components/base/collapse-transition';
  import emitter from 'iview/src/mixins/emitter';

  const prefixCls = 'ivu-tree';

  export default {
    name: 'ElTreeNode',

    componentName: 'ElTreeNode',

    mixins: [emitter],

    props: {
      node: {
        default() {
          return {};
        }
      },
      props: {},
      renderContent: Function,
      /* parentIcon: {
         type: String,
         default: ''
       },
       leafIcon: {
         type: String,
         default: ''
       },
       showIcon: {
         type: Boolean,
         default: false
       }*/
    },

    computed: {
      classes() {
        return [
          `${prefixCls}-children`
        ];
      },
      arrowClasses() {
        return [
          `${prefixCls}-arrow`,
          {
            [`${prefixCls}-arrow-disabled`]: this.node.disabled,
            [`${prefixCls}-arrow-open`]: this.node.expanded
          }
        ];
      },
      titleClasses() {
        // 点击节点设置选中的时候不需要高亮
        return this.showCheckbox && this.tree.checkOnClickNode ? ['node_click'] : [
          `${prefixCls}-title`,
          {
            [`${prefixCls}-title-selected`]: this.node.selected
          }
        ];
      },
    },

    components: {
      CollapseTransition,
      NodeContent: {
        props: {
          node: {
            required: true
          }
        },
        render(h) {
          const parent = this.$parent;
          const node = this.node;
          const data = node.data;
          const store = node.store;
          return (
            parent.renderContent.call(parent._renderProxy, h, {_self: parent.tree.$vnode.context, node, data, store})
          );
        }
      }
    },

    data() {
      return {
        tree: null,
        expanded: false,
        childNodeRendered: false,
        showCheckbox: false,
        oldChecked: null,
        oldIndeterminate: null
      };
    },

    watch: {
      'node.indeterminate'(val) {
        this.handleSelectChange(this.node.checked, val);
      },

      'node.checked'(val) {
        this.handleSelectChange(val, this.node.indeterminate);
      },

      'node.expanded'(val) {
        this.expanded = val;
        if (val) {
          this.childNodeRendered = true;
        }
      }
    },

    methods: {
      handleSelect() {
        if (this.node.disabled) return;
        if (this.tree.showCheckbox && this.tree.checkOnClickNode) {
          this.node.setChecked(!this.node.checked, !this.tree.checkStrictly);
        } else {
          this.dispatch('ChuTree', 'on-selected', this.node);
        }
      },
      getNodeKey(node, index) {
        const nodeKey = this.tree.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },

      handleSelectChange(checked, indeterminate) {
        if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
          this.tree.$emit('check-change', this.node.data, checked, indeterminate);
        }
        this.oldChecked = checked;
        this.indeterminate = indeterminate;
      },

      handleClick() {
        const store = this.tree.store;
        store.setCurrentNode(this.node);
        this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
        this.tree.currentNode = this;
        if (this.tree.expandOnClickNode) {
          this.handleExpandIconClick();
        }
        this.tree.$emit('node-click', this.node.data, this.node, this);
      },

      handleExpandIconClick() {
        if (this.node.isLeaf) return;
        if (this.expanded) {
          this.tree.$emit('node-collapse', this.node.data, this.node, this);
          this.node.collapse();
        } else {
          this.node.expand();
          this.$emit('node-expand', this.node.data, this.node, this);
        }
      },

      handleCheckChange(ev) {
        this.node.setChecked(ev, !this.tree.checkStrictly);
      },

      handleChildNodeExpand(nodeData, node, instance) {
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        this.tree.$emit('node-expand', nodeData, node, instance);
      }
    },

    created() {
      const parent = this.$parent;

      if (parent.isTree) {
        this.tree = parent;
      } else {
        this.tree = parent.tree;
      }

      const tree = this.tree;
      if (!tree) {
        console.warn('Can not find node\'s tree.');
      }

      const props = tree.props || {};
      const childrenKey = props['children'] || 'children';

      this.$watch(`node.data.${childrenKey}`, () => {
        this.node.updateChildren();
      });

      this.showCheckbox = tree.showCheckbox;

      if (this.node.expanded) {
        this.expanded = true;
        this.childNodeRendered = true;
      }

      if (this.tree.accordion) {
        this.$on('tree-node-expand', node => {
          if (this.node !== node) {
            this.node.collapse();
          }
        });
      }
    }
  };
</script>
<style>
    .node_click {
        cursor: pointer;
    }
</style>
