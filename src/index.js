import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import store from './store/index';
import { Provider } from 'react-redux'
import BankList from './Banks/BankList';
import { Redirect } from 'react-router-dom';
import { BrowserRouter as Router , IndexRoute , Route , Switch } from 'react-router-dom';
import BankBranchList from './Branches/BranchList';
import DraweeBankBranchProfileList from './DraweeBankBranch/DraweeBankBranchProfileList';
import DraweeBankList from './DraweeBank/DraweeBankList';
import CommonLayout from './common/Layout';
import BankProfileDetails from './Banks/EnhancedTabView'
import BankBranchProfileDetailsView from './Branches/EnhancedTabView';
import AllBranchesList from './Branches/AllBranchesList';
import DraweeBankBranchRules from './DraweeBankBranch/DraweeBankBranchRules';
import DraweeBranchNationalityRestrictionsProfile from './DraweeBankBranch/NationalityRestriction/DraweeBranchNationalityRestrictionsProfile';
import DraweeBranchCountryRestrictionProfile from './DraweeBankBranch/CountryRestriction/EnhancedTabView';
import ManageTransmissionTabView from './DraweeBankBranch/ManageTransmission/ManageTransmissionTabView';
import AccountValidation from './AccountValidations/AccountValidation';
import CreateAccountValidation from './AccountValidations/CreateAccountValidation'
import EnhancedAccountTabView from './AccountValidations/EnhancedAccountTabView';
import EditAcccountValidation from './AccountValidations/EditAccountValidation';
import * as AuthService from './AuthService/AuthService';
import * as config from './config/config';

ReactDOM.render(    
    <Router>
        <Switch>
            <Router basename={'/onboardingbanks'}>
            <Switch>
                <Route path="/banks/:token" render={props=>{
                    if(props.match.params.hasOwnProperty('token')){
                        sessionStorage.setItem("token", props.match.params.token+props.location.search);
                    }
                    else{
                        let token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3c2p2SW1fVHNqeHNGZlVrY0cwMmpMLXNvS2ZhUGMwWURPRnpLZnpMZTlzIn0.eyJqdGkiOiI1ODE4MmM4MC1jZDAxLTQ5YzQtOWJhYi0wOGRiZDg5NzNkZjAiLCJleHAiOjE1NTM5MzUxOTIsIm5iZiI6MCwiaWF0IjoxNTUzOTM0NTkyLCJpc3MiOiJodHRwOi8vc3NvLXJoLXNzby1hcHAuYXBwcy5vY3AudWFlZXhjaGFuZ2UuY29tL2F1dGgvcmVhbG1zL2RldiIsImF1ZCI6InVhbSIsInN1YiI6ImE3NGI2ODA2LTE0YTEtNGM5Ny1iMzIwLTQ2NjYyNDFjZTIwYyIsInR5cCI6IkJlYXJlciIsImF6cCI6InVhbSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjYwY2E2ZTVmLWNhZGUtNDcyZS1iYTViLTc5M2IzYWYyMTE5MSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicmF0ZS1hZG1pbiIsIm15Z3JvdXAtMSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIl19LCJyby11c2VyIjp7InJvbGVzIjpbInJvIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbWx1c2VyMSJ9.P7expPQJWiV7PD1xZM1HGXWRGJsJx_KekCBg0h4vSOuXTl3fjiySafyjOP8jpmL1bKhOGyj5z47Ieq-II5HXLxuS0Ts1KDcQS1QBavdCp8I2BzcfganxLf2DFOL_PPATa2-yHmPCetIDf3bpBQTridbjsQkQCimlhP3JdtCqkwU8RrNV3EXkTGAylQ9TuX8ojZbJx0le5KY8jY2Ajxdumc8uz7ZASmOI4Bvvt7F8zX51ICES8Vj6CI99twZcFpq2RrQaeo_CfAh-G8U-ZuVFhIQuJqwi-TKXanuAD_hO7ZWaO0OipPWuCWn8BDfNYeQdkRsZsGikpElxwQlGGCNpxA?7";
                        sessionStorage.setItem('token',token);
                    }
                    if(AuthService.userDetails(sessionStorage.getItem('token')).valid){
                        return <Redirect to="/" />
                    }
                    else{
                        window.location.replace(config.PAAS_LOGIN_URL);
                        return (<h1>401 - Unauthorized Request</h1>)
                    }
                }}/>
                <Route path="/" render={props=>{
                        let token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3c2p2SW1fVHNqeHNGZlVrY0cwMmpMLXNvS2ZhUGMwWURPRnpLZnpMZTlzIn0.eyJqdGkiOiI1ODE4MmM4MC1jZDAxLTQ5YzQtOWJhYi0wOGRiZDg5NzNkZjAiLCJleHAiOjE1NTM5MzUxOTIsIm5iZiI6MCwiaWF0IjoxNTUzOTM0NTkyLCJpc3MiOiJodHRwOi8vc3NvLXJoLXNzby1hcHAuYXBwcy5vY3AudWFlZXhjaGFuZ2UuY29tL2F1dGgvcmVhbG1zL2RldiIsImF1ZCI6InVhbSIsInN1YiI6ImE3NGI2ODA2LTE0YTEtNGM5Ny1iMzIwLTQ2NjYyNDFjZTIwYyIsInR5cCI6IkJlYXJlciIsImF6cCI6InVhbSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjYwY2E2ZTVmLWNhZGUtNDcyZS1iYTViLTc5M2IzYWYyMTE5MSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicmF0ZS1hZG1pbiIsIm15Z3JvdXAtMSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIl19LCJyby11c2VyIjp7InJvbGVzIjpbInJvIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbWx1c2VyMSJ9.P7expPQJWiV7PD1xZM1HGXWRGJsJx_KekCBg0h4vSOuXTl3fjiySafyjOP8jpmL1bKhOGyj5z47Ieq-II5HXLxuS0Ts1KDcQS1QBavdCp8I2BzcfganxLf2DFOL_PPATa2-yHmPCetIDf3bpBQTridbjsQkQCimlhP3JdtCqkwU8RrNV3EXkTGAylQ9TuX8ojZbJx0le5KY8jY2Ajxdumc8uz7ZASmOI4Bvvt7F8zX51ICES8Vj6CI99twZcFpq2RrQaeo_CfAh-G8U-ZuVFhIQuJqwi-TKXanuAD_hO7ZWaO0OipPWuCWn8BDfNYeQdkRsZsGikpElxwQlGGCNpxA?7";
                        sessionStorage.setItem('token',token);
                        return(
                            <Provider store={store} props={props}> 
                                <CommonLayout props={props}>
                                    <Switch>
                                        <Route path="/branchlist/:bankId" component={BankBranchList}/>
                                        <Route path="/branches" component={AllBranchesList}/>
                                        <Route path="/draweebanklist" component={DraweeBankList}/>
                                        <Route path="/bankprofiledetails/:bankId" component={BankProfileDetails}/>
                                        <Route path="/bankbranchprofiledetailsview/:branchId" component={BankBranchProfileDetailsView}/>
                                        <Route path="/banklist" component={BankList}/>
                                        <Route path="/draweeBankProfile/:draweeId" component={DraweeBankBranchProfileList}/>
                                        <Route path="/draweebranchprofilerules/:draweeId/products/profile/:pId" component={DraweeBankBranchRules}/>
                                        <Route path="/draweebranchprofilerules/:draweeId/nationalityrestrictionsview/profile/:nationalityprofieId" component={DraweeBranchNationalityRestrictionsProfile}/>
                                        <Route path="/draweebranchprofilerules/:draweeProductId/countryrestrictionsview/profile/:countryrestrictionprofileid" component={DraweeBranchCountryRestrictionProfile}/>
                                        <Route path="/draweebranchprofilerules/:draweeProductId/managetransmissionview/profile/:managetransmissonprofileid" component={ManageTransmissionTabView}/>
                                        <Route path='/accountvalidation/:accountcode/edit' component={EditAcccountValidation} />
                                        <Route path='/accountvalidation/createaccountvalidation' component={CreateAccountValidation} />                   
                                        <Route path='/accountvalidation/:accountNumberValidationId' component={EnhancedAccountTabView} />
                                        <Route path='/accountvalidation' component={AccountValidation} />                   
                                        <Redirect from="/" to="/banklist" />
                                    </Switch>
                                </CommonLayout>
                            </Provider>
                        );
                }} />
                </Switch>
            </Router>
        </Switch>
    </Router>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();