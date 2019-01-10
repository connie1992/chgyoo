<template>
  <div  :class="prefixCls" >
    <el-tree-node
      v-for="child in root.childNodes"
      :node="child"
      :props="props"
      :key="getNodeKey(child)"
      :render-content="renderContent"
      :parent-icon="parentIcon"
      :leaf-icon="leafIcon"
      :show-icon="showIcon"
      @node-expand="handleNodeExpand">
    </el-tree-node>
    <div :class="[prefixCls + '-empty']" v-if="!root.childNodes || root.childNodes.length === 0">
      {{ emptyText }}
    </div>
  </div>
</template>

<script>
  import TreeStore from './model/tree-store';
  import {t} from 'iview/src/locale';
  import emitter from 'iview/src/mixins/emitter';
  import ElTreeNode from './tree-node.vue';

  const prefixCls = 'ivu-tree';
  export default {
    name: 'ChuTree',

    mixins: [emitter],

    components: {
      ElTreeNode
    },

    data() {
      return {
        store: null,
        root: null,
        currentNode: null,
        prefixCls: prefixCls,
      };
    },

    props: {
      data: {
        type: Array
      },
      emptyText: {
        type: String,
        default() {
          return t('el.tree.emptyText');
        }
      },
      nodeKey: String,
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      renderContent: Function,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      fontSize: {
        type: Number,
        default: 13
      },
      props: {
        default() {
          return {
            children: 'children',
            label: 'label',
            icon: 'icon',
            disabled: 'disabled'
          };
        }
      },
      lazy: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
      currentNodeKey: [String, Number],
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 16
      },
      parentIcon: {
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
      },
      iconSize: {
        type: Number
      },
      checkOnClickNode: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      children: {
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      }
    },

    watch: {
      defaultCheckedKeys(newVal) {
        this.store.defaultCheckedKeys = newVal;
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      currentNodeKey(newVal) {
        this.store.setCurrentNodeKey(newVal);
        this.store.currentNodeKey = newVal;
      },
      data(newVal) {
        this.store.setData(newVal);
      }
    },

    methods: {
      recursiveNode(node, id) {
        node.childNodes.forEach((item) => {
          if (item.id == id) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          if (item.childNodes.length > 0) {
            this.recursiveNode(item, id);
          }
        });
      },
      handleSelect (node) {
        if (this.checkOnClickNode && this.showCheckbox) {
          return ;
        } else {
          this.recursiveNode(this.root, node.id);
        }
      },
      filter(value) {
        if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        this.store.filter(value);
      },
      getNodeKey(node, index) {
        const nodeKey = this.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },
      getNode(data) {
        return this.store.getNode(data);
      },
      getCheckedNodes(leafOnly) {
        return this.store.getCheckedNodes(leafOnly);
      },
      getCheckedKeys(leafOnly) {
        return this.store.getCheckedKeys(leafOnly);
      },
      setCheckedNodes(nodes, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedNodes(nodes, leafOnly);
      },
      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedKeys(keys, leafOnly);
      },
      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },
      handleNodeExpand(nodeData, node, instance) {
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        this.$emit('node-expand', nodeData, node, instance);
      },
      getNodes() {
        return this.store.root;
      }
    },

    created() {
      this.isTree = true;

      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.data,
        lazy: this.lazy,
        props: this.props,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod,
      });

      this.root = this.store.root;
    },
    mounted () {
      // this.$on('on-check', this.handleCheck);
      this.$on('on-selected', this.handleSelect);
      // this.$on('toggle-expand', node => this.$emit('on-toggle-expand', node));
    }
  };
</script>
