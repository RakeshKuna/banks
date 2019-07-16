import axios from 'axios';
import * as config from './../../config/config';

export const fetchSourceOfIncome = (headers) =>{
    const URL = config.SOURCE_OF_INCOME;
    return axios.get(URL,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        // 'Authorization':headers.Authorization
      }
    })
    .then(response => response)
    .catch(error => {
      throw error;
    });
  }
  
  export const buildSourceOfFunds = (data,id,headers) => {
    const URL = config.buildSourceOfFunds(id);
    return axios(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          // 'Authorization':headers.Authorization
        },
        data:data,
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const buildFetchSourceOfIncome = (params,id,headers) => {
  const URL = config.fetchSourceOfIncomes(id);
  return axios(URL, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        // 'Authorization':headers.Authorization
  },
  params:params
  })
  .then(response => response)
  .catch(error => {
      throw error;
  });
};

export const buildUpdateSourceOfFundsFieldsMaxAmount = (data,draweeId,ruleId,headers) => {
  const URL = config.buildUpdateSourceOfFundsFieldsMaxAmount(draweeId,ruleId);
  return axios(URL, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        // 'Authorization':headers.Authorization
  },
  data:data
  })
  .then(response => response)
  .catch(error => {
      throw error;
  });
};

export const  buildUpdateSourceOfFundsFieldsCodeValue = (data,draweeId,ruleId,headers) => {
  const URL = config.buildUpdateSourceOfFundsFieldsCodeValue(draweeId,ruleId);
  return axios(URL, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        // 'Authorization':headers.Authorization
  },
  data:data
  })
  .then(response => response)
  .catch(error => {
      throw error;
  });
};

export const buildUpdateSourceOfFundsStatus = (data,draweeId,ruleId,headers) => {
  const URL = config.buildUpdateSourceOfFundsStatus(draweeId,ruleId);
  return axios(URL, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        // 'Authorization':headers.Authorization
  },
  data:data
  })
  .then(response => response)
  .catch(error => {
      throw error;
  });
};

export const getActivity = (draweeId, ruleId) => {
  const URL = config.fetchSourceOfIncomes(draweeId);
  return axios(URL + '/' + ruleId +'/activities', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json',
      // 'Authorization':headers.Authorization
    }
  })
  .then(response => response)
  .catch(error => {
    throw error;
  });
};