<template>
    <div>
        <!-- 搜索 -->
        <div class="search">
            <span>编码：<Input v-model="codeSearch" style="width: 140px" size="small"/></span>
            <span>名称：<Input v-model="nameSearch" style="width: 140px" size="small"/></span>
            <span>参数类型：
                <Select v-model="typeSearch" style="width: 140px" size="small">
                    <Option v-for="opt in typeOptions" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                </Select>
            </span>
            <span>值类型：
                <Select v-model="vtypeSearch" style="width: 140px" size="small">
                    <Option v-for="opt in vtypeOptions" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                </Select>
            </span>
        &nbsp;   <Button icon="ios-search" size="small" type="primary" @click="search">搜索</Button>
        </div>
        <!-- 工具栏组件-->
        <Toolbar ref="toolbar" :btn-list="btnList" @add="add" @edit="edit" @delete="del"></Toolbar>
        <Tables ref="paramsTable" highlight-row  show-index :loading="tableOpts.loading" :columns="tableOpts.columns"
                :prop-data="tableOpts.tableData" :height="tableOpts.height"
                :total="tableOpts.total"
                @load-data="getTableData"></Tables>
        <EditModal :modalStatus="modal" :ok-loading="okLoading" :is-edit="isEdit" width="330px"
        :title="modalTitle" @on-ok="modalOk" @on-cancel="modal=false">
            <Form ref="paramForm" :rules="rules" :model="formItem" label-position="left" :label-width="90">
                <FormItem label="参数类型" prop="type">
                    <Select v-model="formItem.type">
                        <Option v-for="opt in typeOptions" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="参数编码" prop="code">
                    <Input v-model="formItem.code"></Input>
                </FormItem>
                <FormItem label="参数名称" prop="name">
                    <Input v-model="formItem.name"></Input>
                </FormItem>
                <FormItem label="参数值类型" prop="vtype">
                    <Select v-model="formItem.vtype">
                        <Option v-for="opt in vtypeOptions" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="参数值" prop="value">
                    <Input v-model="formItem.value" :type="formItem.vtype != 'single' ? 'textarea' : 'text'" :placeholder="msg" :autosize="{minRows:3}">
                    </Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="formItem.remark"></Input>
                </FormItem>
            </Form>
        </EditModal>
        <!-- 删除对话框 -->
        <DeleteModal :modal="deleteModal" :params="tableOpts.selects" url="sysConfig/delete" @on-cancel="deleteModal=false" @on-ok="deleteModal=false;getTableData()">
        </DeleteModal>
    </div>
</template>

<script>
  import {getParamsData, addUpdata} from '@/api/sys';

  export default {
    name: 'params',
    components: {},
    data() {
      let columns = [
        {
          title: '参数类型',
          key: 'type',
          formTrigger: 'change',
          formType: 'select',
          width: 100,
          render: (h, params) => {
            return h('span', this.$util.convertDic(this, params.row.type, 'typeOptions'));
          }
        },
        {
          title: '参数编码',
          key: 'code',
          formTrigger: 'blur',
          formType: 'text',
          width: 170,
          tooltip: true
        },
        {
          title: '参数名称',
          key: 'name',
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '参数值类型',
          key: 'vtype',
          formTrigger: 'change',
          formType: 'select',
          render: (h, params) => {
            return h('span', this.$util.convertDic(this, params.row.vtype, 'vtypeOptions'));
          }
        },
        {
          title: '参数值',
          key: 'value',
          formTrigger: 'blur',
          formType: 'text',
          tooltip: true
        },
        {
          title: '备注',
          key: 'remark',
          formTrigger: 'none',
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
            icon: 'add-copy',
            permission: 'add'
          },
          {
            text: ' 编辑',
            funName: 'edit',
            icon: 'edit',
            permission: 'edit'
          },
          {
            text: ' 删除',
            funName: 'delete',
            icon: 'delete1',
            permission: 'delete'
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
        typeOptions: [],
        vtypeOptions: [],
        deleteModal: false,
        codeSearch: '',
        nameSearch: '',
        typeSearch: '',
        vtypeSearch: '',
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
          this.msg = '格式：lower英文分号upper,如：12.34;34.56 (分号为英文符号)';
        } else {
          this.msg = '格式：key,value;key,value,如：apple,苹果;banana,香蕉 (逗号分号为英文符号)';
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
        params = {...params, ...{code: this.codeSearch, name: this.nameSearch, type: this.typeSearch, vtype: this.vtypeSearch}};
        getParamsData(params).then(res => {
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
          return ;
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
          return ;
        }
        this.tableOpts.selects = select;
        this.deleteModal = true;
      },
      modalOk() {
        this.$refs.paramForm.validate(valid => {
          if (!valid) {
            this.$Message.error('请填写完整！');
            return ;
          }
          this.okLoading = true;
          let params = this.$util.copyObject(this.formItem);
          // 获取当前用户
          params.user = this.$Auth.getUserInfo();
          addUpdata(this.formItem).then(res => {
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
      setHeight() {
        this.tableOpts.height = window.innerHeight - 220 - this.$refs.toolbar.getHeight();
      }
    },
    beforeMount() {
      this.$util.getDictionry(this, ['sys_config_type', 'sys_config_value_type']).then(data => {
        if (data) {
          this.typeOptions = data[0];
          this.vtypeOptions = data[1];
        }
      });
    },
    mounted() {
      this.setHeight();
      this.getTableData();
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.setHeight();
      }
    }
  };
</script>

<style scoped>

</style>
