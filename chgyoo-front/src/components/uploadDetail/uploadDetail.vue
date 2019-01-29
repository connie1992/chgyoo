<template>
    <div style="clear: both;">
        <div style="height: 45px">
            <span style="display: inline-block;float: left;width: 70px;margin-top: 4px"><span style="color: #ed4014;display: inline-block;margin-right: 4px">*</span>明细</span>
            <Upload ref="upload" :action="action" :on-success="uploadSuccess"
                    :on-error="uploadError" :before-upload="beforeUpload" :on-remove="removeUpload" style="float: left">
                <div>
                    <SvgIconBtn btn-text="上传Excel" icon-text="upload1" height="30px" :disabled="file !== null"></SvgIconBtn>
                </div>
            </Upload>
            <!--<span style="display: inline-block;float: left;">请上传附件</span>-->
        </div>
        <div>
            <Tables stripe highlight-row  show-index show-total-desc :show-page="false" size-text-font-size="12px" :columns="tableColumns"
                    :prop-data="tableOpts.data" :height="tableHeight" :loading="loading"></Tables>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'UploadDetail',
    props: {
      tableHeight: {
        type: Number,
        default: 300
      },
      tableColumns: {
        type: Array,
        default() {
          return [];
        }
      },
      action: {
        type: String
      },
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        file: null,
        isCover: false,
        tableOpts: {
          data: [],
          total: 0,
          loading: false,
        }
      };
    },
    watch: {
      data: function(dataList) {
        this.tableOpts.data = dataList;
      }
    },
    methods: {
      beforeUpload(file) {
        this.isCover = this.tableOpts.data.length > 0;
        this.file = file;
      },
      removeUpload() {
        this.file = null;
        this.tableOpts.data = [];
      },
      uploadSuccess(res) {
        if (this.$isSuccess(res)) {
          this.tableOpts.data = res.data.dataList;
        }
      },
      uploadError() {
        this.$Message.error('上传失败');
      },
      getTableData() {
        return this.tableOpts.data;
      },
      clear() {
        this.$refs.upload.clearFiles();
        this.tableOpts.data = [];
        this.file = null;
      }
    },
    mounted() {

    }
  };
</script>

<style scoped>

</style>
