import axios from 'axios';
import * as config from './../../config/config';

export const fetchCountrys = (headers) =>{
    const URL = config.COUNTRY_URL;
    return axios.get(URL,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        // 'authorization':headers.Authorization
      }
    })
    .then(response => response)
    .catch(error => {
      throw error;
    });
  }

  export const createFetchDraweeBank4Rate = (data,id,headers) => {
    const URL = config.buildCreateDraweeBank4Rate(id);
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

export const getDraweeBank4RateList = (params,id,headers) => {
    const URL = config.buildListDraweeBank4Rate(id);
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

  export const EditDraweeBank4RateStatus = (data,draweeId,ruleId,headers) => {
    const URL = config.buildEditDraweeBank4RateStatus(draweeId,ruleId);
    return axios(URL, {
      method: 'PUT',
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
    const URL = config.buildListDraweeBank4Rate(draweeId);
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
