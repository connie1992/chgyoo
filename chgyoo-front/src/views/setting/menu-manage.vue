<template>
    <div id="example">
        <Toolbar :btnList="btnList" height="28px" @click1="addMenu"></Toolbar>
        <div :style="{height: `${tableHeight}px`}">
        <zk-table
                ref="table"
                sum-text="sum"
                index-text="#"
                :data="data"
                :columns="columns"
                :stripe="props.stripe"
                :border="props.border"
                :show-header="props.showHeader"
                :show-summary="props.showSummary"
                :show-row-hover="props.showRowHover"
                :show-index="props.showIndex"
                :tree-type="props.treeType"
                :is-fold="props.isFold"
                :max-height="props.maxHeight"
                :expand-type="props.expandType"
                :selection-type="props.selectionType"
                @row-click="rowClick">
            <template slot="operation" slot-scope="scope">
               <ButtonGroup>
                   <SvgIconBtn icon-text="chilun" tip="按钮设置" :disabled="scope.row.children.length > 0" @click="btnsetting(scope.row)"></SvgIconBtn>
                   <SvgIconBtn icon-text="bianji1" tip="编辑" @click="editMenu(scope.row)"></SvgIconBtn>
                   <SvgIconBtn icon-text="delete1" tip="删除" btn-name="del" @click="del(scope.row, 'menu')"></SvgIconBtn>
                   <SvgIconBtn icon-text="arrow-up" :disabled="scope.row.menuOrder == 1" @click="upDown(scope.row, true)"></SvgIconBtn>
                   <SvgIconBtn icon-text="arrow-down" :disabled="scope.row.last" @click="upDown(scope.row, false)"></SvgIconBtn>
                </ButtonGroup>
            </template>
            <template slot="icon" slot-scope="scope">
                <div v-if="scope.row.icon && scope.row.icon != ''" style="text-align: center;width: 100%">
                    <Icon :custom="scope.row.icon"></Icon>
                </div>
            </template>
        </zk-table>
        </div>
        <!-- 新建/编辑菜单 -->
        <EditModal width="350px" modal-name="menu" :title="modalTitle" :modal-status="modal" :is-edit="isEdit"
                   :ok-loading="modalLoading" @on-ok="modalOk" @on-cancel="modal=false">
            <Form ref="inputItem" :rules="ruleValidate" :model="menuItem" label-position="left"
                  :label-width="80">
                <FormItem label="菜单名称" prop="name">
                    <Input ref="menuInput" v-model="menuItem.name" autofocus></Input>
                </FormItem>
                <FormItem label="菜单等级">
                    <Select v-model="menuItem.level">
                        <Option value="first" key="first">一级菜单</Option>
                        <Option value="lower" key="lower">下级菜单</Option>
                    </Select>
                </FormItem>
                <FormItem v-show="isLowerMenu" label="父菜单">
                    <Select v-model="menuItem.parentId">
                        <Option v-for="item in menus" :key="item.id" :value="item.id" :label="item.title">
                            <!-- 图标 -->
                            <span :style="{marginLeft: `${(item.level - 1)*18}px`}">
                                <Icon :type= "` iconfont ${item.child ? 'icon-folder' : 'icon-page'}`"></Icon>
                                <span>{{item.title}}</span>
                            </span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="页面路径" prop="pagePath">
                    <Input v-model="menuItem.pagePath"></Input>
                </FormItem>
                <FormItem label="路由地址" prop="routeUrl">
                    <Input v-model="menuItem.routeUrl"></Input>
                </FormItem>
                <FormItem label="菜单图标">
                    <Input v-model="menuItem.icon" style="width: 64%;display: inline-block;"></Input>
                    <Button size="small" to="/iconfont" target="_blank">
                        <SvgIcon icon-text="chakan"></SvgIcon> 图标库
                    </Button>
                </FormItem>
            </Form>
        </EditModal>

        <!-- 按钮设置抽屉 -->
        <Drawer :closable="true" v-model="drawerBtn" :width="450" :inner="true" :mask="true" :transfer="false">
            <p slot="header">
                <ModalTitle custom="iconfont icon-shezhi" :title="btnSettingTitle"></ModalTitle>
            </p>
            <Toolbar :btnList="btnSettingToolBar" height="28px" @click1="addBtn"></Toolbar>
            <Table :loading="btnTableLoading" :columns="btnSettingColumns" :data="btnSettingData" size="small"></Table>
        </Drawer>

        <!-- 添加 or 编辑 按钮弹窗 -->
        <EditModal ref="btnModal" modal-name="btn" :title="modalTitle" :modal-status="modalBtn" :is-edit="isEdit"
                   :ok-loading="modalLoading" @on-ok="modalOk" @on-cancel="modalBtn=false">
            <Form ref="btnForm" :rules="ruleValidateBtn" :model="btnItem" label-position="left" :label-width="50">
                <FormItem label="名称" prop="name">
                    <Input ref="btnInput" v-model="btnItem.name"></Input>
                </FormItem>
                <FormItem label="代码" prop="code">
                    <Input v-model="btnItem.code"></Input>
                </FormItem>
            </Form>
        </EditModal>
        <!-- 删除对话框 -->
        <DeleteModal :deleteName="deleteName" :modal="deleteModal" :params="deleteParams" :url="deleteUrl" @on-cancel="deleteModal=false" @on-ok="deleteModal=false;deleteOk()" :desc="deleteDesc">
        </DeleteModal>
    </div>
</template>

<script>
  import {getMenuData, saveMenu, menuUpDown, getBtns, saveBtn} from '@/api/permission';
  import ModalTitle from '@/components/modals/modalTitle/title';

  export default {
    name: 'menu-manage',
    components: {
      ModalTitle
    },
    data() {
      return {
        tableHeight: 500,
        props: {
          stripe: false,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: false,
          treeType: true,
          isFold: false,
          expandType: false,
          selectionType: false,
          maxHeight: 'auto'
        },
        data: [],
        columns: [
          {
            label: '菜单名称',
            headerAlign: 'center',
            prop: 'name',
            width: '400px',
            minWidth: '200px'
          },
          {
            label: '页面路径',
            prop: 'pagePath',
            headerAlign: 'center',
            Width: '400px'
          },
          {
            label: '路由地址',
            prop: 'routeUrl',
            headerAlign: 'center',
            Width: '400px'
          },
          {
            label: '图标',
            headerAlign: 'center',
            template: 'icon',
            type: 'template',
            width: '50px',
            minWidth: '150px'
          },
          {
            label: '操作',
            width: '200px',
            type: 'template',
            template: 'operation',
            headerAlign: 'center',
            align: 'center'
          },
        ],
        btnList: [
          {
            text: ' 菜单录入',
            icon: 'add-copy'
          }
        ],
        selectRow: {},
        // 新建&编辑菜单检验规则
        ruleValidate: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          pagePath: [{required: true, message: '页面路径不能为空', trigger: 'blur'}],
          routeUrl: [{required: true, message: '路由地址不能为空', trigger: 'blur'}],
        },
        menuItem: {
          id: '',
          name: '',
          level: 'first',
          parentId: 'root',
          pagePath: '',
          routeUrl: '',
          icon: '',
          menuOrder: 0
        },
        // 菜单编辑or新建窗口参数
        modal: false,
        modalLoading: false,
        modalTitle: '',
        isEdit: false,
        menus: [],
        // -----
        drawerBtn: false,
        btnSettingId: '',
        btnSettingColumns: [
          { title: '操作名称',
            key: 'name'
          },
          { title: '代码',
            key: 'code'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editBtn(params.row);
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.del(params.row, 'btn');
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        btnSettingData: [],
        btnSettingToolBar: [{
          text: '添加',
          icon: 'add-copy'
        }],
        btnSettingTitle: '',
        modalBtn: false,
        deleteModal: false,
        deleteParams: [],
        deleteDesc: '',
        btnTableLoading: false,
        deleteName: '',
        btnItem: {
          id: '',
          name: '',
          code: '',
          menuId: ''
        },
        ruleValidateBtn: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          code: [{required: true, message: '代码不能为空', trigger: 'blur'}],
        },
        deleteUrl: ''
      };
    },
    computed: {
      isLowerMenu: function () {
        return this.menuItem.level != 'first';
      }
    },
    watch: {
    },
    methods: {
      //-----------------按钮设置---------------------------
      // 获取菜单页面的按钮数据
      getBtnTableData(menuId) {
        this.btnTableLoading = true;
        getBtns(menuId).then(res => {
          if (this.$isSuccess(res)) {
            this.btnSettingData = res.data.data;
          }
          this.btnTableLoading = false;
        });
      },
      // 打开按钮设置界面
      btnsetting(row) {
        this.drawerBtn = true;
        this.btnSettingId = row.id;
        this.getBtnTableData(this.btnSettingId);
        this.btnSettingTitle = `${row.name} — 按钮设置`;
      },
      // 添加按钮
      addBtn() {
        this.modalBtn = true;
        this.isEdit = false;
        this.modalTitle = '按钮';
        // 清空上一次的校验结果
        this.$refs['btnForm'].resetFields();
        this.btnItem = {
          name: '',
          code: '',
          id: '',
          menuId: this.selectRow.id
        };
        this.$util.focus(this, 'btnInput');
      },
      // 编辑按钮
      editBtn(btn) {
        this.isEdit = true;
        this.modalBtn = true;
        this.modalTitle = btn.opName;
        // 清空上一次的校验结果
        this.$refs['btnForm'].resetFields();
        this.btnItem = this.$util.copyObject(btn);
        this.btnItem.menuId = this.selectRow.id;
        this.$util.focus(this, 'btnInput');
      },
      // 删除按钮
      del(obj, type) {
        let isbtn = type == 'btn';
        this.deleteUrl = `permission/menu/${isbtn ? 'deleteBtn' : 'deleteMenu'}`;
        this.deleteModal = true;
        this.deleteDesc = isbtn ? `[${obj.name}] 按钮` : `[${obj.name}] 菜单`;
        this.deleteName = type;
        this.deleteParams = [obj];
      },
      deleteOk() {
        let isbtn = !(this.deleteDesc.indexOf('菜单') >= 0);
        // 删除完成后刷新表格数据
        if (isbtn) {
        // 按钮表格
          this.getBtnTableData(this.btnSettingId);
        } else {
          // 菜单表格
          this.getTableData();
        }
      },
      //---------------------------------------------------
      rowClick(row) {
        // 单击行
        this.selectRow = row;
      },
      upDown(row, isUp) {
        row.isUp = isUp;
        menuUpDown({id: row.id, parentId: row.parentId, menuOrder: row.menuOrder, isUp: isUp}).then(res => {
          if (this.$isSuccess(res)) {
            // 前端更新data，这样就不需要请求后台数据
            this.getTableData();
          }
        });
      },
      // 打开新建菜单界面
      addMenu() {
        // 清空上一次的校验结果和表单数据
        this.$refs['inputItem'].resetFields();
        this.menuItem.id = '';
        this.menuItem.icon = '';
        this.isEdit = false;
        this.modalTitle = '菜单';
        if (this.selectRow.id) {
          // 选中菜单，需要将选中的数据传入弹出窗
          this.menuItem.level = 'lower';
          this.menuItem.parentId = this.selectRow.id;
        } else {
          this.menuItem.level = 'first';
          this.menuItem.parentId = 'root';
        }
        this.modal = true;
        this.$util.focus(this, 'menuInput');
      },
      // 打开编辑界面
      editMenu(row) {
        this.isEdit = true;
        this.modalTitle = row.title;
        this.$refs['inputItem'].resetFields();
        let menuTmp = this.menus.find(item=>item.id == row.id);
        this.menuItem.id = row.id;
        this.menuItem.name = row.name;
        this.menuItem.pagePath = row.pagePath;
        this.menuItem.routeUrl = row.routeUrl;
        this.menuItem.icon = row.icon;
        this.menuItem.menuOrder = row.menuOrder;
        this.menuItem.level = menuTmp.level == 1 ? 'first' : 'lower';
        this.menuItem.parentId = menuTmp.parent;
        this.modal = true;
        this.$util.focus(this, 'menuInput');
      },
      modalOk(name) {
          // 刷新数据
        let isMenu = name == 'menu';
        let me = this;
        me.btnItem.menuId = this.btnSettingId;
        let formRef = 'btnForm';
        let item = me.btnItem;
        let saveFunction = saveBtn;
        if (isMenu) {
          formRef = 'inputItem';
          item = me.menuItem;
          item.parentId = this.menuItem.level == 'first' ? 'root' : item.parentId;
          item.oldPid = this.selectRow.parentId;
          saveFunction = saveMenu;
        }
        this.$refs[formRef].validate(valid => {
          if (valid) {
            this.modalLoading = true;
            // -----模拟请求时间，以展示loading的效果
            saveFunction(item).then(res => {
              if (me.$isSuccess(res)) {
                me.$Message.success(res.data.msg);
                // 刷新数据
                if (isMenu) {
                  me.modal = false;
                  me.getTableData();
                } else {
                  me.modalBtn = false;
                  me.getBtnTableData(this.btnSettingId);
                }
              }
              this.modalLoading = false;
            });
          } else {
            me.$Message.error('请填写完整！');
          }
        });
      },
      // 递归处理菜单数据，整理成下拉菜单需要的格式
      recursiveMenu(item, me, level, parent) {
        if (typeof (item.children) != 'undefined' && item.children.length > 0) {
          me.menus.push({
            id: item.id,
            title: item.name,
            level: level,
            child: true,
            parent: parent
          });
          item.children.forEach((item1) => {
            if (typeof (item1.children) === 'undefined' || item1.children.length == 0) {
              me.menus.push(me.recursiveMenu(item1, me, level + 1, item.id));
            } else {
              me.recursiveMenu(item1, me, level + 1, item1.id);
            }
          });
        } else {
          return {
            id: item.id,
            title: item.name,
            level: level,
            parent: parent
          };
        }
      },
      getTableData() {
        // 获取菜单数据
        let me = this;
        getMenuData().then(res => {
          if (me.$isSuccess(res)) {
            me.data = res.data.data;
            // 整理成下拉菜单需要的数据格式
            let level = 1;
            me.menus = [];
            me.selectRow = {};
            me.data.forEach((item) => {
              if (typeof (item.children) === 'undefined' || item.children.length == 0) {
                me.menus.push(me.recursiveMenu(item, me, level, 'root'));
              } else {
                me.recursiveMenu(item, me, level, 'root');
              }
            });
          }
        });
      }
    },
    mounted() {
      this.getTableData();
      this.tableHeight = window.innerHeight - 180;
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.tableHeight = window.innerHeight - 180;
      };
    }
  };
</script>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
    }
    #example .zk-table__cell-inner {
        padding: 0 0 0 12px;
    }
    #example .zk-table__body-row  {
        height: 35px
    }
    #example .zk-table__header-row  {
        height: 30px;
        /*background-color: #e9eff7;*/
        background-color: #ffffff;
    }
</style>
