import axios from 'axios';
import * as config from './../../config/config';

export const getAllAgents = (params,headers) => {
    const URL = config.AGENT_PROFILE_URL;
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

  export const getAllAgentBranchProfiles = (params,id,headers) => {
    const URL = config.AGENT_BRANCH_PROFILE_URL(id);
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
  
  export const createAgentDraweeBank4Rate = (data,id,headers) => {
    const URL = config.buildCreateAgentDraweeBank4Rate(id);
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

export const getAgentDraweeBank4RateList = (params,id,headers) => {
    const URL = config.buildListAgentDraweeBank4Rate(id);
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


  export const editAgentDraweeBank4Rate = (data,draweeId,ruleId,headers) => {
    const URL = config.buildEditAgentDraweeBank4Rate(draweeId,ruleId);
    return axios(URL, {
      method: 'PUT',
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
    const URL = config.buildListAgentDraweeBank4Rate(draweeId);
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