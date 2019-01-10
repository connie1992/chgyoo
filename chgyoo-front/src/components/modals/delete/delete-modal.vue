<template>
    <!-- 删除对话框 -->
    <Modal v-model="modal1" width="300" @on-cancel="cancel">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>确认删除{{desc.length > 0 ? (' — ' + desc) : desc}}</span>
        </p>
        <div style="text-align:center">
            <p>删除之后将无法恢复</p>
            <p>确认删除吗？</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="loading" @click="deleteOK">删除</Button>
        </div>
    </Modal>
</template>

<script>
  import {postRequest} from '../../../api/config';

  export default {
    name: 'DeleteModal',
    props: {
      modal: {
        type: Boolean,
        default: false
      },
      params: {
        type: Array,
        default() {
          return [];
        }
      },
      url: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      },
      deleteName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 确认删除按钮加载中效果
        modal1: false,
        loading: false
      };
    },
    computed: {

    },
    watch: {
      // 监听父组件传的显示状态，然后赋值给子组件的状态值
      // 最开始的时候直接使用父组件传进来的状态值，但是发现在点击窗口右上角的叉叉时，会自动设置状态为false，因为这个状态是父组件prop进来的，在子组件修改会报错。
      modal: function (newVar) {
        this.modal1 = newVar;
      }
    },
    methods: {
      deleteOK() {
        // 删除请求
        this.loading = true;
        let ids = this.$util.makeIds(this.params);
        postRequest(this.url, {ids: ids}).then(res => {
          this.loading = false;
          if (this.$isSuccess(res)) {
            this.$Message.success(res.data.msg);
            this.modal1 = false;
            this.$emit('on-ok', this.deleteName);
          }
        });
      },
      cancel() {
        this.$emit('on-cancel');
      }

    },
    mounted() {
    }
  };
</script>
