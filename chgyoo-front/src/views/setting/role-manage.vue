<template>
    <div :style="{height: height}">
        <div style="padding-bottom: 3px">
           <span style="display: inline-block;position: relative;top: -6px">
                            名称/编码：</span>
            <span style="display: inline-block;">
                            <label>
                               <Input search enter-button v-model="roleOpts.key" style="width: 150px" size="small" @on-search="roleSearch"/>
                            </label></span>
            <span style="display: inline-block; position: relative;top: -7px">
                <SvgIconBtn iconText="add-copy" btn-text="新建" @click="addRole"></SvgIconBtn>
            </span>
        </div>
        <tables ref="roleTable" showIndex :loading="roleOpts.loading" :columns="roleOpts.columns" :total="roleOpts.total"
                :prop-data="roleOpts.data" :height="roleOpts.height" sizeTextFontSize="12px"
                :pagerPageSize="20" :pagerPageSizeOpts="[10, 20, 50]" @load-data="getRoleTableData"></tables>
        <Drawer :closable="true" v-model="drawerRole" :width="580" :inner="true" :mask="true" :transfer="false" :mask-closable="false" @on-close="closeDrawer">
            <p slot="header">
                <ModalTitle custom="iconfont icon-shezhi" :title="`菜单设置${roleTitle}`"></ModalTitle>
            </p>
            <div :style="{height: height}">
                <Split v-model="split2" >
                    <div slot="left" class="role">
                        <Card :style="{height: height}">
                            <span slot="title" class="role_title">菜单列表</span>
                            <div style="padding: 8px">
                                <ButtonGroup style="float: right">
                                    <SvgIconBtn icon-text="total_selection" tip="全选" :disabled="treeOpts.allKeys.length <= treeOpts.checkKeys.length" @click="selectAll"></SvgIconBtn>
                                    <SvgIconBtn icon-text="zhongzhi" tip="重置" :disabled="saveMenuDisabled" @click="resetMenu"></SvgIconBtn>
                                    <SvgIconBtn icon-text="baocun1" :disabled="saveMenuDisabled" :loading="saveMenuLoading" @click="saveMenu"></SvgIconBtn>
                                </ButtonGroup>
                                <div :style="{overflowY: 'auto', overflowX: 'hidden', clear: 'both', height: treeOpts.treeDivHeight, paddingTop: '10px'}">
                                    <Button type="text" v-show="menuLoading" :loading="menuLoading">加载中……</Button>
                                    <ChuTree ref="menuTree" :data="treeOpts.data" :default-expand-all="true" :props="treeOpts.props" show-checkbox
                                             show-icon parent-icon=" iconfont icon-folder"  leaf-icon=" iconfont icon-page"
                                             node-key="id" :expand-on-click-node="false" :default-checked-keys="treeOpts.keys" :highlight-current="true"
                                             @node-click="selectNode1" @check-change="menuCheckChange"></ChuTree>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div slot="right" class="role">
                        <Card :style="{height: height}">
                            <span slot="title" class="role_title">按钮列表{{typeof (selectMenu.name) != 'undefined' && selectMenu.name != '' ? ' [ ' + selectMenu.name + ' ]' : ''}}</span>
                            <div style="padding: 8px">
                                <ButtonGroup style="padding-bottom: 3px;float: right">
                                    <SvgIconBtn icon-text="total_selection" tip="全选" :disabled="btnOpts.checkValue.length >= btnOpts.selectBtns.length"  @click="selectAllBtns"></SvgIconBtn>
                                    <SvgIconBtn icon-text="zhongzhi" tip="重置" :disabled="btnOpts.saveBtnDisabled" @click="resetBtns"></SvgIconBtn>
                                    <SvgIconBtn icon-text="baocun1" :disabled="btnOpts.saveBtnDisabled" @click="saveBtns"></SvgIconBtn>
                                </ButtonGroup>
                                <Button type="text" v-show="btnLoading" :loading="btnLoading">加载中……</Button>
                                <CheckboxGroup v-model="btnOpts.checkValue" @on-change="btnCheckChange">
                                    <div v-for="item in btnOpts.selectBtns" style="margin-bottom: 5px;clear: both">
                                        <Checkbox :label="item.id" v-model="item.checked">&nbsp;{{item.name}}</Checkbox>
                                    </div>
                                </CheckboxGroup>
                            </div>
                        </Card>
                    </div>
                </Split>
            </div>
        </Drawer>
        <Drawer :closable="true" v-model="drawerUser" :width="500" :inner="true" :mask="true" :transfer="false" :mask-closable="false">
            <p slot="header">
                <ModalTitle custom="iconfont icon-shezhi" :title="`角色用户${roleTitle}`"></ModalTitle>
            </p>
            <Tabs :animated="true" size="small" v-model="roleUserTab">
                <TabPane label="组织" name="dept">
                    <tables ref="roleDeptTable" :loading="roleDeptTableOpts.loading" :columns="roleDeptTableOpts.columns" :total="roleDeptTableOpts.total"
                            :prop-data="roleDeptTableOpts.data" :height="roleUserTableHeight" sizeTextFontSize="12px"
                            :pagerPageSize="20" :pagerPageSizeOpts="[10, 20, 30]" @load-data="getRoleDeptTableData"></tables>
                </TabPane>
                <TabPane label="用户" name="user">
                    <tables ref="roleUserTable" :loading="roleUserTableOpts.loading" :columns="roleUserTableOpts.columns" :total="roleUserTableOpts.total"
                            :prop-data="roleUserTableOpts.data" :height="roleUserTableHeight" sizeTextFontSize="12px"
                            :pagerPageSize="20" :pagerPageSizeOpts="[10, 20, 30]" @load-data="getRoleUserTableData"></tables>
                </TabPane>
                <TabPane label="自定义组" name="group">
                    <tables ref="roleGroupTable" :loading="roleGroupTableOpts.loading" :columns="roleGroupTableOpts.columns" :total="roleGroupTableOpts.total"
                            :prop-data="roleGroupTableOpts.data" :height="roleUserTableHeight" sizeTextFontSize="12px"
                            :pagerPageSize="20" :pagerPageSizeOpts="[10, 20, 30]" @load-data="getRoleGroupTableData"></tables>
                </TabPane>
            </Tabs>
        </Drawer>
        <EditModal :modal-status="roleOpts.roleModal" :ok-loading="okLoading" :is-edit="isEdit"
                   :title="modalTitle" @on-ok="modalOk" @on-cancel="roleOpts.roleModal=false" width="350px">
            <Form ref="roleForm" :rules="rules" :model="roleItem" label-position="left" :label-width="70">
                <FormItem label="编码" prop="code">
                    <Input ref="roleCode" v-model="roleItem.code"></Input>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input v-model="roleItem.name"></Input>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="roleItem.desc" type="textarea"></Input>
                </FormItem>
                <FormItem label="到期日">
                    <DatePicker type="date" placeholder="Select date" :options="roleOpts.dateOption" v-model="roleItem.invalidTime" style="width: 220px" @on-change="changeDate"></DatePicker>
                </FormItem>
            </Form>
        </EditModal>
        <!-- 查看组成员 -->
        <EditModal closable icon="iconfont icon-members" :modal-status="roleGroupTableOpts.modal" :full-title="`查看组成员 ${roleGroupTableOpts.selectGroup ? '[ ' + roleGroupTableOpts.selectGroup.name +' ]' : ''}`" :cancel="false" width="500px" @on-ok="roleGroupTableOpts.modal=false" @on-cancel="roleGroupTableOpts.modal=false">
            <tables ref="roleGroupUserTable" :loading="roleGroupTableOpts.loading2" :columns="roleUserTableOpts.columns" :total="roleGroupTableOpts.total2"
                    :prop-data="roleGroupTableOpts.data2" height="300px" sizeTextFontSize="12px" @load-data="getGroupUserTableData"></tables>
        </EditModal>
        <!-- 删除对话框 -->
        <DeleteModal :modal="roleOpts.deleteModal" :params="roleOpts.deleteParams" url="permission/role/delete" @on-cancel="roleOpts.deleteModal=false" @on-ok="deleteOk" :desc="roleOpts.deleteDesc">
        </DeleteModal>
    </div>
</template>

<script>
  import ChuTree from '@/components/chu-tree-iview-chg';
  import ModalTitle from '@/components/modals/modalTitle/title';
  import util from '@/libs/util';
  import Auth from '@/libs/auth';

  import {getRoles, saveRole, getMenuData, saveRoleMenu, getRoleMenu, getRoleMenuBtn, saveRoleMenuBtn, getRoleUser, getGroupUserPage} from '@/api/permission';

  export default {
    name: 'role-manage',
    components: {
      ChuTree,
      ModalTitle
    },
    data() {
      return {
        split: 0.5,
        height: '200px',
        split2: 0.6,
        drawerRole: false,
        drawerUser: false,
        roleOpts: {
          columns: [
            {
              title: '角色编码',
              key: 'code',
              width: 120
            },
            {
              title: '角色名称',
              key: 'name',
              width: 200
            },
            {
              title: '描述',
              key: 'desc'
            },
            {
              title: '有效期（距今/天）',
              key: 'validDays',
              width: 150,
              align: 'center'
            },
            {
              title: '状态',
              key: 'status',
              width: 80,
              align: 'center'
            },
            {
              title: '操作',
              key: 'action',
              width: 230,
              align: 'center',
              render: (h, params) => {
                return h('ButtonGroup', [
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'chilun',
                      tip: '菜单设置'
                    },
                    on: {
                      'click': () => {
                        this.getMenus(params.row);
                      }
                    }
                  }),
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'ren',
                      tip: '该角色的用户'
                    },
                    on: {
                      'click': () => {
                        this.getRoleUser(params.row);
                      }
                    }
                  }),
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'bianji1',
                      tip: '编辑'
                    },
                    on: {
                      'click': () => {
                        this.editRole(params.row);
                      }
                    }
                  }),
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'delete1',
                      btnName: 'role-delete'
                    },
                    on: {
                      'click': () => {
                        this.delRole(params.row);
                      }
                    }
                  })
                ]);
              }
            }
          ],
          data: [],
          total: 0,
          height: '200px',
          key: '',
          loading: false,
          roleModal: false,
          dateOption: {
            disabledDate (date) {
              return date && date.valueOf() < Date.now() - 86400000;
            }
          },
          deleteModal: false,
          deleteParams: [],
          deleteDesc: ''
        },
        roleItem: {
          name: '',
          code: '',
          desc: '',
          invalidTime: null,
          invalidTimeFmt: ''
        },
        rules: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          code: [{required: true, message: '编码不能为空', trigger: 'blur'}]
        },
        okLoading: false,
        isEdit: false,
        modalTitle: '',
        selectRole: {},
        // -------菜单&按钮设置参数--------------
        // 菜单
        treeOpts: {
          data: [],
          treeDivHeight: '400px',
          props: {
            children: 'children',
            label: 'name'
          },
          keys: [],
          allKeys: [],
          checkKeys: [],
          add: [],
          remove: []
        },
        selectMenu: {},
        selectMenuNode: {},
        saveMenuLoading: false,
        saveMenuDisabled: true,
        menuLoading: true,
        // 按钮
        btnLoading: false,
        btnOpts: {
          defaultBtns: [],
          selectBtns: [],
          checkValue: [],
          saveBtnDisabled: true,
          add: [],
          remove: []
        },
        // 角色用户表格配置
        roleUserTab: 'dept',
        roleUserTableHeight: '500px',
        roleDeptTableOpts: {
          columns: [
            {
              title: '名称',
              key: 'name',
              align: 'center',
              sortable: true
            },
            {
              title: '详细',
              key: 'detail',
              align: 'center',
              tooltip: true
            },
          ],
          data: [],
          loading: false,
          total: 0
        },
        roleUserTableOpts: {
          columns: [
            {
              title: '工号',
              key: 'id',
              align: 'center',
              sortable: true,
              width: 100,
              render: (h, params) => {
                return h('span', params.row.custom == '1' ? '自定义用户' : params.row.id);
              }
            },
            {
              title: '姓名',
              key: 'name',
              align: 'center',
              sortable: true,
              width: 120
            },
            {
              title: '岗位',
              key: 'post',
              tooltip: true
            }
          ],
          data: [],
          loading: false,
          total: 0
        },
        roleGroupTableOpts: {
          columns: [
            {
              title: '名称',
              key: 'name',
              sortable: true,
              align: 'center'
            },
            {
              title: '操作',
              key: 'action',
              width: 130,
              align: 'center',
              render: (h, params) => {
                return h('SvgIconBtn', {
                  props: {
                    iconText: 'sousuo1',
                    tip: '查看组成员'
                  },
                  on: {
                    'click': () => {
                      this.getGroupUser(params.row);
                    }
                  }
                });
              }
            },
          ],
          data: [],
          data2: [],
          loading: false,
          loading2: false,
          total: 0,
          total2: 0,
          modal: false,
          selectGroup: null
        },
      };
    },
    computed: {
      roleTitle() {
        return this.selectRole.name ? ` [ ${this.selectRole.name} ]` : '';
      }
    },
    methods: {
      roleSearch() {
        this.$refs.roleTable.search();
      },
      getRoleTableData() {
        // 获取表格参数
        let params = this.$refs.roleTable.getParams();
        params.key = this.roleOpts.key;
        this.roleOpts.loading = true;
        getRoles(params).then(res => {
          if (this.$isSuccess(res)) {
            let json = res.data.data;
            this.roleOpts.data = json.dataList;
            this.roleOpts.total = json.totalSize;
          }
          this.roleOpts.loading = false;
        });
      },
      // 根据角色获取菜单列表
      getMenus(role) {
        this.drawerRole = true;
        this.selectRole = role;
        // 1. 获取所有的菜单
        let me = this;
        getMenuData().then(res => {
          if (me.$util.isSuccess(res)) {
            // 2. 获取已选择的菜单
            getRoleMenu(role.id).then(res1 => {
              if (me.$util.isSuccess(res1)) {
                this.menuLoading = false;
                me.treeOpts.data = res.data.data;
                me.treeOpts.keys = res1.data.data;
                me.treeOpts.checkKeys = me.treeOpts.keys.map(id => {return id;});
                res.data.data.forEach((item) => {
                  this.recursive(item, this.treeOpts.allKeys);
                });
              }
            });
          }
        });
      },
      // 菜单全选
      selectAll() {
        this.$refs.menuTree.setCheckedKeys(this.treeOpts.allKeys);
      },
      // 菜单重置
      resetMenu() {
        this.$refs.menuTree.setCheckedKeys(this.treeOpts.keys);
      },
      recursive(obj, selectedKeys) {
        if (obj.children && obj.children.length > 0) {
          obj.children.forEach((item) =>  {
            this.recursive(item, selectedKeys);
          });
        } else {
          selectedKeys.push(obj.id);
        }
      },
      // 菜单选择发生变化时触发
      menuCheckChange(data, checked) {
        // 不保存父菜单
        if (data.children.length > 0) {
          return ;
        }
        if (checked) {
          this.treeOpts.checkKeys.push(data.id);
        } else {
          let index = this.treeOpts.checkKeys.indexOf(data.id);
          if (index != -1) {
            this.treeOpts.checkKeys.splice(index, 1);
          }
        }
        // 检查是否需要保存菜单
        let calResult = util.calAddRemove(this.treeOpts.keys, this.treeOpts.checkKeys);
        this.treeOpts.add = calResult.add;
        this.treeOpts.remove = calResult.remove;
        this.saveMenuDisabled = !calResult.changed;
      },
      saveMenu(fromBtn) {
        return new Promise(resolve => {
        // 获取被选中的叶子节点
          let params = {
            roleId: this.selectRole.id,
            addMenuIds: this.$util.fmtIdArr(this.treeOpts.add),
            removeMenuIds: this.$util.fmtIdArr(this.treeOpts.remove)
          };
          this.saveMenuLoading = true;
          let me = this;
          saveRoleMenu(params).then(res => {
            if (me.$util.isSuccess(res)) {
              // 更新已经保存到数据库的角色菜单
              me.treeOpts.keys = me.treeOpts.checkKeys.map(id => {return id;});
              me.$Message.success(res.data.msg);
              me.saveMenuDisabled = true;
              if (!fromBtn === true && (me.treeOpts.remove.indexOf(me.selectMenu.id) >= 0 && me.btnOpts.checkValue.length > 0)) {
                me.btnOpts.defaultBtns = [];
                me.btnOpts.checkValue = [];
                me.btnOpts.saveBtnDisabled = true;
              }
              if (!fromBtn === true) {
                me.btnOpts.saveBtnDisabled = true;
              }
              resolve(true);
            } else {
              resolve(false);
            }
            me.saveMenuLoading = false;
          });
        });
      },
      closeDrawer() {
        // 菜单
        this.treeOpts.keys = [];
        this.treeOpts.allKeys = [];
        this.treeOpts.checkKeys = [];
        this.treeOpts.data = [];
        this.saveMenuDisabled = true;
        this.menuLoading = true;
        this.selectMenu = {};
        this.selectMenuNode = {};
        // 按钮
        this.btnOpts.selectBtns = [];
        this.btnOpts.checkValue = [];
        this.btnOpts.defaultBtns = [];
        this.btnOpts.saveBtnDisabled = true;
      },
      //------根据菜单获取按钮------
      selectNode1(node) {
        this.selectMenu = node;
        this.selectMenuNode = this.$refs.menuTree.getNode(node);
        if (node.children.length > 0) {
          // 父菜单没有页面，所以肯定也没有按钮
          this.resetBtnValue();
          return ;
        }
        this.getMenuBtns();
      },
      resetBtnValue() {
        this.btnOpts.selectBtns = [];
        this.btnOpts.saveBtnDisabled = true;
        this.btnOpts.defaultBtns = [];
        this.btnOpts.checkValue = [];
      },
      getMenuBtns() {
        this.resetBtnValue();
        this.btnLoading = true;
        // 获取已选择的按钮
        getRoleMenuBtn(this.selectRole.id, this.selectMenu.id).then(res => {
          if (this.$util.isSuccess(res)) {
            let data = res.data.data;
            // 该菜单下的所有按钮
            this.btnOpts.selectBtns = data.btns;
            this.btnOpts.defaultBtns = data.checks;
            this.btnOpts.checkValue = data.checks.map(item => {return item;});
          }
          this.btnLoading = false;
        });
      },
      selectAllBtns() {
        let arr = [];
        this.btnOpts.selectBtns.forEach(item => arr.push(item.id));
        this.btnOpts.checkValue = arr;
        // 因为通过外部修改value是不会触发事件的，因此需要手动调用
        this.btnCheckChange(arr);
      },
      resetBtns() {
        this.btnOpts.checkValue = this.btnOpts.defaultBtns;
        this.btnCheckChange(this.btnOpts.checkValue);
      },
      // 按钮选择时触发
      btnCheckChange(value) {
        let tree = this.$refs.menuTree;
        if (value.length > 0 && !this.selectMenuNode.checked) {
          tree.setChecked(this.selectMenu, true, true);
        }
        let calResult = util.calAddRemove(this.btnOpts.defaultBtns, value);
        this.btnOpts.add = calResult.add;
        this.btnOpts.remove = calResult.remove;
        this.btnOpts.saveBtnDisabled = !calResult.changed;
      },
      // 发送保存按钮请求
      sendSaveBtns() {
        let params = {
          roleId: this.selectRole.id,
          menuId: this.selectMenu.id,
          addBtnIds: this.$util.fmtIdArr(this.btnOpts.add),
          removeBtnIds: this.$util.fmtIdArr(this.btnOpts.remove)
        };
        saveRoleMenuBtn(params).then(res => {
          if (this.$util.isSuccess(res)) {
            this.btnOpts.defaultBtns = this.btnOpts.checkValue;
            this.btnOpts.saveBtnDisabled = true;
            this.$Message.success(res.data.msg);
          }
        });
      },
      saveBtns() {
        // 判断是否同时需要保存菜单
        if(!this.saveMenuDisabled) {
          this.saveMenu(true).then(success => {
            // 保存完菜单才能保存按钮
            if (success) {
              this.sendSaveBtns();
            }
          });
        } else {
          // 菜单已保存，可以直接保存按钮
          this.sendSaveBtns();
        }
      },
      //------角色添加 编辑------
      addRole() {
        this.roleOpts.roleModal = true;
        this.isEdit = false;
        this.modalTitle = '角色';
        this.$refs['roleForm'].resetFields();
        this.roleItem.id = '';
        this.roleItem.desc = '';
        this.roleItem.invalidTime = null;
        this.roleItem.invalidTimeFmt = '';
        // 设置延时，使得第一个input框可以自动获取焦点
        this.$util.focus(this, 'roleCode');
      },
      editRole(row) {
        this.roleOpts.roleModal = true;
        this.isEdit = true;
        this.$refs['roleForm'].resetFields();
        this.roleItem = this.$util.copyObject(row);
        this.modalTitle = this.roleItem.name;
        // 设置延时，使得第一个input框可以自动获取焦点
        this.$util.focus(this, 'roleCode');
      },
      delRole(row) {
        this.roleOpts.deleteModal = true;
        this.roleOpts.deleteDesc = `[${row.name}]`;
        this.roleOpts.deleteParams = [row];
      },
      deleteOk() {
        this.roleOpts.deleteModal = false;
        this.getRoleTableData();
      },
      changeDate(text) {
        this.roleItem.invalidTimeFmt = text;
      },
      modalOk() {
        let me = this;
        this.$refs['roleForm'].validate(valid => {
          if (valid) {
            this.okLoading = true;
            let params = {
              id: this.roleItem.id,
              name: this.roleItem.name,
              code: this.roleItem.code,
              desc: this.roleItem.desc,
              fmtDate: this.roleItem.invalidTimeFmt
            };
            saveRole(params).then(res => {
              if (me.$isSuccess(res)) {
                me.$Message.success(res.data.msg);
                this.roleOpts.roleModal = false;
                this.getRoleTableData();
              }
              this.okLoading = false;
            });
          } else {
            me.$Message.error('请填写完整！');
          }
        });
      },
      // --------获取该角色下的用户---------
      getRoleUser(row) {
        this.selectRole = row;
        this.drawerUser = true;
        this.roleUserTab = 'dept';
        this.$refs.roleUserTable.search();
        this.$refs.roleDeptTable.search();
        this.$refs.roleGroupTable.search();
      },
      getRoleDeptTableData() {
        if (this.selectRole.id) {
          let params = this.$refs.roleDeptTable.getParams();
          params.roleId= this.selectRole.id;
          params.type = 1;
          this.roleDeptTableOpts.loading = true;
          getRoleUser(params).then(res => {
            if(this.$isSuccess(res)) {
              this.roleDeptTableOpts.data = res.data.data.dataList;
              this.roleDeptTableOpts.total = res.data.data.totalSize;
            }
            this.roleDeptTableOpts.loading = false;
          });
        }
      },
      getRoleGroupTableData() {
        if (this.selectRole.id) {
          let params = this.$refs.roleGroupTable.getParams();
          params.roleId= this.selectRole.id;
          params.type = 3;
          this.roleGroupTableOpts.loading = true;
          getRoleUser(params).then(res => {
            if(this.$isSuccess(res)) {
              this.roleGroupTableOpts.data = res.data.data.dataList;
              this.roleGroupTableOpts.total = res.data.data.totalSize;
            }
            this.roleGroupTableOpts.loading = false;
          });
        }
      },
      getRoleUserTableData() {
        if (this.selectRole.id) {
          let params = this.$refs.roleUserTable.getParams();
          params.roleId= this.selectRole.id;
          params.type = 2;
          this.roleUserTableOpts.loading = true;
          getRoleUser(params).then(res => {
            if(this.$isSuccess(res)) {
              this.roleUserTableOpts.data = res.data.data.dataList;
              this.roleUserTableOpts.total = res.data.data.totalSize;
            }
            this.roleUserTableOpts.loading = false;
          });
        }
      },
      getGroupUser(group) {
        this.roleGroupTableOpts.modal = true;
        this.roleGroupTableOpts.selectGroup = group;
        this.$refs.roleGroupUserTable.search();
      },
      getGroupUserTableData() {
        let params = this.$refs.roleGroupUserTable.getParams();
        params.groupId = this.roleGroupTableOpts.selectGroup.id;
        this.roleGroupTableOpts.loading2 = true;
        getGroupUserPage(params).then(res => {
          if (this.$isSuccess(res)) {
            this.roleGroupTableOpts.data2 = res.data.data.dataList;
            this.roleGroupTableOpts.total2 = res.data.data.totalSize;
          }
          this.roleGroupTableOpts.loading2 = false;
        });
      },
      setHeight() {
        this.height = `${window.innerHeight - 150}px`;
        this.roleOpts.height = `${window.innerHeight - 220}px`;
        this.treeOpts.treeDivHeight = `${window.innerHeight - 255}px`;
        this.roleUserTableHeight = `${window.innerHeight - 235}px`;
      }
    },
    mounted() {
      this.getRoleTableData();
      this.setHeight();
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.setHeight();
      };
    }
  };
</script>
