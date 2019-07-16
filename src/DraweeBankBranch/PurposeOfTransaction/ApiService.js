import axios from 'axios';
import * as config from './../../config/config';

export const buildFetchCategoryTypes = (headers) => {
    const URL = config.buildFetchCategoryTypes();
    return axios(URL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'authorization':headers.Authorization
    }
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const buildFetchPurposeTypes = (id,headers) => {
    const URL = config.buildFetchPurposeTypes(id);
    return axios(URL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'authorization':headers.Authorization
    }
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const buildFetchPurposeList = (params,id,headers) => {
    const URL = config.buildFetchPurposeList(id);
    return axios(URL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'authorization':headers.Authorization
    },
    params:params
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const buildCreatePurposeList = (data,id,headers) => {
    const URL = config.buildFetchPurposeList(id);
    return axios(URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'Authorization':headers.Authorization
    },
    data:data
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const buildUpdatePurposeFieldsCodeValue = (data,draweeId,ruleId,headers) => {
    const URL = config.buildUpdatePurposeFieldsCodeValue(draweeId,ruleId);
    return axios(URL, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'Authorization':headers.Authorization
    },
    data:data
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const getActivity = (draweeId, ruleId) => {
    const URL = config.buildFetchPurposeList(draweeId);
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

export const buildUpdatePurposeFieldsMaxAmount = (data,draweeId,ruleId,headers) => {
    const URL = config.buildUpdatePurposeFieldsMaxAmount(draweeId,ruleId);
    return axios(URL, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'Authorization':headers.Authorization
    },
    data:data
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};

export const buildUpdatePurposeFieldsStatus = (data,draweeId,ruleId,headers) => {
    const URL = config.buildUpdatePurposeFieldsStatus(draweeId,ruleId);
    return axios(URL, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        //   'Authorization':headers.Authorization
    },
    data:data
    })
    .then(response => response)
    .catch(error => {
        throw error;
    });
};