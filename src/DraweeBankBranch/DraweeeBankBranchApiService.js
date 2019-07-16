import axios from 'axios';
import * as config from './../config/config';

  export const getNationalityRestrictionsList = (params,id,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL; 
    return axios(URL+id+'/nationalityRestrictions', {
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

  export const getDraweeBankBranchList=(params,id,headers)=>{
    const URL = config.DRAWEE_BANK_BASE_URL;
    return axios(URL+id+'/draweeBankProductProfiles/', {
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

export const createNationalityRestrictionsList = (data,id,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
    return axios(URL+id+'/nationalityRestrictions', {
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
  };

  export const editNationalityRestrictionsList = (id,data,ruleid,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
    return axios(URL+id+'/nationalityRestrictions/'+ruleid, {
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

  export const getProductTypes=(headers)=>{
   const URL = config.BANKS_BASE_URL;
       return axios.get(URL+'productTypes',{
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

  export const getCurrency=(headers)=>{
    const URL = config.CURRENCY_URL;
    return axios.get(URL,{
    method: 'GET',
    headers: {
     'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*',
     'Accept': 'application/json',
    //  'authorization':headers.Authorization
   }
 })
 .then(response => response)
 .catch(error => {
   throw error;
 });
  }


  export const createdraweebankproductprofile=(data,id,headers)=>{
    const URL = config.DRAWEE_BANK_BASE_URL;
    return axios(URL+id+'/draweeBankProductProfiles', {
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

  export const updatedraweeBankproductprofile=(data,uid,pid,headers)=>{
    const URL = config.DRAWEE_BANK_BASE_URL;
    return axios(URL+uid+'/draweeBankProductProfiles/'+pid, {
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
  }

  export const getdraweebranchprofile=(draweeBankId,draweeBankProductProfileId,headers)=>{
    const URL = config.DRAWEE_BANK_BASE_URL;
    return axios(URL+draweeBankId+'/draweeBankProductProfiles/'+draweeBankProductProfileId, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          // 'Authorization':headers.Authorization
      },
      })
      .then(response => response)
      .catch(error => {
        throw error;
      });
  }

  export const getActivity = (draweeBankId, draweeBankProductProfileId) => {
    const URL = config.DRAWEE_BANK_BASE_URL;
    return axios(URL+draweeBankId+'/draweeBankProductProfiles/'+draweeBankProductProfileId+'/activities', {
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

  export const getfiledvalidationrules=(draweeBankProductProfileId,headers)=>{
    const URL = config.DRAWEE_BANK_RULES_URL;
    return axios(URL+draweeBankProductProfileId +'/draweeRules/fieldValidationRules', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          // 'Authorization':headers.Authorization
      },
      })
      .then(response => response)
      .catch(error => {
        throw error;
      });
  }

  export const postvalidationrules=(data,draweeBankProductProfileId,headers)=>{
    const URL = config.DRAWEE_BANK_RULES_URL;
    return axios(URL+draweeBankProductProfileId +'/draweeRules/fieldValidationRules', {
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

  export const getgeneralrules=(draweeBankProductProfileId,headers)=>{
    const URL = config.DRAWEE_BANK_RULES_URL;
    return axios(URL+draweeBankProductProfileId +'/draweeRules/generalRules', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          // 'Authorization':headers.Authorization
      },
      })
      .then(response => response)
      .catch(error => {
        throw error;
      });
  }

  export const postgeneralrules=(data,draweeBankProductProfileId,headers)=>{
    const URL = config.DRAWEE_BANK_RULES_URL;
    return axios(URL+draweeBankProductProfileId +'/draweeRules/generalRules', {
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
  
  export const getNationalityRestrictionProfile = (pid,ruleid,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
    return axios(URL+pid+'/nationalityRestrictions/'+ruleid, {
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

  export const CurrencyCodesList = (headers) =>{
    const URL = config.CURRENCY_URL;
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

  export const IndividualRulesCounts = (id) =>{
    const URL = config.DRAWEE_BANK_RULES_URL;
    return axios.get(URL+id+'/draweeRules/individualRulesCounts',{
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