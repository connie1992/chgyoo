/**
* 代办中心相关api
 * Created by gaodachuan 2018.8.27
 */
import{getRequest} from './config';

//获取当前用户代办列表
export function getTodoList(paramas) {
    /*return $fetch('udpf/gtasks/pagingQuery?limit=10&page=1', paramas);*/
    return getRequest('udpf/gtasks/pagingQuery?limit=5&page=1', paramas);
}
