import {postRequest} from './config';

export const getTableData = (params) => {
  return postRequest('demo/getTableData', params);
};

export const save = (item) => {
  return postRequest('demo/save', item);
};


