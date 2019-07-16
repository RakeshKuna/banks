import axios from 'axios';
import * as config from './../../config/config';

export const buildFetchBeneficiaryBanks = (params,id,headers) => {
    const URL = config.buildFetchBeneficiaryBanks(id);
    return axios(URL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'Authorization':headers.Authorization
    },
    params:params
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const getActivity = (draweeId, ruleId) => {
    const URL = config.buildFetchBeneficiaryBanks(draweeId);
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

export const buildCreateBeneficiaryBanks = (data,id,headers) => {
    const URL = config.buildFetchBeneficiaryBanks(id);
    return axios(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'Authorization':headers.Authorization
        },
        data:data,
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const buildEditBeneficiaryBanks = (data,draweeId,ruleId,headers) => {
    const URL = config.buildEditBeneficiaryBanks(draweeId,ruleId);
    return axios(URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'Authorization':headers.Authorization
        },
        data:data,
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};