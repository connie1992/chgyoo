<style scoped>
    .search > span {
        width: 200px;
    }

</style>

<template>
    <div>
        <!-- 搜索 -->
        <div class="search">
            <span>主题：<Input v-model="searchParams.name" style="width: 140px" size="small"/></span>
            <span>备注：<Input v-model="searchParams.remark" style="width: 140px" size="small"/></span>
        &nbsp; <Button icon="ios-search" size="small" type="primary" @click="search">搜索</Button>
        </div>
        <!-- 工具栏组件-->
        <Toolbar ref="toolbar" :permission-path="permissionPath" :btn-list="btnList" @click1="add" @click2="edit" @click3="del" @click4="detail"></Toolbar>
        <Tables ref="prepareTable" highlight-row  show-index :loading="tableOpts.loading" :columns="tableOpts.columns"
                :prop-data="tableOpts.tableData" :height="tableOpts.height"
                :total="tableOpts.total"
                @load-data="getTableData"></Tables>
        <EditModal :modalStatus="modalOpts.modal" :ok-loading="modalOpts.okLoading" :top="70" :is-edit="modalOpts.isEdit" width="1000px"
                   :title="modalOpts.modalTitle" @on-ok="modalOk" @on-cancel="modalOpts.modal=false">
            <Form ref="paramForm" :rules="formOpts.rules" :model="formOpts.item" label-position="left" :label-width="70">
                <FormItem label="标题" prop="name" style="float: left;">
                    <Input v-model="formOpts.item.name" style="width: 200px"></Input>
                </FormItem>
                <span style="display: block; width: 30px;height: 20px;float: left;"></span>
                <FormItem label="备注" style="float: left;">
                    <Input v-model="formOpts.item.remark" style="width:370px"></Input>
                </FormItem>
            </Form>
            <UploadDetail ref='uploadDetail' :loading="detailTableOpts.loading" :table-columns="detailTableOpts.columns" :table-height="250" :data="detailTableOpts.tableData" :action="`/budget/${postUrlMap[$route.path]}/${importUrlMap[$route.path]}`">
            </UploadDetail>
        </EditModal>
        <EditModal :modalStatus="modalOpts.modal2" :top="70" width="1000px" :cancel="false"
                   full-title="查看明细" icon="iconfont icon-chakan" @on-ok="modalOpts.modal2=false" @on-cancel="modalOpts.modal2=false">
            <Tables ref="detailTable" stripe highlight-row show-index :show-page="true" size-text-font-size="12px" :loading="detailTableOpts.loading"
                    :columns="detailTableOpts.columns"
                    :prop-data="detailTableOpts.tableData" :height="350"
                    :total="detailTableOpts.total"
                    @load-data="detail"></Tables>
        </EditModal>
        <!-- 删除对话框 -->
        <DeleteModal :modal="modalOpts.deleteModal" :params="tableOpts.selects" :url="`budget/${postUrlMap[$route.path]}/delete`" @on-cancel="modalOpts.deleteModal=false" @on-ok="modalOpts.deleteModal=false;getTableData()">
        </DeleteModal>
    </div>
</template>

<script>
  import {getBudgetMake, budgetMakeAddUpdate, getBudgetMakeDetail} from '@/api/budget';
  import UploadDetail from '@/components/uploadDetail/index';

  export default {
    name: 'budgetMake',
    components: {UploadDetail},
    data() {
      let columns = [
        {
          title: '主题',
          key: 'name',
          width: 170,
          tooltip: true,
          rule: {trigger: 'blur'}
        }, {
          title: '申请人',
          key: 'createUserName',
          width: 170
        }, {
          title: '提单时间',
          key: 'createTime',
          width: 170
        }, {
          title: '备注',
          key: 'remark',
          tooltip: true
        }
      ];
      let rules = this.$util.makeRules(columns);
      rules.detail = {required: true, message: '请上传明细', trigger: 'change'};
      let preparePath = '/chg-budget/make/prepare';
      let mainAddPath= '/control/make/main-data';
      let useAddPath= '/control/make/use-add';
      let postUrlMap = {};
      postUrlMap[preparePath] = 'budgetPrepare';
      postUrlMap[mainAddPath] = 'budgetMainAdd';
      postUrlMap[useAddPath] = 'budgetUseAdd';
      let importUrlMap = {};
      importUrlMap[preparePath] = 'importBudgetPrepare';
      importUrlMap[mainAddPath] = 'importBudgetMainAdd';
      importUrlMap[mainAddPath] = '';
      return {
        preparePath: preparePath,
        mainAddPath: mainAddPath,
        useAddPath: useAddPath,
        postUrlMap: postUrlMap,
        importUrlMap: importUrlMap,
        permissionPath: ';',
        tableOpts: {
          columns: [
            {
              title: '主题',
              key: 'name',
              width: 170,
              tooltip: true
            },{
              title: '申请人',
              key: 'createUserName',
              width: 170
            },{
              title: '提单时间',
              key: 'createTime',
              width: 170
            },{
              title: '备注',
              key: 'remark',
              tooltip: true
            }
          ],
          tableData: [],
          height: '450px',
          total: 0,
          loading: false,
          selects: []
        },
        detailTableOpts: {
          makeColumns: [
            {
              title: '年度',
              key: 'year',
              width: 60,
              fixed: 'left'
            },
            {
              title: '类型',
              key: 'type',
              width: 80,
              fixed: 'left'
            },
            {
              title: '预算编码',
              key: 'code',
              width: 170,
              fixed: 'left',
              tooltip: true
            },
            {
              title: '预算名称',
              key: 'name',
              width: 170,
              fixed: 'left',
              tooltip: true
            },
            {
              title: '成本中心编码',
              key: 'costNo',
              width: 170,
              tooltip: true
            },
            {
              title: '成本中心名称',
              key: 'costName',
              width: 170,
              tooltip: true
            },
            {
              title: '会计科目编码',
              key: 'acctNo',
              width: 170
            },
            {
              title: '会计科目名称',
              key: 'acctName',
              width: 170
            }
          ],
          useAddColumns: [
            {
              title: '年度',
              key: 'year',
              width: 80
            },
            {
              title: '月度',
              key: 'month',
              width: 80
            },
            {
              title: '预算编码',
              key: 'budgetCode',
              width: 150
            },
            {
              title: '预算名称',
              key: 'budgetName',
              width: 150
            },
            {
              title: '使用金额',
              key: 'optAmount',
              width: 100
            },
            {
              title: '备注',
              key: 'remark',
            }
          ],
          columns: [],
          tableData: [],
          height: 250,
          total: 0,
          loading: false,
        },
        btnList: [
          {
            text: ' 新增',
            icon: 'add-copy',
            permission: 'add'
          },
          {
            text: ' 编辑',
            icon: 'edit',
            permission: 'edit'
          },
          {
            text: ' 删除',
            icon: 'delete1',
            permission: 'delete'
          },
          {
            text: ' 查看明细',
            icon: 'chakan',
            permission: 'view'
          }
        ],
        modalOpts: {
          modal: false,
          okLoading: false,
          isEdit: false,
          modalTitle: '',
          deleteModal: false,
          modal2: false
        },
        formOpts: {
          rules: rules,
          item: {
            id: '',
            name: '',
            remark: ''
          },
        },
        searchParams: {
          name: '',
          remark: ''
        }
      };
    },
    watch: {
      '$route': function (newRoute) {
        if (this.postUrlMap[newRoute.path]) {
          this.searchParams.name = '',
          this.searchParams.remark = '';
          this.getTableData();
          this.makeColumns();
          this.$refs.toolbar.checkShow();
          this.permissionPath = `;${newRoute.path}`;
          this.setHeight();
        }
      }
    },
    methods: {
      makeColumns() {
        let columns = [];
        if (this.detailTableOpts.columns.length > 0) {
          // 初始化列配置
          let indexColumn = this.detailTableOpts.columns[0];
          if (this.$route.path != this.useAddPath) {
            indexColumn.fixed = 'left';
          } else {
            if (indexColumn.fixed) {
              delete indexColumn.fixed;
            }
          }
          columns.push(indexColumn);
        }
        if (this.$route.path == this.preparePath) {
          columns = [...columns, ...this.detailTableOpts.makeColumns, ...this.prepareExtraColumns()];
        } else if (this.$route.path == this.mainAddPath) {
          columns = [...columns, ...this.detailTableOpts.makeColumns];
        } else {
          columns = [...columns, ...this.detailTableOpts.useAddColumns];
        }
        this.detailTableOpts.columns = columns;
      },
      prepareExtraColumns() {
        let arr = [{
          title: '全年金额',
          key: 'totalAmount',
          width: 80
        }];
        for (let i = 0; i < 12; i++) {
          arr.push(
            {
              title: `${i + 1}月金额`,
              key: `amount${i + 1}`,
              width: 80
            }
          );
        }
        return arr;
      },
      search() {
        this.$refs.prepareTable.search();
      },
      getTableData() {
        let params = this.$refs.prepareTable.getParams();
        params = {...params, ...this.searchParams};
        console.log(`获取数据……${this.postUrlMap[this.$route.path]}……`);
        /*this.tableOpts.loading = true;
        getBudgetMake(params, this.postUrl).then(res => {
          if (this.$isSuccess(res)) {
            let data = res.data.data;
            this.tableOpts.tableData = data.dataList;
            this.tableOpts.total = data.totalSize;
          }
          this.tableOpts.loading = false;
        });*/
      },
      add() {
        this.$refs.uploadDetail.clear();
        this.modalOpts.modal = true;
        this.modalOpts.isEdit = false;
        this.$refs.paramForm.resetFields();
        this.formOpts.item.id = '';
        this.formOpts.item.remark = '';
      },
      edit() {
        let select = this.$util.checkSelect(this, 'prepareTable');
        if (select === false) {
          return ;
        }
        // 清空上传状态
        this.$refs.uploadDetail.clear();
        // 获取明细
        this.modalOpts.modal = true;
        this.detailTableOpts.loading = true;
        getBudgetMakeDetail({id: select[0].id}, this.postUrlMap[this.$route.path]).then(res => {
          if (this.$isSuccess(res)) {
            this.detailTableOpts.tableData = res.data.data.dataList;
            this.modalOpts.isEdit = true;
            this.$refs.paramForm.resetFields();
            this.formOpts.item = this.$util.copyObject(select[0]);
          }
          this.detailTableOpts.loading = false;
        });
      },
      del() {
        let select = this.$util.checkSelect(this, 'prepareTable');
        if (select === false) {
          return ;
        }
        this.tableOpts.selects = select;
        this.modalOpts.deleteModal = true;
      },
      addUpdate() {
        this.modalOpts.okLoading = true;
        let params = {...this.formOpts.item, detail: JSON.stringify(this.detailTableOpts.tableData)};
        budgetMakeAddUpdate(params, this.postUrlMap[this.$route.path]).then(res => {
          if (this.$isSuccess(res)) {
            this.modalOpts.modal = false;
            this.$Message.success(res.data.msg);
            // 刷新数据
            this.getTableData();
          }
          this.modalOpts.okLoading = false;
        });
      },
      modalOk() {
        this.$util.formValid(this, 'paramForm').then(valid => {
            if (valid) {
              this.detailTableOpts.tableData = this.$refs.uploadDetail.getTableData();
              if (this.detailTableOpts.tableData.length == 0) {
                this.$Message.error('请上传明细');
              } else {
                this.addUpdate();
              }
            }
          }
        );
      },
      detail() {
        let select = this.$util.checkSelect(this, 'prepareTable');
        if (select === false) {
          return ;
        }
        // 获取明细表的数据
        this.modalOpts.modal2 = true;
        this.detailTableOpts.loading = true;
        let params = this.$refs.detailTable.getParams();
        getBudgetMakeDetail({id: select[0].id, ...params}, this.postUrlMap[this.$route.path]).then(res => {
          if (this.$isSuccess(res)) {
            let data = res.data.data;
            this.detailTableOpts.tableData = data.dataList;
            this.detailTableOpts.total = data.totalSize;
          }
          this.detailTableOpts.loading = false;
        });
      },
      setHeight() {
        this.tableOpts.height = window.innerHeight - 220 - this.$refs.toolbar.getHeight();
      }
    },
    mounted() {
      console.log('进入预算管理公共组件……');
      this.setHeight();
      this.getTableData();
      this.makeColumns();
      this.permissionPath = `;${this.$route.path}`;
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.setHeight();
      }
    }
  };
</script>

<style scoped>

</style>
