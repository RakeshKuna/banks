import axios from 'axios';
import * as config from '../../config/config';

export const getNationalityRestrictionsList = (params, id,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
    return axios(URL + id + '/nationalityRestrictions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            // 'Authorization':headers.Authorization
        },
        params: params
    })
        .then(response => response)
        .catch(error => {
            throw error;
        });
};

export const createNationalityRestrictionsList = (data, id,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;

    return axios(URL + id + '/nationalityRestrictions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            // 'Authorization':headers.Authorization
        },
        data: data
    })
        .then(response => response)
        .catch(error => {
            throw error;
        });
};

export const editNationalityRestrictionsList = (id, data, ruleid,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
    return axios(URL + id + '/nationalityRestrictions/' + ruleid, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            // 'Authorization':headers.Authorization
        },
        data: data
    })
        .then(response => response)
        .catch(error => {
            throw error;
        });
};

export const fetchCountryList = (headers) => {
    const URL = config.COUNTRY_URL;
    return axios.get(URL, {
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

export const getNationalityRestrictionProfile = (pid, ruleid,headers) => {
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
    return axios(URL + pid + '/nationalityRestrictions/' + ruleid, {
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
    const URL = config.NATIONALITY_RESTRICTION_BASE_URL;
    return axios(URL + pid + '/nationalityRestrictions/' + ruleid +'/activities', {
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
        //   'Authorization':headers.Authorization
      }
      })
      .then(response => response)
      .catch(error => {
        throw error;
      });
  };