import { VEIW_BANK_DETAIL } from "../constants/action-types";

 const viewDetails=(bankId)=>{
   return{
      type:VEIW_BANK_DETAIL,
      bankId
   }   
}

export default  viewDetails;