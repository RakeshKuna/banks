
import { VEIW_BRANCH_DETAIL } from "../constants/action-types";

const branchList=(bankCode)=>{
    return{
        type:VEIW_BRANCH_DETAIL,
        bankCode
    }
}

export default  branchList;