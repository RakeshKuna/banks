import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Toggle, Selectable, Input, FloatButton, TextButton, Notifications } from 'finablr-ui';
import { withStyles } from '@material-ui/core/styles';
import * as ApiAccountService from './ApiAccountService';
import * as Exceptionhandler from './../ExceptionHandling';
import Snackbarcomp from '../component/snackbar';
import ErrorModal from './../component/ErrorModalbox';
import ModalBox from './../component/Modalbox';
import Loader from '../component/Loader';
import EmptyListComponent from '../component/EmptylistComponent';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from '../config/config';
import '../vendor/common.css';

function getModalStyle() {
  return {
    padding: `0 20px 0 20px`
  };
}

const newLengthRuleObject = { minLength: null, maxLength: null, minLengthCheck: false, maxLengthCheck: false, minLengthErrMsg: '', maxLengthErrMsg: '' };
const selectLabels = [{ 'id': 1, 'label': 'Allowed', 'value': 'ALLOWED' }, { 'id': 2, 'label': 'Disallowed', 'value': 'DISALLOWED' }];

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    overflowY: 'scroll'
  },
  fab: {
    margin: theme.spacing.unit,
    backgroundColor: "#19ace3",
    color: 'white'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  MuiFormControlLabel: {
    root: {
      marginLeft: 0,
      marginRight: 0,
    }
  },
  button: {
    margin: theme.spacing.unit,
    fontSize: 16
  },
  input: {
    display: 'none',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: 30,
    paddingRight: 30,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: `100%`,
  },
  dense: {
    marginTop: 19,
  },
});

class CreateAccountValidation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      agentSourceCountry: '',
      agentSourceCountryerrMsg: '',
      agentSourceCountryData: {},
      agentSourceCountryCheck: false,
      agentCountry: '',
      agentCountryData: {},
      agentCountryCheck: false,
      agentCountryerrMsg: '',
      destinationCountryData: {},
      destinationCountry: '',
      destinationCountryCheck: false,
      destinationCountryerrMsg: '',
      draweeBank:'',
      draweeBankData:{},
      draweeBankCheck:'',
      draweeBankerrMsg:'',
      lengthRuleValidations: [{ minLength: null, maxLength:null , minLengthCheck: false, maxLengthCheck: false, minLengthErrMsg: '', maxLengthErrMsg: '' }],
      newRuleObject: { ruleAllowed: '', position: '', range: '', value: '', valueCheck: false, positionCheck: false, rangeCheck: false, ruleAllowedCheck: false, valueErrMsg: '', positionErrMsg: '', rangeErrMsg: '', ruleAllowedErrMsg: '' },
      accountNumberValidations: [{ ruleAllowed: '', position: '', range: '', value: '', valueCheck: false, positionCheck: false, rangeCheck: false, ruleAllowedCheck: false, valueErrMsg: '', positionErrMsg: '', rangeErrMsg: '', ruleAllowedErrMsg: '' }],
      status: true,
      dataFieldsError: false,
      countryList: [],
      agentList: [],
      agentBranchesList: [],
      draweeBankList:[],
      saveDisabled: false,
      clearDisabled:false,
      agentDisabled: true,
      snackbar: false,
      snackbarMessage: '',
      notificationType:'success',
      minLength: '',
      minLengthCheck: false,
      minLengthErrMsg: '',
      maxLength: '',
      maxLengthCheck: false,
      maxLengthErrMsg: '',
      isalphanumeric: true,
      shownogeneralrules: false,
      apiErrMsg: '',
      confirmClear: false,
      clearMessage: '',
      fromAction: '',
      modalMessage: '',
      isDraweeBankDisbaled: true,
      isBenificaryBankDisabled: true,
      loading: true,
      loaderMessage: '',
      serverError: false,
      serverStatus: null,
      serverErrMessage: '',
      onChange:false,
    }
  }

  componentDidMount() {
    this.fetchCountryList();
  }

  fetchCountryList = () => {
    let countryList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiAccountService.fetchCountryList(headers).then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          response.data.map((obj) => {
            let country = {};
            country.id = obj.id;
            country.label = obj.name + ' - '+obj.countryCode;
            country.value = obj.countryCode;
            country.name = obj.name;
            countryList.push(country);
          })
          this.setState({ countryList, loading: false });
        }
        else {
          this.setState({ snackbar: true,notificationType:'warning', snackbarMessage: 'No country records', loading: false });
        }
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
      });
    }
  }

  fetchDraweeList = (country,countryCode) =>{
    let draweeBankList = [];
    let params = {
      type:'country',
      query:country
    }
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiAccountService.fetchDraweeList(params,headers).then((response) => {
        console.log(response);
        if (response.data.total > 0) {
          response.data.data.map((obj) => {
            let draweeBank = {};
            draweeBank.id = obj.id;
            draweeBank.label = obj.bankName;
            draweeBank.value = obj.bankName;
            draweeBankList.push(draweeBank);
          })
          this.setState({ draweeBankList }, () => {
            this.setState({ isDraweeBankDisbaled: false }, () => {
              this.fetchBeneficaryBankList(countryCode);
            });
          });
        }
        else {
          this.setState({ isDraweeBankDisbaled: true },()=>{
          this.fetchBeneficaryBankList(countryCode);
        })
        }
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
      });
    }
  }

  fetchDraweeBankList = (id) => {
    let agentList = [];
    let params = {};
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({snackbar:false},()=>{
        ApiAccountService.getDraweeBankBranchList(params,id,headers).then((response) => {
          console.log(response);
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let agent = {};
              agent.id = obj.id;
              agent.label = obj.displayName + ' (' + obj.productType+ ',' + obj.productSubType + ',' + obj.serviceProviderCode + ',' + obj.currencyCode +  (obj.serviceType == null ? '' : ',' + obj.serviceType) + ')';
              agent.value = obj.displayName;
              agentList.push(agent);
            })
            this.setState({ agentList }, () => {
              this.setState({ isDraweeBankDisbaled: false }, () => {
                // this.fetchBeneficaryBankList(country);
              });
            });
          }
          else {
            this.setState({ snackbar: true, snackbarMessage:'No drawee bank profiles found', notificationType:'warning' })
          }
        }).catch(error => {
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
            this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          }
          else {
            this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
          }
        });
      })
    }
  }

  fetchBeneficaryBankList = (countryCode) => {
    let agentBranchesList = [];
    let params = {};
    params.countryCode = countryCode;
    params.pagenumber = null;
    params.pageelements = null;
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({snackbar:false},()=>{
        ApiAccountService.fetchBanks(params,headers).then((response) => {
          //console.log(response.data)
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let branch = {};
              branch.id = obj.id;
              branch.label = obj.bankName;
              branch.value = obj.bankId;
              agentBranchesList.push(branch);
            })
            this.setState({ agentBranchesList }, () => {
              //console.log(this.state.agentBranchesList);
              if (this.state.isDraweeBankDisbaled) {
                this.setState({ snackbar: true,notificationType:'warning', snackbarMessage: 'No Drawee Banks records found', isBenificaryBankDisabled: false });
              }
              else {
                this.setState({ isBenificaryBankDisabled: false })
              }
            });
          }
          else {
            if (this.state.isDraweeBankDisbaled) {
              this.setState({ snackbar: true,notificationType:'warning', snackbarMessage: 'No Drawee Banks and Benificary Banks records found', isBenificaryBankDisabled: true });
            }
            else if (this.state.isDraweeBankDisbaled == false) {
              this.setState({ snackbar: true,notificationType:'warning', snackbarMessage: 'No Benificary Banks records found', isBenificaryBankDisabled: true });
            }
          }
        }).catch(error => {
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
            this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          }
          else {
            this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
          }
        });
      })
    }
  }

  onChange = (e) => {
    console.log(e.target.id, e.target.checked);
    this.setState({ dataFieldsError: false, snackbar: false });
    switch (e.target.id) {
      case ('status'):
        this.setState({ status: e.target.checked },()=>{
          if(this.state.status == false){
            this.setState({snackbar:true,snackbarMessage:'This Rule will be disabled', notificationType:'warning'})
          }
        });
      break;
      case ('isalphanumeric'):
        this.setState({ isalphanumeric: e.target.checked }, () => {
          this.accountValidationValuesSatisfied(this.state.isalphanumeric);
        });
        break;
    }
  }

  accountValidationValuesSatisfied = (alphanumeric) => {
    let accountNumberValidations = this.state.accountNumberValidations;
    let errCount = 0;
    this.state.accountNumberValidations.map((obj, index) => {
      let object = obj;
      if (alphanumeric) {
        let pattern = /^[a-zA-Z0-9]+$/i;
        if ((object.ruleAllowed == '' || object.ruleAllowed == undefined) && (object.position == '' || object.position == undefined) && (object.range == '' || object.range == undefined) && (object.value == '' || object.position == undefined)) {
          return null;
        }
        else if (object.value.length == 0) {
          return null;
        }
        else if (pattern.test(object.value)) {
          object.valueCheck = false;
          object.valueErrMsg = '';
          accountNumberValidations[index] = object;
          this.setState({ accountNumberValidations });
        }
        else {
          object.valueCheck = true;
          object.valueErrMsg = 'value should be alphanumeric';
          accountNumberValidations[index] = object;
          this.setState({ accountNumberValidations });
          errCount = errCount + 1;
        }
      }
      else {
        let pattern1 = /^[0-9]+$/i;
        if ((object.ruleAllowed == '' || object.ruleAllowed == undefined) && (object.position == '' || object.position == undefined) && (object.range == '' || object.range == undefined) && (object.value == '' || object.position == undefined)) {
          return null;
        }
        else if (object.value.length == 0) {
          return null;
        }
        else if (pattern1.test(object.value)) {
          object.valueCheck = false;
          object.valueErrMsg = '';
          accountNumberValidations[index] = object;
          this.setState({ accountNumberValidations });
        }
        else {
          object.valueCheck = true;
          object.valueErrMsg = 'value cannot be alphanumeric';
          accountNumberValidations[index] = object;
          this.setState({ accountNumberValidations });
          errCount = errCount + 1;
        }
      }
    })
    if (errCount > 0) {
      this.setState({ saveDisabled: false });
    }
  }

  addNewRule = (checkIndex) => {
    let existingIndex = null;
    let accountNumberValidations = this.state.accountNumberValidations;
    let checkExistingRule = this.state.accountNumberValidations[checkIndex];
    this.state.accountNumberValidations.map((obj, index) => {
      if (checkIndex == index) {
        return null;
      }
      else {
        if ((checkExistingRule.ruleAllowed == obj.ruleAllowed) && (checkExistingRule.position == obj.position) && (checkExistingRule.range == obj.range) && (checkExistingRule.value == obj.value)) {
          existingIndex = index;
        }
      }
    })
    if (existingIndex == null) {
      accountNumberValidations.push(Object.assign({}, this.state.newRuleObject));
      this.setState({ accountNumberValidations }, () => {

      });
    }
    else {
      this.setState({ shownogeneralrules: true, apiErrMsg: `Rule already exists at row ${existingIndex + 1}` }, () => {
        this.setState({ saveDisabled: false });
      })
    }
  }

  deleteRule = (index) => {
    let accountNumberValidations = [];
    let duplicateAccountNumberValidations = [...this.state.accountNumberValidations];
    duplicateAccountNumberValidations.splice(index, 1);
    this.setState({ accountNumberValidations }, () => {
      this.setState({ accountNumberValidations: duplicateAccountNumberValidations }, () => {
        if (this.checkExistingRule()) {
          this.setState({ saveDisabled: false });
        }
        else {
          this.setState({ saveDisabled: true });
        }
      })
    })
  }

  handleClear = () => {
    this.setState({ confirmClear: false, snackbar: false }, () => {
      let countryLen = (this.state.agentSourceCountry == undefined) ? 0 : this.state.agentSourceCountry.length;
      let draweeBankLen = (this.state.draweeBank == undefined) ? 0 : this.state.draweeBank.length;
      let agentCountryLen = (this.state.agentCountry == undefined) ? 0 : this.state.agentCountry.length;
      let destinationcountryLen = (this.state.destinationCountry == undefined) ? 0 : this.state.destinationCountry.length;
      if (this.state.onChange || countryLen > 0 || draweeBankLen > 0 || Object.keys(this.state.draweeBankData).length > 0 || Object.keys(this.state.agentSourceCountryData).length > 0 || agentCountryLen > 0 || destinationcountryLen > 0 || Object.keys(this.state.agentCountryData).length > 0 || Object.keys(this.state.destinationCountryData).length > 0) {
        this.setState({ confirmClear: true, fromAction: 'clear', modalMessage: 'This will clear all data. Are you sure you want to continue?' })
      }
    })
  }

  // handleClearEnable = () => {
  //   let displayNameLength = this.state.displayName == undefined ? 0 : this.state.displayName.length;
  //   let accountNumberLength = this.state.accountNumber == undefined ? 0 : this.state.accountNumber.length;
  //   let swiftCodeLength = this.state.swiftCode == undefined ? 0 : this.state.swiftCode.length;
  //   if ((displayNameLength > 0) || (Object.keys(this.state.subProductTypeData).length > 0)
  //    || (Object.keys(this.state.currencyCodeData).length > 0)
  //   || (Object.keys(this.state.serviceTypeData).length > 0) || (accountNumberLength > 0 || (swiftCodeLength > 0)
  //    )) {
  //     this.setState({
  //       clearDisabled: true
  //     })
  //   }
  //   else {
  //     this.setState({
  //       clearDisabled: false
  //     })
  //   }
  // }

  handleConfirmResponse = (data, from) => {
    if (data == true && from == 'clear') {
      this.setState({ confirmClear: false }, () => {
        this.setState({ agentSourceCountry: undefined, agentSourceCountryData: {}, isalphanumeric: true, agentCountry: undefined, destinationCountry: undefined, destinationCountryData: {}, agentCountryData: {}, status: true, isBenificaryBankDisabled: false, isDraweeBankDisbaled: false, agentSourceCountryCheck: false, draweeBank: undefined, draweeBankList:[], agentList:[], agentBranchesList:[], accountNumberValidations:[], lengthRuleValidations:[], clearDisabled:false,saveDisabled:false }, () => {
          let accountNumberValidations = [];
          accountNumberValidations.push(Object.assign({}, this.state.newRuleObject));
          let lengthRuleValidations = [];
          lengthRuleValidations.push(Object.assign({}, newLengthRuleObject))
          this.setState({ accountNumberValidations, lengthRuleValidations },()=>{
            console.log(this.state.accountNumberValidations,this.state.lengthRuleValidations)
          });
        })
      })
    }
  }

  handleData = () => {
    if (this.checkExistingRule()) {
      this.setState({ shownogeneralrules: true, apiErrMsg: `Some Rules are Duplicated. Please remove Duplicated Rules` });
    }
    else {
      this.handleCreateAccountvalidation();
    }
  }

  handleModalResponse = (data) => {
    if (data) {
      this.setState({ shownogeneralrules: false, apiErrMsg: '', clearDisabled:false,
    })
    }
  }

  handleCreateAccountvalidation = () => {
    let data = {};
    data.allowAlphaNumeric = this.state.isalphanumeric;
    if (Object.keys(this.state.agentSourceCountryData).length > 0) {
      data.countryName = this.state.agentSourceCountryData.name;
      data.countryCode = this.state.agentSourceCountryData.value;
    }
    if (Object.keys(this.state.draweeBankData).length > 0) {
      data.draweeBankId = this.state.draweeBankData.id;
    }
    if (Object.keys(this.state.agentCountryData).length > 0) {
      data.draweeBankProductProfileId = this.state.agentCountryData.id;
    }
    if (Object.keys(this.state.destinationCountryData).length > 0) {
      data.beneficiaryBankId = parseInt(this.state.destinationCountryData.value);
    }
    if (this.state.lengthRuleValidations.length > 0) {
      data.accountNumberLengths = [];
      this.state.lengthRuleValidations.map((obj) => {
        let lengthRule = {};
        if ((isNaN(obj.minLength) || obj.minLength == undefined || obj.minLength == 0) && (isNaN(obj.maxLength) || obj.maxLength == undefined || obj.maxLength == 0)) {
          return null;
        }
        else if (isNaN(obj.minLength) || obj.minLength == undefined || obj.minLength == 0) {
          lengthRule.minimumLength = 0;
        }
        else {
          lengthRule.minimumLength = obj.minLength;
        }
        if (isNaN(obj.maxLength) || obj.maxLength == undefined || obj.maxLength == 0) {
          lengthRule.maximumLength = 0;
        }
        else {
          lengthRule.maximumLength = obj.maxLength;
        }
        data.accountNumberLengths.push(lengthRule);
      })
    }
    if (this.state.accountNumberValidations.length > 0) {
      data.validationRules = [];
      this.state.accountNumberValidations.map((obj) => {
        let positionLength = (obj.position == undefined || isNaN(obj.position) || obj.position == '') ? 0 : obj.position;
        let rangeLength = (obj.range == undefined || isNaN(obj.range) || obj.range == '') ? 0 : obj.range;
        let valueLength = (obj.value == undefined || obj.value.length == 0) ? 0 : obj.value.length;
        let ruleAllowedLength = (obj.ruleAllowed == undefined || obj.ruleAllowed.length == 0) ? 0 : obj.ruleAllowed.length;
        if (positionLength > 0 && rangeLength > 0 && ruleAllowedLength > 0 && valueLength > 0) {
          let ruleAllowedObj = {};
          ruleAllowedObj.position = obj.position;
          ruleAllowedObj.range = obj.range;
          ruleAllowedObj.validationType = obj.ruleAllowed;
          ruleAllowedObj.value = obj.value;
          data.validationRules.push(ruleAllowedObj);
        }
        else{
          return null;
        }
      })
    }
    data.status = this.state.status ? 'ENABLED' : 'DISABLED';
    console.log(data);
    this.handleCreateAccountvalidationApiCall(data);
  }

  handleCreateAccountvalidationApiCall = (data) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, loaderMessage: 'Posting data', snackbar: false })
      ApiAccountService.createAccountValidation(data,headers)
        .then((response) => {
          if (response.status == 200) {
            this.setState({ loading: false, snackbar: true,notificationType:'success', snackbarMessage: 'Account Number Validation created successfully' }, () => {
              setTimeout(() => {
                this.props.history.push(`/accountvalidation`);
              }, 1000);
            })
          }
        }).catch(error => {
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503) {
            this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          }
          else {
            this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
          }
        });
    }
  }

  handleChange = (e, id) => {
    console.log(e);
    switch (id) {
      case 'agentsourcecountry':
        this.setState({ agentSourceCountry: e, agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {}, draweeBank:undefined, draweeBankData:{} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {}, draweeBank:undefined, draweeBankData:{} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.agentSourceCountry.length > 0){
            this.state.countryList.map((obj)=>{
              if(this.state.agentSourceCountry == obj.value){
                this.setState({ agentSourceCountryData: obj, agentSourceCountry: obj.value }, () => {
                  this.fetchDraweeList(this.state.agentSourceCountryData.label,this.state.agentSourceCountryData.value);
                  this.handleSaveEnable();
                  this.handleClearEnable();
                })
              }
            })
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        });
      break;
      case 'draweeBank':
        this.setState({ draweeBank: e, draweeBankCheck: false }, () => {
          if (this.state.draweeBank == undefined) {
            this.setState({ draweeBankCheck: true, draweeBankData:{}, draweeBankerrMsg: 'Drawee bank cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: []}, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.draweeBank.length == 0) {
            this.setState({ draweeBankCheck: true, draweeBankData:{}, draweeBankerrMsg: 'Drawee bank cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: []}, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.draweeBank.length > 0){
            this.state.draweeBankList.map((obj)=>{
              if(this.state.draweeBank == obj.value){
                this.setState({ draweeBankData: obj, draweeBank: obj.value }, () => {
                  this.fetchDraweeBankList(this.state.draweeBankData.id);
                  this.handleSaveEnable();
                  this.handleClearEnable();
                })
              }
            })
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        });
      break;
      case 'agentCountry':
        this.setState({ agentCountry: e, agentCountryCheck: false }, () => {
          if (this.state.agentCountry == undefined) {
            this.setState({ agentCountryCheck: true, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentCountry.length == 0) {
            this.setState({ agentCountryCheck: true, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.agentCountry.length > 0){
            this.state.agentList.map((obj)=>{
              if(this.state.agentCountry == obj.value){
                this.setState({ agentCountryData: obj, agentCountry: obj.value }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();
                })
              }
            })
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        });
        break;
      case 'destinationcountry':
      console.log("handle change");
        this.setState({ destinationCountry:e, destinationCountryCheck: false }, () => {
          if (this.state.destinationCountry == undefined) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty', }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.destinationCountry.length == 0) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty' }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.destinationCountry.length > 0){
            this.state.agentBranchesList.map((obj)=>{
              if(this.state.destinationCountry == obj.value){
                this.setState({ destinationCountryData: obj, destinationCountry: obj.value }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();
                })
              }
            })
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        })
        break;
    }
  }

  handleValueClick = (e, id) => {
    switch (id) {
      case 'agentsourcecountry':
        this.setState({ agentSourceCountryData: {}, draweeBankData: {}, agentCountryData: {}, destinationCountryData:{}, draweeBankList:[], agentList: [], agentBranchesList:[], draweeBank:undefined,agentCountry:undefined,destinationCountry:undefined }, () => {
          let value = e.value;
          this.setState({ agentSourceCountryData: e, agentSourceCountry: value }, () => {
            this.fetchDraweeList(this.state.agentSourceCountryData.label,this.state.agentSourceCountryData.value);
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
      break;
      case 'draweeBank':
        this.setState({ draweeBankData: {}, agentCountryData: {}, agentList: [], agentCountry:undefined}, () => {
          let value = e.label;
          this.setState({ draweeBankData: e, draweeBank: value }, () => {
            this.fetchDraweeBankList(this.state.draweeBankData.id);
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
      break;
      case 'agentCountry':
        this.setState({ agentCountryData: {} }, () => {
          let value = e.value;
          this.setState({ agentCountryData: e, agentCountry: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
      break;
      case 'destinationcountry':
        this.setState({ destinationCountryData: {} }, () => {
          let value = e.value;
          this.setState({ destinationCountryData: e, destinationCountry: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
      break;
    }
  }

  handleBlur = (e) => {
    console.log(e.target.id);
    switch (e.target.id) {
      case 'agentsourcecountry':
        this.setState({ agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {}, draweeBank:undefined, draweeBankData:{} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {}, draweeBank:undefined, draweeBankData:{} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        })
      break;
      case 'agentCountry':
        this.setState({ agentCountryCheck: false }, () => {
          // if(Object.keys(this.state.agentSourceCountryData).length > 0){
            if (this.state.agentCountry == undefined) {
              this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Drawee Bank cannot be empty', agentCountryData: {} }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();
              })
            }
            else if (this.state.agentCountry.length == 0) {
              this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Drawee Bank cannot be empty', agentCountryData: {} }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();
              })
            }
            else {
              this.handleSaveEnable();
              this.handleClearEnable();
            }
          // } 
          // else {
          //   this.handleSaveEnable();
          // }
        })
      break;
      case 'destinationcountry':
        this.setState({ destinationCountryCheck: false }, () => {
          if (this.state.destinationCountry == undefined) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty', }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.destinationCountry.length == 0) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty' }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        })
      break;
    }
  }

  handleSaveEnable = () => {
    let lengthErrCount = 0;
    let ruleErrCount = 0;
    if (this.state.lengthRuleValidations.length > 0) {
      this.state.lengthRuleValidations.map((obj, index) => {
        if (isNaN(obj.maxLength)) {
          lengthErrCount = lengthErrCount + 1;
        }
        else if (obj.minLengthCheck == true || obj.maxLengthCheck == true) {
          lengthErrCount = lengthErrCount + 1;
        }
        // else if(obj.minLength > obj.maxLength){
        //   lengthErrCount =lengthErrCount+1;
        // }
      })
    }
    if (this.state.accountNumberValidations.length > 0) {
      this.state.accountNumberValidations.map((obj, index) => {
        let positionLength = (obj.position == undefined || isNaN(obj.position) || obj.position == '') ? 0 : obj.position;
        let rangeLength = (obj.range == undefined || isNaN(obj.range) || obj.range == '') ? 0 : obj.range;
        let valueLength = (obj.value == undefined || obj.value.length == 0) ? 0 : obj.value.length;
        let ruleAllowedLength = (obj.ruleAllowed == undefined || obj.ruleAllowed.length == 0) ? 0 : obj.ruleAllowed.length;
        if (obj.ruleAllowedCheck == true || obj.positionCheck == true || obj.rangeCheck == true || obj.valueCheck == true) {
          ruleErrCount = ruleErrCount + 1;
        }
        else if (positionLength == 0 && rangeLength == 0 && ruleAllowedLength == 0 && valueLength == 0) {
          return null;
        }
        else if (positionLength > 0 && rangeLength > 0 && ruleAllowedLength > 0 && valueLength > 0) {
          return null;
        }
        else {
          ruleErrCount = ruleErrCount + 1;
        }
      })
    }
    if (lengthErrCount > 0 || ruleErrCount > 0) {
      this.setState({ saveDisabled: false })
    }
    else if (this.checkExistingRule()) {
      this.setState({ saveDisabled: false })
    }
    else if (Object.keys(this.state.agentSourceCountryData).length == 0) {
      this.setState({ saveDisabled: false })
    }
    else if(Object.keys(this.state.draweeBankData).length > 0 && Object.keys(this.state.agentCountryData).length == 0){
      this.setState({ saveDisabled: false })
    }
    else {
      this.setState({ saveDisabled: true });
    }
  }

  handleClearEnable = () => {
    if ( (Object.keys(this.state.agentSourceCountryData).length > 0)
     || (Object.keys(this.state.draweeBankData).length > 0) 
    || (Object.keys(this.state.agentCountryData).length > 0)
    || (Object.keys(this.state.destinationCountryData).length > 0) 
     ) {
      this.setState({
        clearDisabled: true
      })
    }
    else if(this.state.lengthRuleValidations.length > 1 || this.state.accountNumberValidations.length > 1){
      this.setState({
        clearDisabled: true
      })
    }
    else if(this.state.lengthRuleValidations.length == 1 || this.state.accountNumberValidations.length == 1){
      if(this.state.lengthRuleValidations[0].minLength != undefined || this.state.lengthRuleValidations[0].maxLength != undefined){
        this.setState({
          clearDisabled: true
        })
      }
      else if(this.state.accountNumberValidations[0].ruleAllowed != undefined || this.state.accountNumberValidations[0].ruleAllowed != '' || this.state.accountNumberValidations[0].position != undefined ||this.state.accountNumberValidations[0].position != '' || this.state.accountNumberValidations[1].range != undefined || this.state.accountNumberValidations[1].range != '' || this.state.accountNumberValidations[1].value != undefined || this.state.accountNumberValidations[1].value != ''){
        this.setState({
          clearDisabled: true
        })
      }
    }
    else {
      this.setState({
        clearDisabled: false
      })
    }
  }

  handleTextfieldChange = (e, id, type) => {
    this.setState({onChange:true})
    let lengthRuleValidations = [...this.state.lengthRuleValidations];
    let accountNumberValidations = [...this.state.accountNumberValidations];
    let index = parseInt(id);
    let value = parseInt(e.target.value);
    if (type == 'minLength' || type == 'maxLength') {
      this.setState({ lengthRuleValidations }, () => {
        switch (type) {
          case 'minLength':
            lengthRuleValidations[index].minLength = value;
            lengthRuleValidations[index].minLengthCheck = false;
            this.setState({ lengthRuleValidations }, () => {
              if (this.state.lengthRuleValidations[index].minLength == undefined) {
                lengthRuleValidations[index].minLength = 0;
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                })
              }
              else if (this.state.lengthRuleValidations[index].minLength.length == 0) {
                lengthRuleValidations[index].minLength = 0;
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                })
              }
              else if (this.state.lengthRuleValidations[index].minLength < 0) {
                lengthRuleValidations[index].minLengthCheck = true;
                lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                })
              }
              else {
                lengthRuleValidations[index].minLengthCheck = false;
                lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                })
              }
            })
          break;
          case 'maxLength':
            lengthRuleValidations[index].maxLength = value;
            lengthRuleValidations[index].maxLengthCheck = false;
            this.setState({ lengthRuleValidations }, () => {
              if (this.state.lengthRuleValidations[index].maxLength == undefined) {
                lengthRuleValidations[index].maxLength = 0;
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
              if(value > 0 && (this.state.lengthRuleValidations[index].minLength == null || this.state.lengthRuleValidations[index].minLength == undefined || this.state.lengthRuleValidations[index].minLength == '')){
                lengthRuleValidations[index].minLengthCheck = true;
                lengthRuleValidations[index].minLengthErrMsg = 'Min Length cannot be empty';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();
      
                });
              }
              else if (this.state.lengthRuleValidations[index].maxLength.length == 0) {
                lengthRuleValidations[index].maxLength = 0;
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
              else if (this.state.lengthRuleValidations[index].maxLength < 0) {
                lengthRuleValidations[index].maxLengthCheck = true;
                lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();
                });
              }
              else {
                lengthRuleValidations[index].maxLengthCheck = false;
                lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
            })
          break;
        }
      })
    }
    else {
      this.setState({ accountNumberValidations }, () => {
        switch (type) {
          case 'position':
            accountNumberValidations[index].position = value;
            accountNumberValidations[index].positionCheck = false;
            this.setState({ accountNumberValidations }, () => {
              let positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position) || this.state.accountNumberValidations[index].position === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].position).length;
              let rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range) || this.state.accountNumberValidations[index].range === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].range).length;
              let valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
              let ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
              if (ruleAllowedLength > 0 || rangeLength > 0 || valueLength > 0) {
                if (positionLength == 0) {
                    accountNumberValidations[index].positionCheck = true;
                    accountNumberValidations[index].positionErrMsg = 'Position cannot be empty';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();
        
                    });
                }
                else if (this.state.accountNumberValidations[index].position == 0){
                  accountNumberValidations[index].positionCheck = true;
                    accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();
                    });
                }
                else if (this.state.accountNumberValidations[index].position < 0) {
                  accountNumberValidations[index].positionCheck = true;
                  accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();

                  });
                }
              }
              else if (ruleAllowedLength == 0 && rangeLength == 0 && valueLength == 0) {
                if (positionLength == 0) {
                  accountNumberValidations[index].positionCheck = false;
                  accountNumberValidations[index].positionErrMsg = '';
                  accountNumberValidations[index].rangeCheck = false;
                  accountNumberValidations[index].ruleAllowedCheck = false;
                  accountNumberValidations[index].valueCheck = false;
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();

                  });
                }
                else if (this.state.accountNumberValidations[index].position == 0) {
                  accountNumberValidations[index].positionCheck = true;
                  accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();
  
                  });
                }
              }
              else if (this.state.accountNumberValidations[index].position < 0) {
                accountNumberValidations[index].positionCheck = true;
                accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
              else {
                accountNumberValidations[index].positionCheck = false;
                accountNumberValidations[index].positionErrMsg = '';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
            })
            this.handlefieldBlur(e, 'val', 'type', index,'otherField');
          break;
          case 'range':
            accountNumberValidations[index].range = value;
            accountNumberValidations[index].rangeCheck = false;
            this.setState({ accountNumberValidations }, () => {
              let positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position) || this.state.accountNumberValidations[index].position === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].position).length;
              let rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range) || this.state.accountNumberValidations[index].range === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].range).length;
              let valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
              let ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
              if (ruleAllowedLength > 0 || positionLength > 0 || valueLength > 0) {
                if (rangeLength == 0) {
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range cannot be empty';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();

                  });
                }
                if (this.state.accountNumberValidations[index].range == 0){
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();
                  });
                }
                if (this.state.accountNumberValidations[index].range < 0) {
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();

                  });
                }
                if (rangeLength > 0 && valueLength > 0) {
                  if (rangeLength == valueLength) {
                    accountNumberValidations[index].valueCheck = false;
                    accountNumberValidations[index].valueErrMsg = '';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();

                    });
                  }
                  else {
                    accountNumberValidations[index].valueCheck = true;
                    accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();

                    });
                  }
                }
              }
              else if (ruleAllowedLength == 0 && positionLength == 0 && valueLength == 0) {
                if (rangeLength == 0) {
                  accountNumberValidations[index].rangeCheck = false;
                  accountNumberValidations[index].rangeErrMsg = '';
                  accountNumberValidations[index].positionCheck = false;
                  accountNumberValidations[index].ruleAllowedCheck = false;
                  accountNumberValidations[index].valueCheck = false;
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();

                  });
                }
                else if (this.state.accountNumberValidations[index].range == 0) {
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();
  
                  });
                }
                else if (this.state.accountNumberValidations[index].range < 0) {
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();

                  });
                }
              }
              else if (this.state.accountNumberValidations[index].range < 0) {
                accountNumberValidations[index].rangeCheck = true;
                accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
              else {
                accountNumberValidations[index].rangeCheck = false;
                accountNumberValidations[index].rangeErrMsg = '';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
            })
            this.handlefieldBlur(e, 'val', 'type', index,'otherField');
            break;
        }
      })
    }
  }

  handleLengthBlur = (e, index, type) => {
    let value = parseInt(e.target.value);
    let lengthRuleValidations = [...this.state.lengthRuleValidations];
    let accountNumberValidations = [...this.state.accountNumberValidations];
    switch (type) {
      case 'minLength':
        if (parseInt(lengthRuleValidations[index].maxLength) != 0 && (parseInt(lengthRuleValidations[index].minLength) > parseInt(lengthRuleValidations[index].maxLength))) {
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be greater than max';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (this.state.lengthRuleValidations[index].minLength < 0) {
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be negative';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (parseInt(lengthRuleValidations[index].minLength) > 100) {
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be greater than 100';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (parseInt(lengthRuleValidations[index].minLength) == 0) {
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Please Enter Min Length should be 1';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          });
        }
        else {
          lengthRuleValidations[index].minLengthCheck = false;
          lengthRuleValidations[index].maxLengthCheck = false;
          lengthRuleValidations[index].minLengthErrMsg = '';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          });
        }
        break;
      case 'maxLength':
        if (parseInt(lengthRuleValidations[index].minLength) != 0 && (parseInt(lengthRuleValidations[index].minLength) > parseInt(lengthRuleValidations[index].maxLength))) {
          lengthRuleValidations[index].maxLengthCheck = true;
          lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be less than min';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if(value > 0 && (this.state.lengthRuleValidations[index].minLength == null || this.state.lengthRuleValidations[index].minLength == undefined || this.state.lengthRuleValidations[index].minLength == '')){
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Min Length cannot be empty';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (this.state.lengthRuleValidations[index].maxLength < 0) {
          lengthRuleValidations[index].maxLengthCheck = true;
          lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be negative';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (parseInt(lengthRuleValidations[index].maxLength) > 100) {
          lengthRuleValidations[index].maxLengthCheck = true;
          lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be greater than 100';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }

        
        //  if ((this.state.lengthRuleValidations[index].maxLength >0) && (this.state.lengthRuleValidations[index].minLength ==0)) {

        //   alert("hello")
        //   // lengthRuleValidations[index].maxLengthCheck = true;
        //   // lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be negative';
        //   // this.setState({ lengthRuleValidations }, () => {
        //   //   this.handleSaveEnable();
        //   //   this.handleClearEnable();

        //   // });
        // }
        // if (parseInt(lengthRuleValidations[index].maxLength > 0) && (parseInt(lengthRuleValidations[index].minLength) === undefined)) {
        //   alert("fghjjhgf")
        //   lengthRuleValidations[index].maxLengthCheck = true;
        //   lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be fghgf';
        //   this.setState({ lengthRuleValidations }, () => {
        //     this.handleSaveEnable();
        //     this.handleClearEnable();

        //   });
        // }
        else {
          lengthRuleValidations[index].maxLengthCheck = false;
          lengthRuleValidations[index].minLengthCheck = false;
          lengthRuleValidations[index].maxLengthErrMsg = '';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          });
        }
        break;
      case 'position':
        let positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position) || this.state.accountNumberValidations[index].position === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].position).length;
        let rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range) || this.state.accountNumberValidations[index].range === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].range).length;
        let valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
        let ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
        if (ruleAllowedLength > 0 || rangeLength > 0 || valueLength > 0) {
          if (positionLength == 0) {
            accountNumberValidations[index].positionCheck = true;
            accountNumberValidations[index].positionErrMsg = 'Position cannot be empty';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
        else if (this.state.accountNumberValidations[index].position == 0){
          accountNumberValidations[index].positionCheck = true;
            accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
        }
          else if (this.state.accountNumberValidations[index].position < 0) {
            accountNumberValidations[index].positionCheck = true;
            accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
        }
        else if (ruleAllowedLength == 0 && rangeLength == 0 && valueLength == 0) {
          if (positionLength == 0) {
            accountNumberValidations[index].positionCheck = false;
            accountNumberValidations[index].positionErrMsg = '';
            accountNumberValidations[index].rangeCheck = false;
            accountNumberValidations[index].ruleAllowedCheck = false;
            accountNumberValidations[index].valueCheck = false;
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
          else if (this.state.accountNumberValidations[index].position == 0){
            accountNumberValidations[index].positionCheck = true;
              accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();
              });
          }
          else if (this.state.accountNumberValidations[index].position < 0) {
            accountNumberValidations[index].positionCheck = true;
            accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
        }
        else if (this.state.accountNumberValidations[index].position < 0) {
          accountNumberValidations[index].positionCheck = true;
          accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else {
          accountNumberValidations[index].positionCheck = false;
          accountNumberValidations[index].positionErrMsg = '';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        this.handlefieldBlur(e, 'val', 'type', index,'otherField');
        break;
      case 'range':
        positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position) || this.state.accountNumberValidations[index].position === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].position).length;
        rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range) || this.state.accountNumberValidations[index].range === '') ? 0 : JSON.stringify(this.state.accountNumberValidations[index].range).length;
        valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
        ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
        if (ruleAllowedLength > 0 || positionLength > 0 || valueLength > 0) {
          if (rangeLength == 0) {
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range cannot be empty';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
          else if (this.state.accountNumberValidations[index].range == 0){
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
          if (this.state.accountNumberValidations[index].range < 0) {
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
          if (rangeLength > 0 && valueLength > 0) {
            if (rangeLength == valueLength) {
              accountNumberValidations[index].valueCheck = false;
              accountNumberValidations[index].valueErrMsg = '';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
        }
        else if (ruleAllowedLength == 0 && positionLength == 0 && valueLength == 0) {
          if (rangeLength == 0) {
            accountNumberValidations[index].rangeCheck = false;
            accountNumberValidations[index].rangeErrMsg = '';
            accountNumberValidations[index].positionCheck = false;
            accountNumberValidations[index].ruleAllowedCheck = false;
            accountNumberValidations[index].valueCheck = false;
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
          else if (this.state.accountNumberValidations[index].range == 0) {
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
          if (this.state.accountNumberValidations[index].range < 0) {
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
        }
        else if (this.state.accountNumberValidations[index].range < 0) {
          accountNumberValidations[index].rangeCheck = true;
          accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else {
          accountNumberValidations[index].rangeCheck = false;
          accountNumberValidations[index].rangeErrMsg = '';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        this.handlefieldBlur(e, 'val', 'type', index,'otherField');
        break;
    }
  }

  addNewLengthRule = (checkIndex) => {
    let newPushObj = Object.assign({}, newLengthRuleObject);
    let existingIndex = null;
    let lengthRuleValidations = this.state.lengthRuleValidations;
    let checkExistingRule = this.state.lengthRuleValidations[checkIndex];
    this.state.lengthRuleValidations.map((obj, index) => {
      if (checkIndex == index) {
        return null;
      }
      else {
        if ((checkExistingRule.minLength == obj.minLength) && (checkExistingRule.maxLength == obj.maxLength)) {
          existingIndex = index;
        }
      }
    })
    if (existingIndex == null) {
      lengthRuleValidations.push(Object.assign({}, newPushObj));
      this.setState({ lengthRuleValidations });
    }
    else {
      this.setState({ shownogeneralrules: true, apiErrMsg: `Rule already exists at row ${existingIndex + 1}` }, () => {
        if (this.checkExistingRule()) {
          this.setState({ saveDisabled: false });
        }
        else {
          this.setState({ saveDisabled: true });
        }
      })
    }
  }

  deleteLengthRule = (index) => {
    let lengthRuleValidations = [];
    let duplicateLengthRuleValidations = this.state.lengthRuleValidations;
    duplicateLengthRuleValidations.splice(index, 1);
    this.setState({ lengthRuleValidations }, () => {
      this.setState({ lengthRuleValidations: duplicateLengthRuleValidations }, () => {
        if (this.checkExistingRule()) {
          this.setState({ saveDisabled: false });
        }
        else {
          this.setState({ saveDisabled: true });
        }
      })
    });
  }

  handleRuleAllowedChange = (e, type, index) => {
    let accountNumberValidations = [...this.state.accountNumberValidations];
    let value = e;
    accountNumberValidations[index].ruleAllowedCheck = false;
    this.setState({ accountNumberValidations }, () => {
      switch (type) {
        case 'allowed/disallowed':
          accountNumberValidations[index].ruleAllowed = value;
          this.setState({ accountNumberValidations }, () => {
            let rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range)) ? 0 : this.state.accountNumberValidations[index].range;
            let positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position)) ? 0 : this.state.accountNumberValidations[index].position;
            let valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
            let ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
            if (rangeLength > 0 || positionLength > 0 || valueLength > 0) {
              if (ruleAllowedLength == 0) {
                accountNumberValidations[index].ruleAllowedCheck = true;
                accountNumberValidations[index].ruleAllowedErrMsg = 'Rule Allowed cannot be empty';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
              else if(ruleAllowedLength > 0){
                selectLabels.map((obj)=>{
                  if(accountNumberValidations[index].ruleAllowed == obj.value){
                    accountNumberValidations[index].ruleAllowed = obj.value
                    accountNumberValidations[index].ruleAllowedCheck = false;
                    accountNumberValidations[index].ruleAllowedErrMsg = '';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();

                    });
                  }
                })
              }
            }
            else if (rangeLength == 0 && positionLength == 0 && valueLength == 0) {
              if (ruleAllowedLength == 0) {
                accountNumberValidations[index].ruleAllowedCheck = false;
                accountNumberValidations[index].ruleAllowedErrMsg = '';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  this.handleClearEnable();

                });
              }
              else if(ruleAllowedLength > 0){
                selectLabels.map((obj)=>{
                  if(accountNumberValidations[index].ruleAllowed == obj.value){
                    accountNumberValidations[index].ruleAllowed = obj.value
                    accountNumberValidations[index].ruleAllowedCheck = false;
                    accountNumberValidations[index].ruleAllowedErrMsg = '';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();

                    });
                  }
                })
              }
            }
            else {
              selectLabels.map((obj)=>{
                if(accountNumberValidations[index].ruleAllowed == obj.value){
                  accountNumberValidations[index].ruleAllowed = obj.value
                  accountNumberValidations[index].ruleAllowedCheck = false;
                  accountNumberValidations[index].ruleAllowedErrMsg = '';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    this.handleClearEnable();

                  });
                }
              })
            }
          })
          break;
      }
    })
  }

  handleRuleAllowedValueClick = (e, type, index) => {
    let accountNumberValidations = this.state.accountNumberValidations;
    let value = e.value;
    accountNumberValidations[index].ruleAllowedCheck = false;
    this.setState({ accountNumberValidations }, () => {
      switch (type) {
        case 'allowed/disallowed':
          accountNumberValidations[index].ruleAllowed = value;
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        break;
      }
    })
  }

  handleRuleAllowedBlur = (e, type, index) => {
    let accountNumberValidations = this.state.accountNumberValidations;
    accountNumberValidations[index].ruleAllowed = e.target.value;
    this.setState({ accountNumberValidations }, () => {
      switch (type) {
        case 'allowed/disallowed':
          let rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range)) ? 0 : this.state.accountNumberValidations[index].range;
          let positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position)) ? 0 : this.state.accountNumberValidations[index].position;
          let valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
          let ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
          if (rangeLength > 0 || positionLength > 0 || valueLength > 0) {
            if (ruleAllowedLength == 0) {
              accountNumberValidations[index].ruleAllowedCheck = true;
              accountNumberValidations[index].ruleAllowedErrMsg = 'Rule Allowed cannot be empty';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else if (rangeLength == 0 && positionLength == 0 && valueLength == 0) {
            if (ruleAllowedLength == 0) {
              accountNumberValidations[index].ruleAllowedCheck = false;
              accountNumberValidations[index].ruleAllowedErrMsg = '';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else {
            accountNumberValidations[index].ruleAllowedCheck = false;
            accountNumberValidations[index].ruleAllowedErrMsg = '';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();

            });
          }
          break;
      }
    })
  }

  handlefieldChange = (e, val, type, index) => {
    let pattern = /^[0-9]+$/i;
    let pattern1 = /^[0-9a-zA-Z]+$/i;
    let value = val;
    let accountNumberValidations = [...this.state.accountNumberValidations];
    let rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range)) ? 0 : this.state.accountNumberValidations[index].range;
    let positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position)) ? 0 : this.state.accountNumberValidations[index].position;
    let ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
    accountNumberValidations[index].valueCheck = false;
    accountNumberValidations[index].value = value;
    this.setState({ accountNumberValidations }, () => {
      let valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
      if (rangeLength > 0 || positionLength > 0 || ruleAllowedLength > 0) {
        if (valueLength == 0) {
          accountNumberValidations[index].valueCheck = true;
          accountNumberValidations[index].valueErrMsg = 'Value cannot be empty';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
        }
      }
      else if (rangeLength == 0 && positionLength == 0 && this.state.accountNumberValidations[index].value.length == 0) {
        if (valueLength == 0) {
          accountNumberValidations[index].valueCheck = false;
          accountNumberValidations[index].valueErrMsg = '';
          accountNumberValidations[index].rangeCheck = false;
          accountNumberValidations[index].ruleAllowedCheck = false;
          accountNumberValidations[index].positionCheck = false;
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
        }
      }
      else if (rangeLength > 0) {
        if (valueLength == 0) {
          accountNumberValidations[index].valueCheck = false;
          accountNumberValidations[index].valueErrMsg = '';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
        }
      }
      else {
        accountNumberValidations[index].valueCheck = false;
        accountNumberValidations[index].valueErrMsg = '';
        this.setState({ accountNumberValidations }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();

        });
      }
    })
  }

  handlefieldBlur = (e, val, type, index,from) => {
    console.log(from);
    let pattern = /^[0-9]+$/i;
    let pattern1 = /^[0-9a-zA-Z]+$/i;
    let accountNumberValidations = [...this.state.accountNumberValidations];
    let rangeLength = (this.state.accountNumberValidations[index].range == undefined || isNaN(this.state.accountNumberValidations[index].range)) ? 0 : this.state.accountNumberValidations[index].range;
    let positionLength = (this.state.accountNumberValidations[index].position == undefined || isNaN(this.state.accountNumberValidations[index].position)) ? 0 : this.state.accountNumberValidations[index].position;
    let ruleAllowedLength = (this.state.accountNumberValidations[index].ruleAllowed == undefined || this.state.accountNumberValidations[index].ruleAllowed.length == 0) ? 0 : this.state.accountNumberValidations[index].ruleAllowed.length;
    accountNumberValidations[index].valueCheck = false;
    this.setState({ accountNumberValidations }, () => {
      let valueLength = (this.state.accountNumberValidations[index].value == undefined || this.state.accountNumberValidations[index].value.length == 0) ? 0 : this.state.accountNumberValidations[index].value.length;
      if (rangeLength > 0 || positionLength > 0 || ruleAllowedLength > 0) {
        if (valueLength == 0 && from == undefined) {
          accountNumberValidations[index].valueCheck = true;
          accountNumberValidations[index].valueErrMsg = 'Value cannot be empty';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
        }
      }
      else if (rangeLength == 0 && positionLength == 0 && this.state.accountNumberValidations[index].value.length == 0) {
        if (valueLength == 0) {
          accountNumberValidations[index].valueCheck = false;
          accountNumberValidations[index].valueErrMsg = '';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
        }
      }
      else if (rangeLength > 0) {
        if (valueLength == 0) {
          accountNumberValidations[index].valueCheck = false;
          accountNumberValidations[index].valueErrMsg = '';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();

              });
            }
          }
        }
      }
      else {
        accountNumberValidations[index].valueCheck = false;
        accountNumberValidations[index].valueErrMsg = '';
        this.setState({ accountNumberValidations }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();

        });
      }
    })
  }

  checkExistingRule = () => {
    let lengthErrCount = 0;
    let ruleErrCount = 0;
    this.state.lengthRuleValidations.map((obj, index) => {
      let oldIndex = index;
      this.state.lengthRuleValidations.map((dupObj, index) => {
        if (oldIndex == index) {
          return null;
        }
        else {
          if (obj.minLength == dupObj.minLength && obj.maxLength == dupObj.maxLength) {
            lengthErrCount = lengthErrCount + 1;
          }
        }
      })
    })
    this.state.accountNumberValidations.map((obj, index) => {
      let oldInd = index;
      this.state.accountNumberValidations.map((dupObj, index) => {
        if (oldInd == index) {
          return null;
        }
        else {
          if (obj.ruleAllowed == dupObj.ruleAllowed && obj.position == dupObj.position && obj.range == dupObj.range && obj.value == dupObj.value) {
            ruleErrCount = ruleErrCount + 1;
          }
        }
      })
    })
    if (lengthErrCount > 0 || ruleErrCount > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
            [
              this.state.loading ?
                <Loader action={this.state.loaderMessage} /> :
                <div>
                  <div className="grid">
                    <p className="bank-profile global-font">Account Number Validation(Create)</p>
                  </div>
                  <Card style={getModalStyle()}>
                    <p className="account-validation-header">Validations</p>
                    <Grid container direction="row" className="" spacing={24} >
                      <Grid item xs={6} className="grid-margin-bottom grid-error" >
                        <Selectable
                          id="agentsourcecountry"
                          isRequired
                          searchable={true}
                          label='Country *'
                          value={this.state.agentSourceCountry}
                          options={this.state.countryList}
                          noResultsText="No Country Found"
                          searchBy={'label'}
                          placeholder={'Country'}
                          onChange={(e) => this.handleChange(e, 'agentsourcecountry')}
                          isEnabled={!this.state.isCustomerTypeDisabled}
                          onValueClick={(e) => this.handleValueClick(e, 'agentsourcecountry')}
                          onBlur={this.handleBlur}
                        />
                        {this.state.agentSourceCountryCheck ? <span className="errorMessage">{this.state.agentSourceCountryerrMsg} </span> : ''}
                      </Grid>
                    </Grid>
                    {
                       this.state.draweeBankList.length > 0 ?
                       <div>
                          <p className="account-validation-header">Drawee Bank Profile</p>
                          <p className="account-validation-text">(*If you want to apply validations to all Drawee Bank Profiles, then select only Drawee Bank. And if you want to apply validations to only particular Drawee Bank Profile, you can select from Drawee Bank Profile List, once Drawee Bank is selected)</p>
                       </div>
                       :null
                    }                    
                    <Grid container direction="row" className="" spacing={24}>
                    {
                      this.state.draweeBankList.length > 0 ?
                      <Grid item xs={6}>
                        <Selectable
                          id="draweeBank"
                          searchable={true}
                          label='Drawee Bank'
                          value={this.state.draweeBank}
                          options={this.state.draweeBankList}
                          noResultsText="No Drawee Bank Found"
                          searchBy={'label'}
                          placeholder={'Drawee Bank'}
                          onChange={(e) => this.handleChange(e, 'draweeBank')}
                          onValueClick={(e) => this.handleValueClick(e, 'draweeBank')}
                          onBlur={this.handleBlur}
                        />
                        {/* {this.state.agentCountryCheck ? <span className="errorMessage">{this.state.agentCountryerrMsg} </span> : ''} */}
                      </Grid>
                      : null
                    }
                    </Grid>
                    <Grid container direction="row" className="" spacing={24}>
                      {
                        this.state.agentList.length > 0 ?
                          <Grid item xs={12} className="grid-error">
                            <Selectable
                              id="agentCountry"
                              searchable={true}
                              label='Drawee Bank Profile *'
                              value={this.state.agentCountry}
                              options={this.state.agentList}
                              noResultsText="No Drawee Bank Found"
                              searchBy={'label'}
                              placeholder={'Drawee Bank Profile'}
                              onChange={(e) => this.handleChange(e, 'agentCountry')}
                              isEnabled={!this.state.isDraweeBankDisbaled}
                              onValueClick={(e) => this.handleValueClick(e, 'agentCountry')}
                              onBlur={this.handleBlur}
                            />
                            {/* {this.state.agentCountryCheck ? <span className="errorMessage">{this.state.agentCountryerrMsg} </span> : ''} */}
                          </Grid>
                          : null
                      }
                      {
                        this.state.agentBranchesList.length > 0
                          ?
                          <Grid item xs={6}>
                          <p className="account-validation-header">Beneficiary Bank</p>
                            <Selectable
                              id="destinationcountry"
                              searchable={true}
                              label='Beneficiary Bank'
                              value={this.state.destinationCountry}
                              options={this.state.agentBranchesList}
                              noResultsText="No Beneficiary Bank Found"
                              searchBy={'label'}
                              isClearable={true}
                              placeholder={'Beneficiary Bank'}
                              onChange={(e) => this.handleChange(e, 'destinationcountry')}
                              isEnabled={!this.state.isBenificaryBankDisabled}
                              onValueClick={(e) => this.handleValueClick(e, 'destinationcountry')}
                              onBlur={this.handleBlur}
                            />
                            {this.state.destinationCountryCheck ? <span className="errorMessage">{this.state.destinationCountryerrMsg} </span> : ''}
                          </Grid> : null
                      }
                    </Grid>
                    <p className="account-validation-header">Set Validation Rule</p>
                    <Grid container spacing={24} className='global-font'>
                      <Grid item xs={6}>
                        <p className="toggle-alignment"><b>AlphaNumeric Allowed :</b> No </p>
                        <div className="toggle-alignment">
                          <Toggle isChecked={this.state.isalphanumeric} id={'isalphanumeric'} isEnabled={true} onChange={this.onChange} />
                        </div>
                        <p className="toggle-alignment">Yes</p>
                      </Grid>
                      
                    </Grid>
                    <p className="account-validation-text">(For Exact Match, Enter Same Values)</p>

                    <Grid container direction="row" className="" spacing={24}>
                      {
                        this.state.lengthRuleValidations.map((rule, index) => {
                          return (
                            <Grid style={{ margin: `0px 0px 0px 8px` }} container direction="row" className="" justify="space-between"
                              alignItems="center" spacing={24}>
                              <Grid item xs={5} className="grid-error">
                                <Input id={'minLength' + index} value={`${rule.minLength}`} placeholder="Min Length" regex={/^[0-9]+$/i} label="Min Length" max={100} type="numeric" isRequired={false} onChange={(e) => this.handleTextfieldChange(e, index, 'minLength')} onBlur={(e) => this.handleLengthBlur(e, index, 'minLength')} />
                                {rule.minLengthCheck ? <span className="errorMessage-add">{rule.minLengthErrMsg} </span> : ''}
                              </Grid>
                              <Grid item xs={1}></Grid>
                              <Grid item xs={5} className="grid-error">
                                <Input id={'maxLength' + index} value={`${rule.maxLength}`} placeholder="Max Length" regex={/^[0-9]+$/i} label="Max Length" max={100} type="numeric" isRequired={false} onChange={(e) => this.handleTextfieldChange(e, index, 'maxLength')} onBlur={(e) => this.handleLengthBlur(e, index, 'maxLength')} />
                                {rule.maxLengthCheck ? <span className="errorMessage-add">{rule.maxLengthErrMsg} </span> : ''}
                              </Grid>
                              <Grid item xs={1} alignItems="flex-end">
                                {
                                  (index == this.state.lengthRuleValidations.length - 1) ?
                                    <FloatButton isEnabled={((rule.minLengthCheck == true) || (rule.maxLengthCheck == true) || (rule.maxLength == '' && rule.minLength == '') || (rule.maxLength == undefined && rule.minLength == undefined) || (parseInt(rule.maxLength) == 0 && parseInt(rule.minLength) == 0) || (isNaN(rule.minLength) == true && isNaN(rule.maxLength) == true)) ? false : true} icon="plus" style={{ margin: 0, height: 32, width: 35 }} onClick={() => this.addNewLengthRule(index)} />
                                    :
                                    <FloatButton umClass="validation-delete-btn" icon="delete" style={{ margin: 0, height: 32, width: 35, backgroundColor: '#c03018' }} onClick={() => this.deleteLengthRule(index)} />
                                }
                              </Grid>
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                    <hr style={{ marginTop: 30 }} />
                    <Grid container direction="row" className="" spacing={24}>
                      {this.state.accountNumberValidations.map((row, index) => {
                        return (
                          <Grid style={{ margin: `0px 0px 0px 8px` }} container direction="row" className="" justify="space-between"
                            alignItems="center" spacing={24}>
                            <Grid item xs={3} className="grid-error" style={{ paddingBottom: "20px" }}>
                              <Selectable
                                id="allowed/disallowed"
                                searchable={false}
                                label='Allowed/Disallowed'
                                value={row.ruleAllowed}
                                options={selectLabels}
                                placeholder={'Allowed/Disallowed'}
                                onChange={(e) => this.handleRuleAllowedChange(e, 'allowed/disallowed', index)}
                                onValueClick={(e) => this.handleRuleAllowedValueClick(e, 'allowed/disallowed', index)}
                                onBlur={(e) => this.handleRuleAllowedBlur(e, 'allowed/disallowed', index)}
                              />
                              {row.ruleAllowedCheck ? <span className="errorMessage-add tinyErrorMessage">{row.ruleAllowedErrMsg} </span> : ''}
                            </Grid>
                            <Grid item xs={2} className="grid-error">
                              <Input id={'position' + index} value={`${row.position}`} placeholder="Position" regex={/^[0-9]+$/i} label="Position" type="numeric" onChange={(e) => this.handleTextfieldChange(e, index, 'position')} onBlur={(e) => this.handleLengthBlur(e, index, 'position')} />
                              {row.positionCheck ? <span className="errorMessage-add tinyErrorMessage">{row.positionErrMsg} </span> : ''}
                            </Grid>
                            <Grid item xs={2} className="grid-error">
                              <Input id={'range' + index} value={`${row.range}`} placeholder="Range" regex={/^[0-9]+$/i} label="Range" type="numeric" onChange={(e) => this.handleTextfieldChange(e, index, 'range')} onBlur={(e) => this.handleLengthBlur(e, index, 'range')} />
                              {row.rangeCheck ? <span className="errorMessage-add tinyErrorMessage">{row.rangeErrMsg} </span> : ''}
                            </Grid>
                            <Grid item xs={2} className="grid-error">
                              <Input id={'value' + index} value={`${row.value}`} placeholder="Value" label="Value" type="freeText" onChange={(e, value) => this.handlefieldChange(e, value, 'value', index)} onBlur={(e, value) => this.handlefieldBlur(e, value, 'value', index)} />
                              {row.valueCheck ? <span className="errorMessage-add tinyErrorMessage">{row.valueErrMsg} </span> : ''}
                            </Grid>
                            <Grid item xs={1} alignItems="flex-end">
                              {
                                (index == this.state.accountNumberValidations.length - 1) ?
                                  <FloatButton isEnabled={(row.ruleAllowedCheck || row.positionCheck || row.rangeCheck || row.valueCheck || (row.ruleAllowed == undefined) || (row.ruleAllowed == "") || (isNaN(row.position) || (isNaN(row.range) || (row.value.length == 0)))) ? false : true} icon="plus" style={{ margin: 0, height: 32, width: 35 }} onClick={() => this.addNewRule(index)} />
                                  :
                                  <FloatButton umClass="validation-delete-btn" icon="delete" style={{ margin: 0, height: 32, width: 35, backgroundColor: '#c03018' }} onClick={() => this.deleteRule(index)} />
                              }
                            </Grid>
                          </Grid>
                        )
                      })}
                    </Grid>
                    <Grid container spacing={24} className='global-font'>
                      <Grid className="global-font" item={24}>
                        <p className="toggle-alignment"><b>Status :</b> Disable </p>
                        <div className="toggle-alignment">
                          <Toggle isChecked={this.state.status} id={'status'} isEnabled={true} onChange={this.onChange} />
                        </div>
                        <p className="toggle-alignment">Enable</p>
                      </Grid>
                    </Grid>
                    <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                      <Grid item xs={4}>
                        <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                          <TextButton style={{ color: "#888888", fontSize: 18, fontFamily:"Gotham-Rounded", marginBottom:20,fontWeight:500 }} isEnabled={this.state.clearDisabled} onClick={this.handleClear} >Clear</TextButton>
                          <TextButton style={{ color: "#19ace3", fontSize: 18, fontFamily:"Gotham-Rounded", marginBottom:20,fontWeight:500 }} isEnabled={this.state.saveDisabled} onClick={this.handleData} >Save</TextButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                  {
                    this.state.loading ?
                      <Loader action={this.state.loaderMessage} /> : null
                  }
                  {
                    this.state.shownogeneralrules ? <ErrorModal isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleModalResponse} /> : null
                  }
                  {
                    this.state.snackbar ?
                      <Notifications
                        id="notificationBar"
                        umStyle={this.state.notificationType}
                        placement="bottom-right"
                        children={this.state.snackbarMessage}
                        delayShow={SHOW_NOTIFICATION}
                        delayHide={HIDE_NOTIFICATION}
                        style={{ width: 'auto' }}
                      /> : null
                  }
                  {
                    this.state.confirmClear ? <ModalBox isOpen={this.state.confirmClear} fromAction={this.state.fromAction} actionType="Yes" message={(this.state.modalMessage)} modalAction={this.handleConfirmResponse} /> : null
                  }
                </div>
            ]
        }
      </div>
    )
  }
}

export default withStyles(styles)(CreateAccountValidation);
