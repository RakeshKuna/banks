import { BANK_LIST } from '../constants/action-types';

const initialState={
    bankList:''
};

const bankReducers=(state=initialState,action)=>{
    switch(action.type){
        case BANK_LIST:
            return action.bankList;
        default:
            return state;
    }
}

export default bankReducers;