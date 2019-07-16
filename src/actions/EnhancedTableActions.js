import { VEIW_DETAIL } from '../constants/action-types'; 

 const viewDetails=(viewData)=>{
    return{
        type:VEIW_BANK_DETAIL,
        viewData
    }     
}

export default viewDetails;