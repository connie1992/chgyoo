<template>
    <div>
        <table border="1" cellspacing="0" width="90%" height="100">
            <caption>8月工资条</caption>
            <tr> <th>{{ $t('employee_no') }}</th><td>18957</td> <th>姓名</th><td>高大川</td> <th>部门</th><td>企业架构部</td></tr>
            <tr> <th>基本工资标准</th><td>2000</td><th>岗位津贴标准</th><td>1000</td> <th></th><td></td></tr>
            <tr><td colspan="6">出勤状况</td></tr>
            <tr> <th>当月工作日天数</th><td>21</td> <th>应出勤天数</th><td>21</td> <th>带薪年休假(小时)</th><td>3</td></tr>
            <tr> <th>加班调休假小时(小时)</th><td>8</td> <th>带薪病假(小时)</th><td>2</td> <th>婚丧假(天)</th><td></td></tr>
        </table>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'salaryDetail',
        data() {
            return {};
        }
    };
</script>

<style scoped>
    table {
        /*font-family: verdana,arial,sans-serif;
        /font-size:11px;*/
        text-align: center;
        color:#333333;
        border-width: 1px;
        border-color: #d7d8d9;
        border-collapse: collapse;
        margin:auto;
        box-shadow: 0.5px 0.5px 0.5px 0.5px #d7d8d9;
    }
    th {
        border-width: 1px;
        border-style: solid;
        border-color: #d7d8d9;
        background-color: #f9f9fa;
        height:55px;
    }
    tr {

    }
    td {
        border-width: 1px;
        border-style: solid;
        border-color: #d7d8d9;
        height: 45px;
        width: 120px;
    }
    td:hover{
        background-color: #f9f9fa;
    }
    .desc {
        border-width: 0px;
    }
</style>
