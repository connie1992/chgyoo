<template>
    <Modal :width="width" v-model="modal" :mask-closable="maskClosable" :closable="closable" @on-cancel="modalCancel">
        <p slot="header">
            <ModalTitle :custom="modalIcon" :title="modalTitle"></ModalTitle>
        </p>
        <div style="padding: 0 15px 0 10px;">
            <slot></slot>
        </div>
        <div slot="footer">
            <Button v-if="cancel" type="text" size="large" @click="modalCancel">取消</Button>
            <Button type="primary" size="large" @click="modalOK" :loading="modalLoading">确定</Button>
        </div>
    </Modal>

</template>

<script>
  import ModalTitle from '@/components/modals/modalTitle/title';

  export default {
    name: 'edit-modal',
    components: {
      ModalTitle
    },
    props: {
      // 是否有取消按钮
      cancel: {
        type: Boolean,
        default: true
      },
      // 弹出框的宽度
      width: {
        type: String,
        default: '300px'
      },
      // 点击遮罩层关闭弹窗
      maskClosable: {
        type: Boolean,
        default: false
      },
      // 右上角标题的图标
      icon: {
        type: String,
        default: ''
      },
      // 全标题，如果设置了这个，则不按照新建&编辑的规则来设置标题，直接取这个
      fullTitle: {
        type: String,
        default: ''
      },
      // 是否是编辑弹窗
      isEdit: {
        type: Boolean,
        default: true
      },
      // 弹窗状态，父组件传递
      modalStatus: {
        type: Boolean,
        default: false
      },
      // 弹窗名称，通常在一個頁面有多个弹窗然后共用了ok或者cancel方法，需要一个可以区分的名字
      modalName: {
        type: String
      },
      // 确定按钮的加载状态
      okLoading: {
        type: Boolean,
        default: false
      },
      // 编辑时可以传递编辑的项目名称
      title: {
        type: String,
        default: ''
      },
      // 显示右上角的关闭按钮
      closable: {
        type: Boolean,
        default: true
      }

    },
    data() {
      return {
        modalLoading: false,
        modal: false
      };
    },
    computed: {
      modalIcon: function () {
        if (this.icon == '') {
          return !this.isEdit ? 'iconfont icon-xinjian' : 'iconfont icon-bianji';
        } else {
          return this.icon;
        }
      },
      modalTitle: function () {
        if (this.fullTitle != '') {
          return this.fullTitle;
        } else {
          let desc = this.title != '' ? ` — [${this.title}]` : '';
          return this.isEdit ? `编辑${desc}` : `${this.title}新建`;
        }
      }
    },
    watch: {
      modalStatus: function (newVar) {
        this.modal = newVar;
      },
      okLoading: function (newVar) {
        this.modalLoading = newVar;
      }
    },
    methods: {
      modalCancel() {
        this.$emit('on-cancel', this.modalName);
      },
      modalOK() {
        this.$emit('on-ok', this.modalName);
      }
    }
  };
</script>

<style scoped>

</style>
