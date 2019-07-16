import {BANK_LIST, VEIW_DETAIL, VEIW_BANK_DETAIL, VEIW_BRANCH_DETAIL} from "./constants/action-types";

const initialState={
    bankList:'',
    veiwData:'',
    bankId:'',
    bankCode:''
};

const rootReducers=(state=initialState,action)=>{
    switch(action.type){
        case BANK_LIST:
            return  {...state,bankList:action.bankList};
        case VEIW_BANK_DETAIL: 
            return {...state,bankId:action.bankId};
        case VEIW_BRANCH_DETAIL: 
            return {...state,bankCode:action.bankCode};
        case VEIW_DETAIL: 
            return {...state,veiwData:[...state.veiwData,action.veiwData]};
        default:
            return state;
    }
}

export default rootReducers;