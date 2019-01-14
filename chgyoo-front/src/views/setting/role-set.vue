<template>
    <div :style="{height: height}" >
        <Tabs type="card" value="org">
            <TabPane label="组织架构" name="org">
            <div style="padding: 5px;width:100%;">
                <div style="padding: 0 0 12px 20px">
                    <span style="display: inline-block">
                    <Input search enter-button v-model="orgSearchKey" style="width: 180px" size="small" @on-search="orgSearch"/>
                        </span>
                    <span style="display: inline-block;position: relative;top:-7px">
                        <SvgIconBtn icon-text="members" tip="点击选中组织，设置组织的角色" btn-text="按组授权" @click="setRole(1)" :disabled="!selectedDept.id"></SvgIconBtn>
                    </span>
                </div>
                <Row>
                    <!-- 组织架构树 -->
                    <Col span="8">
                        <div style="width: 100%;color: grey;font-size: 12px;padding-left: 20px">{{orgSearchDesc}}</div>
                        <div :style="{overflowY: 'auto', height: treeOpts.height,marginRight: '20px'}">
                            <Button type="text" v-show="treeOpts.loading" :loading="treeOpts.loading">加载中……</Button>
                            <ChuTree ref="orgTree" :data="treeOpts.data" :default-expand-all="treeOpts.expand" :props="treeOpts.props" :show-checkbox="false" :font-size="13"
                                 show-icon parent-icon=" iconfont icon-folder"  leaf-icon=" iconfont icon-page" :icon-size="14"
                                 node-key="id" :expand-on-click-node="false" :highlight-current="true"
                                     :filter-node-method="orgFilterMethod"  @node-click="selectDept"></ChuTree>
                        </div>
                    </Col>
                    <!-- 科室员工表格 -->
                    <Col span="16" >
                        <span style="font-weight: bold;display: block;padding-bottom: 5px;height: 25px">
                            {{selectedDept.name ? '[ ' + selectedDept.name + ' ]' : ''}}
                        </span>
                        <Tables :columns="orgUserOpts.column" :prop-data="orgUserOpts.data" :show-page="false" :loading="orgUserOpts.loading"></Tables>
                    </Col>
                </Row>
            </div>
            </TabPane>
            <TabPane label="自定义组" name="group">
                <div style="padding: 5px">
                    <div style="padding-bottom: 5px">
                        <span style="display: inline-block;position: relative;top:-6px">
                            名称：
                        </span>
                        <span style="display: inline-block;">
                            <Input search enter-button v-model="groupOpts.searchKey" style="width: 180px;" size="small" @on-search="getGroupTableData"/>
                        </span>
                        <span style="display: inline-block;position: relative;top: -7px">
                            <SvgIconBtn iconText="add-copy" btn-text="新建" @click="addGroup"></SvgIconBtn>
                        </span>
                    </div>
                    <tables ref="groupTable" showIndex :loading="groupOpts.loading" :columns="groupOpts.columns" :total="groupOpts.total"
                            :prop-data="groupOpts.data" :height="groupOpts.height" :indexWidth="80"
                             @load-data="getGroupTableData"></tables>
                </div>
            </TabPane>
            <TabPane label="自定义用户" name="cusUser">
                <div style="padding: 5px">
                    <div style="padding-bottom: 5px">
                        <span style="display: inline-block;position: relative;top:-6px">
                            名称/编码：
                        </span>
                        <span style="display: inline-block;">
                            <Input search enter-button v-model="cusUserOpts.searchKey" style="width: 180px;" size="small" @on-search="getCusUserTableData"/>
                        </span>
                        <span style="display: inline-block;position: relative;top: -7px">
                            <SvgIconBtn iconText="add-copy" btn-text="新建" @click="addCusUser"></SvgIconBtn>
                        </span>
                    </div>
                    <tables ref="cusUserTable" showIndex :loading="cusUserOpts.loading" :columns="cusUserOpts.columns" :total="cusUserOpts.total"
                            :prop-data="cusUserOpts.data" :height="cusUserOpts.height" :indexWidth="80"
                            @load-data="getCusUserTableData"></tables>
                </div>
            </TabPane>
        </Tabs>
        <!-- 选择角色窗口 -->
        <EditModal width="580px" :modalStatus="modalStatus" :ok-loading="okLoading" closable icon="iconfont icon-fuwushouquan" full-title="角色设置" @on-ok="modalOk" @on-cancel="modalStatus=false">
            <Transfer
                    :list-style="roleOpts.listStyle"
                    :titles="['可选', '已选']"
                    :data="roleOpts.data"
                    :target-keys="roleOpts.tgtKeys"
                    filterable
                    :filter-method="filterMethod"
                    @on-change="handleChange"></Transfer>
        </EditModal>
        <!-- 新建&修改用户组窗口 -->
        <EditModal :modalStatus="groupOpts.modal" :ok-loading="groupOpts.okLoading" :is-edit="groupOpts.isEdit"
                   :title="groupOpts.modalTitle" closable @on-ok="groupModalOk" @on-cancel="groupOpts.modal=false" width="350px">
            <Form ref="groupForm" :rules="groupOpts.rules" :model="groupOpts.formItem" label-position="left" :label-width="70">
                <FormItem label="名称" prop="name">
                    <Input ref="cusGroupInput" v-model="groupOpts.formItem.name"></Input>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="groupOpts.formItem.desc" type="textarea" :rows="3"></Input>
                </FormItem>
                <FormItem label="到期日">
                    <DatePicker type="date" placeholder="Select date" :options="groupOpts.dateOption" v-model="groupOpts.formItem.invalidTime" style="width: 220px" @on-change="changeDate"></DatePicker>
                </FormItem>
            </Form>
        </EditModal>
        <!-- 删除用户组 -->
        <DeleteModal :modal="groupOpts.deleteModal" :params="groupOpts.deleteParams" url="permission/user/delGroup" @on-cancel="groupOpts.deleteModal=false" @on-ok="deleteOk" :desc="groupOpts.deleteDesc">
        </DeleteModal>
        <!-- 用户组选择用户 -->
        <EditModal width="750px" :modalStatus="groupOpts.modal2" :ok-loading="groupOpts.saveUserLoading"
                   icon="iconfont icon-shouquan1" full-title="选择组成员" closable @on-ok="userModalOk" @on-cancel="groupOpts.modal2=false">
            <Row type="flex" align="middle" justify="center">
                <!-- 员工信息树 -->
                <Col span="14">
                    <Card style="height: 350px">
                        <div class="searchInput">
                        <Input search enter-button placeholder="组织或者员工工号/姓名" v-model="groupOpts.userSearch1" size="small" @on-search="groupUserSearch"/>
                        </div>
                        <div style="overflow-y: auto;height: 280px;">
                        <Button type="text" v-show="groupOpts.treeLoading" :loading="groupOpts.treeLoading">加载中……</Button>
                        <Button type="text" v-show="groupOpts.treeSearch">无结果</Button>
                        <ChuTree ref="userTree" :data="groupOpts.treeData" :default-expand-all="true" :props="treeOpts.props" :default-checked-keys="groupOpts.defaultCheck" show-checkbox :font-size="12"
                                 show-icon parent-icon=" iconfont icon-folder"  leaf-icon=" iconfont icon-page" :icon-size="13" :filter-node-method="groupOpts.treeFilterMethod"
                                 node-key="id" :expand-on-click-node="false" check-on-click-node :highlight-current="true"></ChuTree>
                        </div>
                    </Card>
                </Col>
                <Col span="2" style="text-align: center">
                    <Button @click="addUser">
                        >
                    </Button>
                    <Button @click="removeUser">
                        <
                    </Button>
                </Col>
                <!-- 选择的用户 -->
                <Col span="8" >
                    <Card style="height: 350px">
                        <div class="searchInput">
                            <Input search enter-button placeholder="员工工号/姓名/账号" v-model="groupOpts.userSearch2" size="small" @on-search="addedUserSearch"/>
                        </div>
                        <CheckboxGroup v-model="groupOpts.userRemoves">
                            <div v-for="item in groupOpts.userAddsTmp" style="margin-bottom: 5px;clear: both">
                                <Checkbox :label="item.id">&nbsp;{{item.name}}</Checkbox>
                             </div>
                        </CheckboxGroup>
                    </Card>
                </Col>
            </Row>
        </EditModal>
        <!-- 新建&修改 自定义用户 窗口 -->
        <EditModal :modalStatus="cusUserOpts.modal" :ok-loading="cusUserOpts.okLoading" :is-edit="cusUserOpts.isEdit"
                   :title="cusUserOpts.modalTitle" closable @on-ok="cusUserModalOk" @on-cancel="cusUserOpts.modal=false" width="350px">
            <Form ref="cusUserForm" :rules="cusUserOpts.rules" :model="cusUserOpts.formItem" label-position="left" :label-width="70">
                <FormItem label="账号" prop="account">
                    <Input ref="cusUserInput" v-model="cusUserOpts.formItem.account"></Input>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input v-model="cusUserOpts.formItem.name"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input v-model="cusUserOpts.formItem.password" type="password"></Input>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="cusUserOpts.formItem.post" type="textarea" :rows="3"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="cusUserOpts.formItem.status">
                        <Option value="1" key="1">生效</Option>
                        <Option value="0" key="0">失效</Option>
                    </Select>
                </FormItem>
            </Form>
        </EditModal>
        <!-- 删除 自定义用户 -->
        <DeleteModal :modal="cusUserOpts.deleteModal" :params="cusUserOpts.deleteParams" url="permission/user/deleteCusUser" @on-cancel="cusUserOpts.deleteModal=false" @on-ok="cusUserOpts.deleteModal=false;getCusUserTableData()" :desc="cusUserOpts.deleteDesc">
        </DeleteModal>
    </div>
</template>

<script>
  import ChuTree from '@/components/chu-tree-iview-chg';
  import {getOrg, getGroupUser, getDeptByUser, getSelectRole, saveSelectRole, getGroupTableData, saveGroup, getUserTreeData, saveGroupUser, getCusUser, addOrUpdateCusUser} from '@/api/permission';
  import util from '@/libs/util';

  export default {
    name: 'role-set',
    components: {
      ChuTree
    },
    data() {
      return {
        split: 0.5,
        height: '300px',
        // -------组织结构树配置-----------
        orgFilterMethod: function(value, data) {
          if (!(typeof (value.find(key => data.name.indexOf(key) > -1 || data.id == key)) === 'undefined')) {
            return true;
          } else {
            return false;
          }
        },
        treeOpts: {
          data: [],
          treeDivHeight: '400px',
          props: {
            children: 'children',
            label: 'name',
            isLeaf: 'leaf'
          },
          height: '',
          loading: false,
          expand: false
        },
        orgSearchDesc: '',
        orgSearchKey: '',
        selectedDept: {},
        searchDepts: [],
        // 科室成员表格
        orgUserOpts: {
          column: [
            {
              title: '工号',
              key: 'code'
            },
            {
              title: '账号',
              key: 'account'
            },
            {
              title: '姓名',
              key: 'name'
            },
            {
              title: '岗位',
              key: 'post'
            },
            {
              title: '操作',
              key: 'action',
              width: 130,
              align: 'center',
              render: (h, params) => {
                return h('SvgIconBtn', {
                  props: {
                    iconText: 'fuwushouquan-copy',
                    tip: '授权'
                  },
                  on: {
                    'click': () => {
                      this.setRole(2, params.row);
                    }
                  }
                });
              }
            }
          ],
          data: [],
          loading: false
        },
        // 选择角色对话框
        roleSetType : 0,
        roleSetItem: {},
        modalStatus: false,
        roleOpts: {
          data: [],
          tgtKeys: [],
          listStyle: {
            height: '330px',
            width: '230px'
          },
          defaultKey: []
        },
        okLoading: false,
        //------- 自定义组表格配置---------
        groupOpts: {
          searchKey: '',
          columns: [
            {
              title: '名称',
              key: 'name',
            },
            {
              title: '描述',
              key: 'desc',
            },
            {
              title: '有效期（距今/天）',
              key: 'validDays',
            },
            {
              title: '状态',
              key: 'status',
            },
            {
              title: '操作',
              key: 'action',
              align: 'center',
              render: (h, params) => {
                return h('ButtonGroup', [
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'fuwushouquan-copy',
                      tip: '授权'
                    },
                    on: {
                      'click': () => {
                        // 角色设置
                        this.setRole(3, params.row);
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
                        // 编辑
                        this.editGroup(params.row);
                      }
                    }
                  }),
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'ren',
                      tip: '成员设置'
                    },
                    on: {
                      'click': () => {
                        // 查看组成员
                        this.editGroupUser(params.row);
                      }
                    }
                  }),
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'delete1'
                    },
                    on: {
                      'click': () => {
                        // 删除
                        this.delGroup(params.row);
                      }
                    }
                  })
                ]);
              }
            }
          ],
          data: [],
          total: 0,
          height: '300px',
          loading: false,
          // 新建&编辑
          modal: false,
          okLoading: false,
          isEdit: false,
          modalTitle: '',
          formItem: {
            name: '',
            desc: '',
            invalidTime: null,
            invalidTimeFmt: ''
          },
          rules: {
            name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          },
          dateOption: {
            disabledDate (date) {
              return date && date.valueOf() < Date.now() - 86400000;
            }
          },
          // 删除
          deleteModal: false,
          deleteParams: [],
          deleteDesc: '',
          // 选择组成员
          defaultCheck: [],
          selectGroup: null,
          treeSearch: false,
          treeLoading: false,
          modal2: false,
          treeData: [],
          userSearch1: '',
          userSearch2: '',
          defaultUser: [],
          userAdds: [],
          userAddsTmp: [],
          userRemoves: [],
          saveUserLoading: false,
          treeFilterMethod: function (value, data) {
            return data.name.indexOf(value) > -1 || (data.account && data.account.indexOf(value) > 1);
          }
        },
        //-------自定义用户表格配置--------
        cusUserOpts: {
          searchKey: '',
          columns: [
            {
              title: '账号',
              key: 'account',
            },
            {
              title: '名称',
              key: 'name',
            },
            {
              title: '描述',
              key: 'post',
            },
            {
              title: '状态',
              key: 'status',
              render: (h, params) => {
                return h('div', params.row.status == '1' ? '生效' : '失效');
              }
            },
            {
              title: '操作',
              key: 'action',
              align: 'center',
              render: (h, params) => {
                return h('ButtonGroup', [
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'fuwushouquan-copy',
                      tip: '授权'
                    },
                    on: {
                      'click': () => {
                        // 角色设置
                        this.setRole(2, params.row);
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
                        // 编辑
                        this.editCusUser(params.row);
                      }
                    }
                  }),
                  h('SvgIconBtn', {
                    props: {
                      iconText: 'delete1'
                    },
                    on: {
                      'click': () => {
                        // 删除
                        this.deleteCusUser(params.row);
                      }
                    }
                  })
                ]);
              }
            }
          ],
          data: [],
          total: 0,
          height: '300px',
          loading: false,
          // 新建&编辑
          modal: false,
          okLoading: false,
          isEdit: false,
          modalTitle: '',
          formItem: {
            account: '',
            name: '',
            password: '',
            desc: '',
            status: '1'
          },
          rules: {
            name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
            account: [{required: true, message: '账号不能为空', trigger: 'blur'}],
            password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          },
          deleteModal: false,
          deleteParams: [],
          deleteDesc: ''
        }
      };
    },
    methods: {
      // ------------------组织架构---------------
      getTreeData() {
        this.treeOpts.loading = true;
        getOrg().then(res => {
          if (this.$isSuccess(res)) {
            this.treeOpts.data = res.data.data;
          }
          this.treeOpts.loading = false;
        });
      },
      orgSearch() {
        let tree = this.$refs.orgTree;
        // 刷新树的同时也刷新右边的用户表格
        if (this.selectedDept.id) {
          let node = tree.getNode(this.selectedDept.id);
          node.selected = false;
          this.selectedDept = {};
          this.orgUserOpts.data = [];
        }
        this.orgSearchDesc = '正在搜索中……';
        tree.filter([this.orgSearchKey]);
        let reNode = tree.getNodes();
        if (reNode.visible) {
          this.orgSearchDesc = '';
          this.searchDepts = [];
          this.orgSearchDesc = '';
        } else {
          // 如果按照科室部门搜不出来，进一步按照人名/工号搜索
          // 请求后台用户是否存在,返回科室的ID和用户的信息
          this.orgUserOpts.loading = true;
          this.orgSearchDesc = '正在搜索中……';
          let found = false;
          getDeptByUser(this.orgSearchKey).then(res => {
            if (this.$util.isSuccess(res)) {
              this.searchDepts = res.data.data;
              if (this.searchDepts.length > 0) {
                found = true;
                let deptIds = this.searchDepts.map(dept => {return dept.id;});
                tree.filter(deptIds);
                if (this.searchDepts.length == 1) {
                  this.orgUserOpts.data = this.searchDepts[0].userList;
                  this.selectedDept = this.searchDepts[0];
                } else {
                  this.orgUserOpts.data = [];
                }
              }
            }
            this.orgUserOpts.loading = false;
            this.orgSearchDesc = found ? this.searchDepts.length > 1 ? '搜索结果有多个，请逐个点击查看' : '' : '搜索无结果';
          });
        }
      },
      filterMethod(data, query) {
        return data.label.indexOf(query) > -1;
      },
      handleChange(newTargetKeys) {
        this.roleOpts.tgtKeys = newTargetKeys;
      },
      // 选择组织架构
      selectDept(node) {
        this.selectedDept = node;
        if (this.searchDepts.length > 0) {
          let dept = this.searchDepts.find(dept => dept.id == node.id);
          if (dept) {
            this.orgUserOpts.data = dept.userList;
          } else {
            this.orgUserOpts.data = [];
          }
          return ;
        }
        this.orgUserOpts.loading = true;
        // TODO: 刷新右边科室成员表格的数据
        getGroupUser(node.id, false).then(res => {
          if (this.$util.isSuccess(res)) {
            this.orgUserOpts.data = res.data.data;
          }
          this.orgUserOpts.loading = false;
        });
      },
      setRole(type, user) {
        this.roleOpts.defaultKey = [];
        this.roleOpts.tgtKeys = [];
        this.roleOpts.data = [];
        this.roleSetType = type;
        if (user) {
          // 按照用户设置
          this.roleSetItem = user;
        } else {
          this.roleSetItem = this.selectedDept;
        }
        this.modalStatus = true;
        getSelectRole(this.roleSetItem.id, type).then(res => {
          if (this.$isSuccess(res)) {
            let data = res.data.data;
            this.roleOpts.data = data.data;
            this.roleOpts.tgtKeys = data.target;
            this.roleOpts.defaultKey = data.target.map(id => id);
          }
        });
      },
      /**
       * 保存选择的角色
       */
      modalOk() {
        let calResult = util.calAddRemove(this.roleOpts.defaultKey, this.roleOpts.tgtKeys);
        if (calResult.changed) {
          this.okLoading = true;
          let params = {
            id: this.roleSetItem.id,
            type: this.roleSetType,
            addIds: this.$util.fmtIdArr(calResult.add),
            removeIds: this.$util.fmtIdArr(calResult.remove)
          };
          saveSelectRole(params).then(res => {
            if (this.$isSuccess(res)) {
              this.$Message.success(res.data.msg);
              this.modalStatus = false;
            }
            this.okLoading = false;
          });
        }
      },
      // ----------------------------自定义组----------------------
      // 获取自定义组数据
      getGroupTableData() {
        let params = this.$refs.groupTable.getParams();
        params.key = this.groupOpts.searchKey;
        this.groupOpts.loading = true;
        getGroupTableData(params).then(res => {
          if (this.$isSuccess(res)) {
            this.groupOpts.total = res.data.data.totalSize;
            this.groupOpts.data = res.data.data.dataList;
          }
          this.groupOpts.loading = false;
        });
      },
      addGroup() {
        this.groupOpts.modal = true;
        this.groupOpts.isEdit = false;
        this.groupOpts.modalTitle = '';
        this.$refs['groupForm'].resetFields();
        this.groupOpts.formItem = {
          id: '',
          code: '',
          name: '',
          desc: '',
          invalidTime: null,
          invalidTimeFmt: ''
        };
        this.$util.focus(this, 'cusGroupInput');
      },
      editGroup(row) {
        this.groupOpts.isEdit = true;
        this.groupOpts.modalTitle = row.name;
        this.$refs['groupForm'].resetFields();
        this.groupOpts.formItem = this.$util.copyObject(row);
        this.groupOpts.modal = true;
        this.$util.focus(this, 'cusGroupInput');
      },
      changeDate(text) {
        this.groupOpts.formItem.invalidTimeFmt = text;
      },
      // 新建&编辑
      groupModalOk() {
        let me = this;
        this.$refs['groupForm'].validate(valid => {
          if (valid) {
            let formItem = me.groupOpts.formItem;
            let params = {
              id: formItem.id,
              code: formItem.code,
              name: formItem.name,
              desc: formItem.desc,
              fmtDate: formItem.invalidTimeFmt
            };
            this.groupOpts.okLoading = true;
            saveGroup(params).then(res => {
              if (me.$isSuccess(res)) {
                me.groupOpts.modal = false;
                me.$Message.success(res.data.msg);
                this.getGroupTableData();
              }
              this.groupOpts.okLoading = false;
            });
          }
        });
      },
      delGroup(row) {
        this.groupOpts.deleteParams = [row];
        this.groupOpts.deleteDesc = row.name;
        this.groupOpts.deleteModal = true;
      },
      // 删除
      deleteOk() {
        this.groupOpts.deleteModal = false;
        this.getGroupTableData();
      },
      // ----------设置自定义组成员----------
      editGroupUser(row) {
        this.groupOpts.treeData = [];
        this.groupOpts.userSearch1 = '';
        this.groupOpts.modal2 = true;
        this.groupOpts.selectGroup = row;
        // 获取所有的用户
        getGroupUser(row.id, true).then(res => {
          if (this.$isSuccess(res)) {
            // 设置已选择的用户
            this.groupOpts.userAddsTmp = res.data.data;
            this.groupOpts.userAdds = res.data.data;
            this.groupOpts.defaultUser = res.data.data;
            // this.groupOpts.defaultCheck = res.data.data.map(user => user.id);
          }
        });
      },
      fmtUser(treeData) {
        treeData.forEach(node => {
          if(node.userList && node.userList.length > 0) {
            node.userList.forEach(item => {
              let i = 0;
              for (; i < this.groupOpts.userAdds.length; i++) {
                if (this.groupOpts.userAdds[i].id == item.id) {
                  item.disabled = true;
                  break;
                }
              }
              if (i == this.groupOpts.userAdds.length) {
                item.disabled = false;
              }
            });
            node.children = node.children.concat(node.userList);
          }
          if(node.children && node.children.length > 0) {
            this.fmtUser(node.children);
          }
        });
      },
      // 搜索用户或者组织架构
      groupUserSearch() {
        this.groupOpts.treeSearch = false;
        if (this.groupOpts.userSearch1 == '') {
          this.$Message.error('请输入关键字');
          return ;
        }
        this.groupOpts.treeLoading = true;
        getUserTreeData(this.groupOpts.userSearch1).then(res => {
          if (this.$isSuccess(res)) {
            if (res.data.data.length == 0) {
              this.groupOpts.treeSearch = true;
            } else {
              this.fmtUser(res.data.data);
              this.groupOpts.treeData = res.data.data;
              this.groupOpts.defaultCheck = this.groupOpts.userAdds.map(user => user.id);
            }
          }
          this.groupOpts.treeLoading = false;
        });
      },
      addUser() {
        // 选中的节点，只有叶子节点
        let tree = this.$refs.userTree;
        let checksOnlyLeaf = tree.getCheckedNodes(true).filter(node => node.disabled != true);
        this.groupOpts.userAdds = this.groupOpts.userAdds.concat(this.$util.copyObject(checksOnlyLeaf));
        this.groupOpts.userAddsTmp = this.groupOpts.userAddsTmp.concat(this.$util.copyObject(checksOnlyLeaf));
        // 已添加的树节点需要设置成不可选择
        checksOnlyLeaf.forEach((item) => {
          item.disabled = true;
        });
      },
      removeUser() {
        // 设置移除的用户变成可以选择的
        let removes = this.groupOpts.userRemoves;
        let tree = this.$refs.userTree;
        removes.forEach((item) => {
          // 通过ID获取节点
          let node = tree.getNode(item);
          if (node) {
            node.data.disabled = false;
            // 使用严格模式设置节点的选中状态
            node.setChecked(false, true);
          }
        });
        // 从右边移除
        let filters = this.groupOpts.userAdds.filter((item) => {
          return removes.filter((item1) => item1 == item.id).length == 0;
        });
        this.groupOpts.userAdds = filters;
        this.addedUserSearch();
        this.groupOpts.userRemoves = [];
      },
      userModalOk() {
        let oldArr = this.groupOpts.defaultUser.map(item => item.id);
        let newArr = this.groupOpts.userAdds.map(item => item.id);
        let calRe = this.$util.calAddRemove(oldArr, newArr);
        if (calRe.changed) {
          let params = {
            groupId: this.groupOpts.selectGroup.id,
            addIds: this.$util.fmtIdArr(calRe.add),
            removeIds: this.$util.fmtIdArr(calRe.remove)
          };
          this.groupOpts.saveUserLoading = true;
          saveGroupUser(params).then(res => {
            if (this.$isSuccess(res)) {
              this.$Message.success(res.data.msg);
              this.groupOpts.modal2 = false;
            }
            this.groupOpts.saveUserLoading = false;
          });
        }
      },
      /**
       * 搜索已添加的用户
       */
      addedUserSearch() {
        let key = this.groupOpts.userSearch2;
        this.groupOpts.userAddsTmp = this.groupOpts.userAdds.filter(item => item.name.indexOf(key) > -1 || (item.code && item.code.indexOf(key) > -1) || (item.account && item.account.indexOf(key) > -1));
      },
      // -------------------------自定义用户-----------------------
      getCusUserTableData() {
        let params = this.$refs.cusUserTable.getParams();
        params.key = this.cusUserOpts.searchKey;
        // 请求数据
        this.cusUserOpts.loading = true;
        getCusUser(params).then(res => {
          if (this.$util.isSuccess(res)) {
            let data = res.data.data;
            this.cusUserOpts.total = data.totalSize;
            this.cusUserOpts.data = data.dataList;
          }
          this.cusUserOpts.loading = false;
        });
      },
      addCusUser() {
        this.cusUserOpts.modal = true;
        this.cusUserOpts.isEdit = false;
        this.$refs['cusUserForm'].resetFields();
        this.cusUserOpts.formItem.post = '';
        this.cusUserOpts.formItem.status = '1';
        this.cusUserOpts.formItem.id = '';
        this.$util.focus(this, 'cusUserInput');
      },
      cusUserModalOk() {
        let me = this;
        this.$refs['cusUserForm'].validate(valid => {
          if (!valid) {
            me.$Message.error('请填写完整！');
          } else {
            me.cusUserOpts.okLoading = true;
            let params = me.cusUserOpts.formItem;
            delete params.department;
            delete params.interfaceTime;
            addOrUpdateCusUser(me.cusUserOpts.formItem).then(res=>{
              if (me.$util.isSuccess(res)) {
                me.cusUserOpts.modal = false;
                this.$Message.success(res.data.msg);
                me.getCusUserTableData();
              }
              me.cusUserOpts.okLoading = false;
            });
          }
        });
      },
      editCusUser(row) {
        this.$refs['cusUserForm'].resetFields();
        this.cusUserOpts.formItem = this.$util.copyObject(row);
        this.cusUserOpts.modal = true;
        this.cusUserOpts.isEdit = true;
        this.$util.focus(this, 'cusUserInput');
      },
      deleteCusUser(row) {
        this.cusUserOpts.deleteModal = true;
        this.cusUserOpts.deleteParams = [row];
        this.cusUserOpts.deleteDesc = row.name;
      },
      //-------------------------设置高度-------------------------
      resetHeight() {
        this.height = `${window.innerHeight - 150}px`;
        this.treeOpts.height = `${window.innerHeight - 260}px`;
        this.groupOpts.height = `${window.innerHeight - 280}px`;
        this.cusUserOpts.height = `${window.innerHeight - 280}px`;
      }
    },
    mounted() {
      this.resetHeight();
      // 获取组织组织架构数据
      this.getTreeData();
      this.getGroupTableData();
      this.getCusUserTableData();
      window.onresize = () => {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.resetHeight();
      };
    }
  };
</script>

<style>
    .searchInput {
        width: 200px;
        padding-bottom: 8px
    }
</style>
