<style scoped>
    .search > span {
        width: 220px;
    }
    .search > span > span {
        width: 40px;
    }
    .search > span > span + span > div{
        width: 150px;
    }
</style>

<template>
    <div>
        <!-- 搜索条件 -->
        <!-- 当搜索条件很多，有可能换行时，推荐采用下面的方式，已经预先写好样式了，保证换行后也可以保持对齐，
        唯一的缺点就是当搜索项长短差异很大时看起来不协调不美观，建议将字数多的放在第一个 -->
        <div class="search">
             <span>
                <span>姓名： </span>
                <span>
                    <Input v-model="searchParams.name" size="small"/>
                </span>
            </span>
            <span>
                <span>地址：</span>
                <span>
                    <Input v-model="searchParams.address" size="small"/>
                </span>
            </span>
            <span>
                <span>学校：</span>
                <span>
                    <Select v-model="searchParams.school" size="small">
                        <Option v-for="item in schoolList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </span>
            </span>
            <Button icon="ios-search" size="small" type="primary" @click="search">搜索</Button>
        </div>
        <!-- 工具栏组件 -->
        <Toolbar ref="toolbar" :btn-list="btnList" @click1="add" @click2="edit" @click3="del"></Toolbar>
        <!-- 表格组件-->
        <tables ref="demoTable" show-selection show-elevator :loading="tableOpts.loading" :columns="tableOpts.columns" :pagerPageSize="20" :pagerPageSizeOpts="[10, 20, 30]"
                :prop-data="tableOpts.tableData" :height="tableOpts.height" :size="tableOpts.size" :total="tableOpts.total" @load-data="getTableData">
        </tables>

        <!-- 新建&编辑对话框 -->
        <EditModal :modal-status="modalOpts.modal" :ok-loading="modalOpts.okLoading" :is-edit="modalOpts.isEdit"
                   :title="modalOpts.title" @on-ok="modalOK" @on-cancel="modalOpts.modal=false" width="330px">
            <Form ref="form" :rules="formOpts.rules" :model="formOpts.item" label-position="left"
                         :label-width="100">
            <FormItem label="姓名" prop="name">
                <Input ref="userInput" v-model="formOpts.item.name"></Input>
            </FormItem>
            <FormItem label="地址" prop="address">
                <Input v-model="formOpts.item.address"></Input>
            </FormItem>
            <FormItem label="入职日期" prop="jobDate">
                <DatePicker type="date" v-model="formOpts.item.jobDate"></DatePicker>
            </FormItem>
            <FormItem label="学校">
                <Select v-model="formOpts.item.school">
                    <Option v-for="item in schoolList" :value="item.value" :key="item.value">{{ item.label}}</Option>
                </Select>
            </FormItem>
        </Form>
        </EditModal>

        <!-- 删除对话框 -->
        <DeleteModal :modal="modalOpts.deleteModal" :params="tableOpts.selects" url="demo/delete" @on-ok="onOk" @on-cancel="modalOpts.deleteModal = false">
        </DeleteModal>
    </div>
</template>
<script>
  import {getTableData, save} from '@/api/demo';
  import ModalTitle from '@/components/modals/modalTitle/title';

  export default {
    name: 'demo',
    components: {ModalTitle},
    data() {
      return {
        // 表格配置
        tableOpts: {
          loading: false,
          tableData: [],
          total: 0,
          selects: [],
          columns: [
            {title: '姓名', key: 'name', sortable: 'custom', rule: {trigger: 'blur'}},
            {title: '地址', key: 'address', rule: {trigger: 'blur'}},
            {title: '学校', key: 'school', sortable: 'custom'},
            {title: '入职日期', key: 'jobDate', sortable: 'custom', rule: {trigger: 'blur', type: 'date'}}
          ],
          size: 'small',
          height: 500
        },
        schoolList: [
          {value: 'bjlg', label: '北京理工大学'},
          {value: 'bjkj', label: '北京科技大学'},
          {value: 'hnlg', label: '华南理工'}
        ],
        // 搜索项
        searchParams: {
          name: '',
          address: '',
          school: ''
        },
        btnList: [
          {
            text: ' 新增',
            icon: 'add-copy',
            permission: 'add'
          },
          {
            text: ' 编辑',
            icon: 'EditItemMapping',
            permission: 'edit'
          },
          {
            text: ' 删除',
            icon: 'delete1',
            permission: 'delete'
          }
        ],
        modalOpts: {
          modal: false,
          title: '',
          icon: '',
          okLoading: false,
          deleteModal: false,
          isEdit: false
        },
        formOpts: {
          item: {
            id: '',
            name: '',
            address: '',
            school: '',
            jobDate: ''
          }
        },
      };
    },
    methods: {
      getTableData() {
        // 刷新选中行项目数据
        this.tableOpts.loading = true;
        // 获取自定义table组件的通用参数，页码 页数 排序字段 排序类型
        let params = {...this.$refs.demoTable.getParams(), ...this.searchParams};
        getTableData(params).then(res => {
          if (this.$isSuccess(res)) {
            let result = res.data.data;
            this.tableOpts.tableData = result.dataList;
            this.tableOpts.total = result.totalSize;
          }
          this.tableOpts.loading = false;
        });
      },
      search() {
        this.$refs.demoTable.search();
      },
      add() {
        this.$refs['form'].resetFields();
        this.modalOpts.isEdit = false;
        this.modalOpts.modal = true;
        this.formOpts.item.school = this.schoolList[0].value;
        this.formOpts.item.id = '';
        this.$util.focus(this, 'userInput');
      },
      edit() {
        let selects = this.$util.checkSelect(this, 'demoTable');
        if (selects) {
          this.tableOpts.selects = selects;
          this.modalOpts.isEdit = true;
          this.$refs['form'].resetFields();
          // 复制一个新的对象，不能直接操作selects，因为表单重置的时候会直接将对象的值重置！
          let newItem = this.$util.copyObject(selects[0]);
          this.formOpts.item = newItem;
          this.modalOpts.modal = true;
          this.$util.focus(this, 'userInput');
        }
      },
      del() {
        let selects = this.$util.checkSelect(this, 'demoTable');
        if (selects) {
          this.tableOpts.selects = selects;
          this.modalOpts.deleteModal = true;
        }
      },
      // 子组件点击关闭按钮时需要调用此方法更新父组件的传值，不然在下一次点击打开时无法打开提示框
      onOk() {
        this.modalOpts.deleteModal = false;
          // 删除完成后刷新表格数据
        this.getTableData();
      },
      modalOK() {
        // 表单验证
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.modalOpts.okLoading = true;
            // -----模拟请求时间，以展示loading的效果
            setTimeout(() => {
              save(this.formOpts.item).then(res => {
                if (this.$isSuccess(res)) {
                  this.modalOpts.modal = false;
                  this.$Message.success(res.data.msg);
                  this.getTableData();
                }
                this.modalOpts.okLoading = false;
              });
            }, 1000);
          } else {
            this.$Message.error('请填写完整！');
          }
        });
      },
      setHeight() {
        this.tableOpts.height = window.innerHeight - 220 - this.$refs.toolbar.getHeight();
      }
    },
    watch: {},
    computed: {},
    created(){
      this.formOpts.rules = this.$util.makeRules(this.tableOpts.columns);
    },
    mounted() {
      this.getTableData();
      let me = this;

      me.setHeight();
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        me.setHeight();
      };
    }
  };
</script>

