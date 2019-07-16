import axios from 'axios';
import * as config from '../../config/config';

// Manage Transmission List API
export const getManageTransmissions = (params,id,headers) => {
  const URL = config.buildFetchgetManageTransmissions(id);
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

// Manage Transmission View API
export const getManageTrannmssionsDetails = (pid,ruleid,headers) => {
  const URL = config.buildFetchgetManageTransmissionsDetails(pid,ruleid);
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

export const getActivity = (pid,ruleid) => {
  const URL = config.buildFetchgetManageTransmissionsDetails(pid,ruleid);
  return axios(URL + '/activities', {
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

// Manage Transmission Country List API
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

// Manage Transmission Agents/Partner API
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

// Manage Transmission Agent/Partner Branches API
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

// Manage Transmission Create API
export const createManageTransmissions= (id,data,headers) =>{
  const URL = config.buildcreateManageTransmissions(id);
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

export const editManageTransmissions = (id,data,manageTransmissionId,headers) => {
  const URL = config.buildEditManageTransmissions(id,manageTransmissionId);
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