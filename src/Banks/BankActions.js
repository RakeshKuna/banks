import { BANK_LIST } from '../constants/action-types';
import axios from 'axios';

let newData=[];

export const fetchBankListing=(bankList)=>{
    return{
        type:BANK_LIST,
        bankList
    }   
}

function formatJson(data){               
    data['data'].map((v,i) => {
        let tempData=[];      
        Object.keys(v).forEach(function (key){                         
        tempData.push(v[key]);                        
        });
        newData.push(tempData);                        
    });
    data={"total":data['total'],"data":newData,"message":data['message']};                    
    return data;
}

export const fetchBankList=(pgno)=>{
    return (dispatch)=>{
        return axios.get("http://10.9.8.195:5656/banks/api/v0.1/bank/all",{
            params:{
                pagenumber:pgno,
                pageelements:2
            }
        })
        .then(response=>{
            dispatch(fetchBankListing(formatJson(response.data)))
        })
        .catch(error=>{
            throw(error)
        });          
    };
}