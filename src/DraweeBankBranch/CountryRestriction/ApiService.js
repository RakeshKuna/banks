import axios from 'axios';
import * as config from '../../config/config';

export const getCountryRestrictions = (params,id,headers) => {
    const URL = config.buildFetchCountryRestrictions(id);
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

export const getCountryRestrictionDetails = (pid,ruleid,headers) => {
    const URL = config.buildFetchCountryRestrictionDetails(pid,ruleid);
    return axios(URL, {
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

export const getActivity = (pid,ruleid,headers) => {
  const URL = config.buildFetchCountryRestrictionDetails(pid,ruleid);
  return axios(URL+'/activities', {
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


export const getGeneralBankrules = (id,headers) => {
  const URL = config.DRAWEE_BANK_RULES_URL;
  return axios(URL+id+'/draweeRules/generalRules', {
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

export const fetchCountryList = (headers) =>{
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

export const fetchAgentList = (id,headers) =>{
  const URL = config.buildFetchAgents(id);
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

export const fetchAgentBranchesList = (id,headers) =>{
  const URL = config.buildFetchAgentBranches(id);
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

export const createCountryRestriction = (id,data,headers) =>{
  const URL = config.buildCreateCountryRestriction(id);
  return axios(URL,{
    method: 'POST',
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
}

export const editCountryRestrictions = (id,data,rulesId,headers) => {
  const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
  return axios(URL+id+'/countryRestrictions/'+rulesId, {
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