// 预算主数据
import {postRequest} from '@/api/config';

const budgetDataUrl = 'budget/budgetData/';

export const getBudgetData = (params) => {
  return postRequest(`${budgetDataUrl}pageQuery`, params);
};

export const budgetDataAddUpdate = (params) => {
  return postRequest(`${budgetDataUrl}addOrUpdate`, params);
};



// 预算使用记录
const budgetUseUrl = 'budget/budgetUse/';

export const getBudgetUse = (params) => {
  return postRequest(`${budgetUseUrl}pageQuery`, params);
};

export const budgetUseAddUpdate = (params) => {
  return postRequest(`${budgetUseUrl}addOrUpdate`, params);
};

// 预算主数据新增
const budgetDataAddUrl = 'budget/budgetMainAdd/';

export const getBudgetDataAdd = (params) => {
  return postRequest(`${budgetDataAddUrl}pageQuery`, params);
};

export const budgetDataAddAddUpdate = (params) => {
  return postRequest(`${budgetDataAddUrl}addOrUpdate`, params);
};

export const getBudgetMainDetail = (params) => {
  return postRequest('budget/budgetMainAdd/getItemById', params);
};

// 预算编制
const budgetPrepareUrl = 'budget/budgetPrepare/';

export const getBudgetPrepare = (params) => {
  return postRequest(`${budgetPrepareUrl}pageQuery`, params);
};

export const budgetPrepareAddUpdate = (params) => {
  return postRequest(`${budgetPrepareUrl}addOrUpdate`, params);
};

export const getBudgetPrepareDetail = (params) => {
  return postRequest('budget/budgetPrepare/getItemById', params);
};

// 预算编制表&编码新增
export const getBudgetMake = (params, url) => {
  return postRequest(`budget/${url}/pageQuery`, params);
};

export const budgetMakeAddUpdate = (params, url) => {
  return postRequest(`budget/${url}/addOrUpdate`, params);
};

export const getBudgetMakeDetail = (params, url) => {
  return postRequest(`budget/${url}/getItemById`, params);
};


// 手工帐
const budgetUseAddUrl = 'budget/budgetUseAdd/';

export const getBudgetUseAdd = (params) => {
  return postRequest(`${budgetUseAddUrl}pageQuery`, params);
};

export const budgetUseAddAddUpdate = (params) => {
  return postRequest(`${budgetUseAddUrl}addOrUpdate`, params);
};

// 报表-主数据
const reportBudgetDataUrl = 'budget/reportBudgetData/';

export const getReportBudgetData = (params) => {
  return postRequest(`${reportBudgetDataUrl}pageQuery`, params);
};


// 报表-预算使用
const reportBudgetUseUrl = 'budget/reportBudgetUse/';

export const getReportBudgetUse = (params) => {
  return postRequest(`${reportBudgetUseUrl}pageQuery`, params);
};



export const getBudgetMakeData = (params, isPrepare) => {
  let base = isPrepare ? budgetPrepareUrl : budgetDataAddUrl;

};

/*export const budgetMakeAddUpdate = (params, isPrepare) => {
  let base = isPrepare ? budgetPrepareUrl : budgetDataAddUrl;

};*/

export const budgetMakeDetail = (params, isPrepare) => {
  let base = isPrepare ? budgetPrepareUrl : budgetDataAddUrl;

};

// 预算调拨
const budgetAdjustUrl = 'budget/budgetAdjust/';

export const getBudgetAdjust = (params) => {
  return postRequest(`${budgetAdjustUrl}pageQuery`, params);
};

export const budgetAdjustAddUpdate = (params) => {
  return postRequest(`${budgetAdjustUrl}addOrUpdate`, params);
};
