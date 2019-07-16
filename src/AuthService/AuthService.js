const jwtDecode = require('jwt-decode');

export const userDetails = token =>{
    console.log(token);
    try{
        return ({valid:true,decoded:jwtDecode(token)})
    }
    catch(Error){
        return ({valid:false,decoded:{}});
    }
}
