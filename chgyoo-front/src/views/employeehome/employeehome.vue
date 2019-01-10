<style lang="less">
    @import "./employeehome.less";
    @import "../../styles/common.less";
</style>
<template>
    <div >
        <Row :gutter="10">
            <Col :md="24" :lg="8">
            <Row class-name="home-page-row1" :gutter="10">
                <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                    <Card>
                        <Row type="flex" class="user-infor">
                            <Col span="8">
                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                <img class="avator-img" :src="avatorPath" />
                            </Row>
                            </Col>
                            <Col span="16" style="padding-left:6px;">
                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                <div>
                                    <b class="card-user-infor-name">高大川</b><b style="font-size: 0.8em;color: #2d8cf0;">的工资查询门户</b>
                                    <p>软件开发工程师</p>
                                </div>
                            </Row>
                            </Col>
                        </Row>
                        <div class="line-gray"></div>
                        <Row class="margin-top-8">
                            <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                            <Col span="16" class="padding-left-8">2017.09.12-13:32:20</Col>
                        </Row>
                        <Row class="margin-top-8">
                            <Col span="8"><p class="notwrap">上次登录地点:</p></Col>
                            <Col span="16" class="padding-le">深圳市华星光电研发楼</Col>
                        </Row>
                    </Card>
                    </Col>
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                    <Card>
                        <p slot="title" class="card-title">
                            <Icon type="android-checkbox-outline"></Icon>
                            待办/通知
                        </p>
                        <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                            <Icon type="plus-round"></Icon>
                        </a>
                        <Modal
                                v-model="showAddNewTodo"
                                title="添加新的待办事项"
                                @on-ok="addNew"
                                @on-cancel="cancelAdd">
                            <Row type="flex" justify="center">
                                <Input v-model="newToDoItemValue" icon="compose" placeholder="请输入..." style="width: 300px" />
                            </Row>
                            <Row slot="footer">
                                <Button type="text" @click="cancelAdd">取消</Button>
                                <Button type="primary" @click="addNew">确定</Button>
                            </Row>
                        </Modal>
                        <div class="to-do-list-con">
                            <div v-for="(item, index) in toDoList" :key="'todo-item' + (toDoList.length - index)" class="to-do-item">
                                <to-do-list-item :content="item.title"></to-do-list-item>
                            </div>
                        </div>
                    </Card>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card
                            id-name="user_created_count"
                            :end-val="count.createUser"
                            iconType="android-person-add"
                            color="#2d8cf0"
                            intro-text="今日新"
                    ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card
                            id-name="visit_count"
                            :end-val="count.visit"
                            iconType="ios-eye"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="今日浏览量"
                    ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card
                            id-name="collection_count"
                            :end-val="count.collection"
                            iconType="upload"
                            color="#ffd572"
                            intro-text="今日数据导入量"
                    ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                    <infor-card
                            id-name="transfer_count"
                            :end-val="count.transfer"
                            iconType="shuffle"
                            color="#f25e43"
                            intro-text="今日核算工资人数"
                    ></infor-card>
                    </Col>
                </Row>
                <Row>
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="map"></Icon>
                            8月工资明细表
                        </p>
                        <div class="map-con">
                            <!--Col span="10">
                            <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                            </Col>
                            <Col span="14" class="map-incon">
                            <Row type="flex" justify="center" align="middle">
                                <home-map :city-data="cityData"></home-map>
                            </Row>
                            </Col-->
                            <salary-detail></salary-detail>
                        </div>
                    </Card>
                </Row>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上周每日来访量统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        您的工资构成
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        各类数据仪表盘
                    </p>
                    <div class="data-source-row">
                        <user-flow></user-flow>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import cityData from './map-data/get-city-value.js';
    import homeMap from './components/map.vue';
    import dataSourcePie from './components/dataSourcePie.vue';
    import visiteVolume from './components/visiteVolume.vue';
    import serviceRequests from './components/serviceRequests.vue';
    import userFlow from './components/userFlow.vue';
    import countUp from './components/countUp.vue';
    import inforCard from './components/inforCard.vue';
    import mapDataTable from './components/mapDataTable.vue';
    import toDoListItem from './components/toDoListItem.vue';
    import salaryDetail from './components/salaryDetail.vue';

    export default {
        name: 'home',
        components: {
            homeMap,
            dataSourcePie,
            visiteVolume,
            serviceRequests,
            userFlow,
            countUp,
            inforCard,
            mapDataTable,
            toDoListItem,
            salaryDetail
        },
        data () {
            return {
                toDoList: [
                    {
                        title: '请查阅5月考勤异常,'
                    },
                    {
                        title: '请查阅您的2018年度调薪通知!'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    }
                ],
                count: {
                    createUser: 496,
                    visit: 3264,
                    collection: 24389305,
                    transfer: 39503498
                },
                cityData: cityData,
                showAddNewTodo: false,
                newToDoItemValue: ''
            };
        },
        computed: {
            avatorPath () {
                return 'https://i.loli.net/2017/08/21/599a521472424.jpg';
                //localStorage.avatorImgPath;
                //'http://photo.csot.tcl.com/image/18957.jpg';
            }
        },
        methods: {
            addNewToDoItem () {
                this.showAddNewTodo = true;
            },
            addNew () {
                if (this.newToDoItemValue.length !== 0) {
                    this.toDoList.unshift({
                        title: this.newToDoItemValue
                    });
                    setTimeout(() => {
                        this.newToDoItemValue = '';
                    }, 200);
                    this.showAddNewTodo = false;
                } else {
                    this.$message.error('请输入待办事项内容');
                }
            },
            cancelAdd () {
                this.showAddNewTodo = false;
                this.newToDoItemValue = '';
            }
        }
    };
</script>
