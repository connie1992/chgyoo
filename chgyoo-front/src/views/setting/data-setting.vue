<style scoped>
    .search > span {
        width: 200px;
    }
    .search > span > span {
        width: 65px;
    }


</style>

<template>
    <div>
        <!-- 搜索 -->
        <div class="search" ref="searchDiv">
            <span>
                <span>权限编码：</span>
                <Input v-model="searchParams.code" style="width: 120px" size="small"/>
            </span>
            <span>
                <span>权限名称：</span>
                <Input v-model="searchParams.name" style="width: 120px" size="small"/>
            </span>
            <span>
                <span>权限字段：</span>
                <Select v-model="searchParams.rangeColumn" style="width: 120px" size="small">
                     <Option v-for="opt in rangeColumnOptions" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                </Select>
            </span>
            <span>
                <span>权限范围：</span>
                <Input v-model="searchParams.rangeName" style="width: 120px" size="small"/>
            </span>
            <span>
                <span>权限人：</span>
                <Input v-model="searchParams.user1Name" style="width: 120px" size="small"/>
            </span>
            <span>
                <span>状态：</span>
                <Select v-model="searchParams.status" style="width: 120px" size="small">
                    <Option v-for="opt in statusOption" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                </Select>
            </span>
            <Button icon="ios-search" size="small" type="primary" @click="search">搜索</Button>
        </div>
        <Toolbar :btn-list="btnList" @click1="add" @click2="edit" @click3="del" @click4="setStatus"></Toolbar>
        <Tables ref="authTable" show-index highlight-row :loading="tableOpts.loading" :columns="tableOpts.columns"
                :prop-data="tableOpts.tableData" :height="tableOpts.height"
                :total="tableOpts.total"
                @load-data="getTableData"></Tables>
        <EditModal :modalStatus="modal" :ok-loading="okLoading" :is-edit="isEdit" width="320px"
                   :title="modalTitle" @on-ok="modalOk" @on-cancel="modal=false">
            <Form ref="dataForm" :rules="rules" :model="formItem" label-position="left" :label-width="80">
                <FormItem label="权限编码" prop="code">
                    <Input v-model="formItem.code"></Input>
                </FormItem>
                <FormItem label="权限名称" prop="name">
                    <Input v-model="formItem.name"></Input>
                </FormItem>
                <FormItem label="权限字段" prop="rangeColumn">
                    <Select v-model="formItem.rangeColumn" size="default">
                        <Option v-for="opt in rangeColumnOptions" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="权限人" prop="user1Name">
                    <Input v-model="formItem.user1Name">
                        <SvgIconBtn icon-text="ren" type="text" height="35px" slot="suffix" @click="selectUser"></SvgIconBtn>
                    </Input>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <Select v-model="formItem.status">
                        <Option v-for="opt in statusOption" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </EditModal>
        <!-- 删除对话框 -->
        <DeleteModal :modal="deleteModal" :params="tableOpts.selects" url="authData/delete" @on-cancel="deleteModal=false" @on-ok="deleteModal=false;getTableData()">
        </DeleteModal>
    </div>
</template>

<script>
  import {getAuthData, authDataAddUpdate, setStatus} from '@/api/sys';

  export default {
    name: 'data-setting',
    components: {
    },
    data() {
      let columns = [
        {
          title: '权限编码',
          key: 'code',
          width: 150,
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '权限名称',
          key: 'name',
          width: 200,
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '权限字段',
          key: 'rangeColumn',
          width: 100,
          formTrigger: 'change',
          formType: 'select',
          render: (h, params) => {
            return h('span', this.$util.convertDic(this, params.row.rangeColumn, 'rangeColumnOptions'));
          }
        },
        {
          title: '权限人',
          key: 'user1Name',
          formTrigger: 'blur',
          formType: 'text'
        },
        {
          title: '状态',
          key: 'status',
          width: 80,
          formTrigger: 'change',
          formType: 'select',
          render: (h, params) => {
            return h('span', this.$util.convertDic(this, params.row.status, 'statusOption'));
          }
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
            icon: 'add-copy'
          },
          {
            text: ' 编辑',
            icon: 'EditItemMapping'
          },
          {
            text: ' 删除',
            icon: 'delete1'
          },
          {
            text: ' 生效/失效',
            icon: 'mima'
          }
        ],
        formItem: {},
        rules: rules,
        rangeColumnOptions: [],
        statusOption: [],
        modal: false,
        okLoading: false,
        isEdit: false,
        modalTitle: '',
        // 搜索参数
        searchParams: {
          code: '',
          name: '',
          rangeColumn: '',
          rangeName: '',
          user1Name: '',
          status: ''
        },
        deleteModal: false,
      };
    },
    methods: {
      search() {
        this.$refs.orgTable.search();
      },
      getTableData() {
        let params = this.$refs.authTable.getParams();
        this.tableOpts.loading = true;
        params = {...params, ...this.searchParams};
        getAuthData(params).then(res => {
          if (this.$isSuccess(res)) {
            let data = res.data.data;
            this.tableOpts.tableData = data.dataList;
            this.tableOpts.total = data.totalSize;
          }
          this.tableOpts.loading = false;
        });
      },
      add() {
        this.isEdit = false;
        this.modal = true;
        this.$refs.dataForm.resetFields();
        this.formItem.status = '1';
        this.formItem.rangeColumn = '成本中心';
        this.formItem.id = '';
      },
      edit() {
        // 获取选择的行项目
        let check = this.$util.checkSelects(this, 'authTable');
        if (check === false) {
          return ;
        }
        this.isEdit = true;
        this.modal = true;
        this.$refs.dataForm.resetFields();
        this.formItem = this.$util.copyObject(check[0]);
        console.log(this.formItem);
      },
      del() {
        let check = this.$util.checkSelects(this, 'authTable');
        if (check === false) {
          return ;
        }
        this.deleteModal = true;
        this.tableOpts.selects = check;
      },
      modalOk() {
        this.$refs.dataForm.validate(valid => {
          if (!valid) {
            this.$Message.error('请填写完整！');
            return ;
          }
          this.okLoading = true;
          let params = this.$util.copyObject(this.formItem);
          // 获取当前用户
          params.user = this.$Auth.getUserInfo();
          authDataAddUpdate(params).then(res => {
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
      selectUser() {

      },
      setStatus() {
        let check = this.$util.checkSelects(this, 'authTable');
        if (check === false) {
            return ;
        }
        this.$Modal.confirm({
          title: '确认？',
          content: `是否将选中选设置为 ${check[0].status === '0' ? '生效' : '失效'} 吗？`,
          onOk: () => {
            let ids = this.$util.makeIds(check);
            let status = check[0].status === '0' ? '1' : '0';
            setStatus({ids: ids, status: status}).then(res => {
              if (this.$isSuccess(res)) {
                this.$Message.success(res.data.msg);
                this.getTableData();
              }
            });
          },
          onCancel: () => {
          }
        });
      },
      // 获取下拉框的选项
      getDictionary() {
        this.$util.getDictionry(this, ['auth_state', 'range_cloumn']).then(data => {
          if (data) {
            this.statusOption = data[0];
            this.rangeColumnOptions = data[1];
          }
        });
      }
    },
    beforeMount() {
      this.getDictionary();
    },
    mounted() {
      console.log('搜索框的高度为：');
      console.log(this.$refs.searchDiv.getBoundingClientRect().height);
      this.tableOpts.height = window.innerHeight - 280;
      this.getTableData();
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.tableOpts.height = window.innerHeight - 280;
      };
    }
  };
</script>

<style scoped>
</style>
