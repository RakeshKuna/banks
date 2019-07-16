import axios from 'axios';
import * as config from '../config/config';

// Account Validations List API

export const getAllAccountValidationsList = (params,headers) => {
  const URL = config.ACCOUNTVALIDATION_API_BASE_URL;
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

export const fetchCountryList = (headers) =>{
  const URL = config.COUNTRY_URL;
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

export const fetchDraweeBankList =(params,headers) =>{
  const URL = config.buildFetchDraweeBankList();
  return axios.get(URL,{
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
}

export const fetchBeneficaryBankList =(params,headers) =>{
  const URL = config.buildFetchBeneficiaryBanksList();
  return axios.get(URL,{
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
}

export const createAccountValidation = (data,headers) => {
  const URL = config.buildCreateAccountValidation();
  return axios(URL, {
    method: 'POST',
    data: data,
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


export const EditAccountValidation = (data,id,headers) => {
  const URL = config.EditViewAccountValidationURL(id);
  return axios(URL, {
    method: 'PUT',
    data: data,
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

export const getAccountValidationTabView= (accountNumberValidationId,headers) => {
  const URL = config.buildViewAccountValidationURL(accountNumberValidationId);
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

export const getActivity= (accountNumberValidationId) => {
  const URL = config.buildViewAccountValidationURL(accountNumberValidationId);
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

export const fetchDraweeList =(params,headers) =>{
  const URL = config.DRAWEE_BANK_BASE_URL;
  return axios.get(URL,{
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
}

export const getDraweeBankBranchList=(params,id,headers)=>{
  const URL = config.DRAWEE_BANK_BASE_URL;
  return axios(URL+id+'/draweeBankProductProfiles', {
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
}

export const fetchBanks = (params,headers) =>{
  const URL = config.BANKS_API_BASE_URL;
  return axios.get(URL,{
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
}