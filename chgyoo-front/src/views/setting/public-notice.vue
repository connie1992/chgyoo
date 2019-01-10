<template>
    <div>
        <!-- 搜索 -->
        <div class="search">
            <span>标题：<Input v-model="nameSearch" style="width: 140px" size="small"/></span>
            &nbsp;
            <Button icon="ios-search" size="small" type="primary" @click="search">搜索</Button>
        </div>
        <!-- 工具栏组件-->
        <Toolbar ref="toolbar" :btn-list="btnList" @add="add" @edit="edit" @delete="del"></Toolbar>
        <Tables ref="paramsTable" highlight-row show-index :loading="tableOpts.loading" :columns="tableOpts.columns"
                :prop-data="tableOpts.tableData" :height="tableOpts.height"
                :total="tableOpts.total"
                @load-data="getTableData"></Tables>
        <EditModal :modalStatus="modal" :ok-loading="okLoading" :is-edit="isEdit" width="330px"
                   :title="modalTitle" @on-ok="modalOk" @on-cancel="modal=false">
            <Form ref="paramForm" :rules="rules" :model="formItem" label-position="left" :label-width="90">
                <FormItem label="标题" prop="type">
                    <Input v-model="formItem.name"></Input>
                </FormItem>

                <FormItem label="类型" prop="type">
                    <Select v-model="formItem.type">
                        <Option v-for="opt in typeOptions" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="正文" prop="type">
                    <Input v-model="formItem.text"></Input>
                </FormItem>

                <FormItem label="重要程度" prop="type">
                    <Select v-model="formItem.importantLevel">
                        <Option v-for="opt in importantLevelOptions" :value="opt.value" :key="opt.value">{{opt.label}}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
        </EditModal>
        <!-- 删除对话框 -->
        <DeleteModal :modal="deleteModal" :params="tableOpts.selects" url="publicNotice/delete" @on-cancel="deleteModal = false" @on-ok="deleteOk">
        </DeleteModal>
    </div>
</template>

<script>
  import {getPublicNotice, publicNoticeAddUpdate} from '@/api/sys';

  export default {
    name: 'params',
    components: {},
    data() {
      let columns = [
        {
          title: '类型',
          key: 'type',
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '标题',
          key: 'name',
          formTrigger: 'blur',
          formType: 'text'
        }, {
          title: '重要程度',
          key: 'importantLevel',
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '状态',
          key: 'status',
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '是否置顶',
          key: 'value',
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '创建人',
          key: 'createName'
        },
        {
          title: '创建人工号',
          key: 'createCode'
        },
        {
          title: '创建时间',
          key: 'createTime'
        }
      ];
      let rules = this.$util.makeRules(columns);
      return {
        tableOpts: {
          columns: columns,
          tableData: [],
          height: '450px',
          total: 0,
          loading: false,
          selects: []
        },
        btnList: [
          {
            text: ' 新增',
            funName: 'add',
            icon: 'add-copy'
          },
          {
            text: ' 编辑',
            funName: 'edit',
            icon: 'EditItemMapping'
          },
          {
            text: ' 删除',
            funName: 'delete',
            icon: 'delete1'
          }
        ],
        modal: false,
        okLoading: false,
        isEdit: false,
        modalTitle: '',
        rules: rules,
        formItem: {
          type: '',
          code: '',
          name: '',
          vtype: '',
          value: '',
          remark: ''
        },
        typeOptions: [
          {value: '公告', label: '公告'},
          {value: '通知', label: '通知'},
          {value: '操作手册', label: '操作手册'}
        ],
        importantLevelOptions: [
          {value: '普通', label: '普通'},
          {value: '重要', label: '重要'},
          {value: '非常重要', label: '非常重要'}
        ],
        vtypeOptions: [
          {value: 'single', label: '单值'},
          {value: 'range', label: '区间'},
          {value: 'dictionary', label: '数据字典'}
        ],
        deleteModal: false,
        codeSearch: '',
        nameSearch: '',
        typeSearch: '',
        msg: '请输入……'
      };
    },
    computed: {
      vtype() {
        return this.formItem.vtype;
      }
    },
    watch: {
      vtype(newVal, oldVal) {
        if (newVal == 'single') {
          this.msg = '请输入……';
        } else if (newVal == 'range') {
          this.msg = '格式：lower英文分号upper,如：12.34;34.56';
        } else {
          this.msg = '格式：key-value英文分号key-value,如：apple-苹果;banana-香蕉';
        }
      }
    },
    methods: {
      search() {
        this.$refs.paramsTable.search();
      },
      getTableData() {
        let params = this.$refs.paramsTable.getParams();
        this.tableOpts.loading = true;
        params = {...params, ...{}};
        getPublicNotice(params).then(res => {
          if (this.$isSuccess(res)) {
            let data = res.data.data;
            this.tableOpts.tableData = data.dataList;
            this.tableOpts.total = data.totalSize;
          }
          this.tableOpts.loading = false;
        });
      },
      add() {
        this.modal = true;
        this.isEdit = false;
        this.$refs.paramForm.resetFields();
        this.formItem.id = '';
        this.formItem.remark = '';
        this.formItem.vtype = 'single';
      },
      edit() {
        let select = this.$refs.paramsTable.getSelects();
        if (select.length == 0) {
          this.$Message.error('请选择一条记录操作！');
          return;
        }
        this.modal = true;
        this.isEdit = true;
        this.$refs.paramForm.resetFields();
        this.formItem = this.$util.copyObject(select[0]);
      },
      del() {
        let select = this.$refs.paramsTable.getSelects();
        if (select.length == 0) {
          this.$Message.error('请选择一条记录操作！');
          return;
        }
        this.tableOpts.selects = select;
        this.deleteModal = true;
      },
      modalOk() {
        this.$refs.paramForm.validate(valid => {
          if (!valid) {
            this.$Message.error('请填写完整！');
            return;
          }
          this.okLoading = true;
          let params = this.$util.copyObject(this.formItem);
          //   获取当前用户
          params.user = this.$Auth.getUserInfo();
          publicNoticeAddUpdate(this.formItem).then(res => {
            if (this.$isSuccess(res)) {
              this.modal = false;
              this.$Message.success(res.data.msg);
              // 刷新数据
              this.getTableData();
            }
            this.okLoading = false;
          });
        });
      },
      deleteOk() {
        this.deleteModal = false;
        this.getTableData();
      },
      setHeight() {
        this.tableOpts.height = window.innerHeight - 230 - this.$refs.toolbar.getHeight();
      }
    },
    mounted() {
      this.setHeight();
      // this.getTableData();
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.setHeight();
      };
    }
  };
</script>

<style scoped>

</style>
