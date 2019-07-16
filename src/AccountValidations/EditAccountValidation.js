import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as ApiAccountService from './ApiAccountService';
import * as Exceptionhandler from './../ExceptionHandling';
import Breadcrumps from '../component/Breadcrumps';
import Snackbarcomp from '../component/snackbar';
import { Toggle, Selectable, Input, FloatButton, TextButton, Notifications } from 'finablr-ui';
import ErrorModal from './../component/ErrorModalbox';
import ModalBox from './../component/Modalbox';
import Loader from '../component/Loader';
import Typography from '@material-ui/core/Typography';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import EmptyListComponent from '../component/EmptylistComponent';
import * as config from '../config/config';

function getModalStyle() {
  return {
    padding: `0 20px 0 20px`
  };
}

const newLengthRuleObject = { minLength: null, maxLength: null, minLengthCheck: false, maxLengthCheck: false, minLengthErrMsg: '', maxLengthErrMsg: '' };
const selectLabels = [{ 'id': 1, 'label': 'Allowed', 'value': 'ALLOWED' }, { 'id': 2, 'label': 'DisAllowed', 'value': 'DISALLOWED' }];

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
  title: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded'
  },
  dense: {
    marginTop: 19,
  },
});

class EditAccountValidation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      agentSourceCountry: '',
      lengthRuleValidations: [{ minLength: null, maxLength: null, minLengthCheck: false, maxLengthCheck: false, minLengthErrMsg: '', maxLengthErrMsg: '' }],
      newRuleObject: { ruleAllowed: '', position: '', range: '', value: '', valueCheck: false, positionCheck: false, rangeCheck: false, ruleAllowedCheck: false, valueErrMsg: '', positionErrMsg: '', rangeErrMsg: '', ruleAllowedErrMsg: '' },
      accountNumberValidations: [{ ruleAllowed: '', position: '', range: '', value: '', valueCheck: false, positionCheck: false, rangeCheck: false, ruleAllowedCheck: false, valueErrMsg: '', positionErrMsg: '', rangeErrMsg: '', ruleAllowedErrMsg: '' }],
      agentSourceCountryData: {},
      agentCountry: '',
      agentCountryData: {},
      destinationCountryData: {},
      accountValidationDetails: {},
      totalRecords: null,
      agentSourceCountryCheck: false,
      agentCountryCheck: false,
      destinationCountryCheck: false,
      status: true,
      dataFieldsError: false,
      countryList: [],
      destinationCountry: '',
      agentList: [],
      agentBranchesList: [],
      saveDisabled: true,
      agentDisabled: true,
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      minLength: '',
      minLengthCheck: false,
      minLengthErrMsg: '',
      maxLength: '',
      breadcrumps: [],
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
      draweeBank:'',
    }
  }
  componentDidMount() {
    console.log(this.props);
    this.fetchAccountValidationRule(this.props.match.params.accountcode);
  }

  fetchAccountValidationRule = (accountcode) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiAccountService.getAccountValidationTabView(accountcode,headers)
          .then((response) => {
            if (response.status == 200) {
              console.log(response)
              this.setState({
                loading: true, serverError: false,
                agentSourceCountry: response.data.countryName,
                agentSourceCountryData: { id: 1, label: response.data.countryName, field: response.data.countryName },
                agentCountryData: { id: 1, label: (response.data.draweeBankProfile == null) ? '---' : response.data.draweeBankProfile, field: (response.data.draweeBankProfile == null) ? 'ALL' : response.data.draweeBankProfile },
                destinationCountryData: { id: 1, label: (response.data.beneficiaryBank == null) ? '---' : response.data.beneficiaryBank, field: (response.data.beneficiaryBank == null) ? 'ALL' : response.data.beneficiaryBank },
                destinationCountry: (response.data.beneficiaryBank == null) ? '---' : response.data.beneficiaryBank,
                agentCountry: (response.data.draweeBankProfile == null) ? '---' : response.data.draweeBankProfile,
                isalphanumeric: response.data.allowAlphaNumeric,
                draweeBank: (response.data.draweeBankName == null) ? '---' : response.data.draweeBankName,
                status: (response.data.status == 'ENABLED') ? true : false
              }, () => {
                let breadcrumps = [];
                breadcrumps = [{ link: '/accountvalidation', text: 'Account Number Validations' }, { link: '#', text: response.data.id }];
                this.setState({ breadcrumps });
                let accountNumberValidations = [];
                let lengthRuleValidations = [];
                if (response.data.validationValue.length > 0) {
                  response.data.validationValue.map((obj) => {
                    let ruleObj = {};
                    ruleObj.position = obj.position;
                    ruleObj.positionCheck = false;
                    ruleObj.positionErrMsg = '';
                    ruleObj.range = obj.range;
                    ruleObj.rangeCheck = false;
                    ruleObj.rangeErrMsg = '';
                    ruleObj.value = obj.value;
                    ruleObj.valueCheck = false;
                    ruleObj.valueErrMsg = '';
                    ruleObj.ruleAllowed = obj.validationType;
                    ruleObj.ruleAllowedCheck = false;
                    ruleObj.ruleAllowedErrMsg = '';
                    accountNumberValidations.push(ruleObj)
                  })
                }
                if (response.data.accountNumberLengths.length > 0) {
                  response.data.accountNumberLengths.map((obj, index) => {
                    let lengthRuleObj = {};
                    lengthRuleObj.minLength = obj.minimumLength;
                    lengthRuleObj.minLengthCheck = false;
                    lengthRuleObj.minLengthErrMsg = '';
                    lengthRuleObj.maxLength = obj.maximumLength;
                    lengthRuleObj.maxLengthCheck = false;
                    lengthRuleObj.maxLengthErrMsg = '';
                    lengthRuleValidations.push(lengthRuleObj);
                  })
                }
                if (accountNumberValidations.length > 0) {
                  this.setState({ accountNumberValidations }, () => {
                    if (lengthRuleValidations.length > 0) {
                      this.setState({ lengthRuleValidations, loading: false }, () => {
                        console.log(this.state.lengthRuleValidations)
                        this.handleSaveEnable();
                      });
                    }
                    else{
                      this.setState({ loading: false }, () => {
                        this.handleSaveEnable();
                      })
                    }
                  })
                }
                else {
                  if (lengthRuleValidations.length > 0) {
                    this.setState({ lengthRuleValidations, loading: false }, () => {
                      console.log(this.state.lengthRuleValidations)
                      this.handleSaveEnable();
                    });
                  }
                  else{
                    this.setState({ loading: false }, () => {
                      this.handleSaveEnable();
                    })
                  }
                }
              })
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 400) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ loading: false, serverError: false, confirmStatus: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      })
    }
  }

  onChange = (e) => {
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

  handleModalResponse = (data) => {
    if (data) {
      this.setState({ shownogeneralrules: false, apiErrMsg: '' })
    }
  }

  handleCreateAccountvalidation = () => {
    let data = {};
    data.allowAlphaNumeric = this.state.isalphanumeric;
    data.status = this.state.status ? 'ENABLED' : 'DISABLED';
    if (this.state.lengthRuleValidations.length > 0) {
      data.accountNumberLength = [];
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
        data.accountNumberLength.push(lengthRule);
      })
    }
    if (this.state.accountNumberValidations.length > 0) {
      data.accountNumberValidationsList = [];
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
          data.accountNumberValidationsList.push(ruleAllowedObj);
        }
        else{
          return null;
        }
      })
    }
    console.log(data);
    this.handleEditAccountvalidationApiCall(data, this.props.match.params.accountcode);
  }

  handleEditAccountvalidationApiCall = (data, accountcode) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
    this.setState({ loading: true, loaderMessage: 'Posting data',snackbar: false },()=>{
      ApiAccountService.EditAccountValidation(data, accountcode,headers)
      .then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Account Number Validation Edited successfully.' }, () => {
            setTimeout(
              function() {
                this.props.history.push(`/accountvalidation`);
              }
              .bind(this),
              700
          );
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
    })
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

  handleData = () => {
    if (this.checkExistingRule()) {
      console.log('yes');
      this.setState({ shownogeneralrules: true, apiErrMsg: `Some Rules are Duplicated. Please remove Duplicated Rules` });
    }
    else {
      console.log('no');
      this.handleCreateAccountvalidation();
    }
  }

  handleModalResponse = (data) => {
    if (data) {
      this.setState({ shownogeneralrules: false, apiErrMsg: '' })
    }
  }

  handleChange = (e, id) => {
    switch (id) {
      case 'agentsourcecountry':
        this.setState({ agentSourceCountry: e, agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
          }
        });
        break;
      case 'agentCountry':
        this.setState({ agentCountry: e, agentCountryCheck: false }, () => {
          if (this.state.agentCountry == undefined) {
            this.setState({ agentCountryCheck: true, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.agentCountry.length == 0) {
            this.setState({ agentCountryCheck: true, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
          }
        });
        break;
      case 'destinationcountry':
        this.setState({ destinationCountryCheck: false }, () => {
          if (this.state.destinationCountry == undefined) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty', }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.destinationCountry.length == 0) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty' }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
          }
        })
        break;
    }
  }

  handleValueClick = (e, id) => {
    switch (id) {
      case 'agentsourcecountry':
        this.setState({ agentSourceCountryData: {}, agentCountryData: {}, agentList: [] }, () => {
          let value = e.value;
          this.setState({ agentSourceCountryData: e, agentSourceCountry: value }, () => {
            this.fetchDraweeBankList(this.state.agentSourceCountryData.label);
            this.handleSaveEnable();
          })
        })
        break;
      case 'agentCountry':
        this.setState({ agentCountryData: {} }, () => {
          let value = e.value;
          this.setState({ agentCountryData: e, agentCountry: value }, () => {
            this.handleSaveEnable();
          })
        })
        break;
      case 'destinationcountry':
        this.setState({ destinationCountryData: {} }, () => {
          let value = e.value;
          this.setState({ destinationCountryData: e, destinationCountry: value }, () => {
            this.handleSaveEnable();
          })
        })
        break;
    }
  }

  handleBlur = (e) => {
    // console.log(e.target.id);
    switch (e.target.id) {
      case 'agentsourcecountry':
        this.setState({ agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Country cannot be empty', agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesList: [], destinationCountry: undefined, destinationCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
          }
        })
        break;
      case 'agentCountry':
        this.setState({ agentCountryCheck: false }, () => {
          if (this.state.agentCountry == undefined) {
            this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Drawee Bank cannot be empty', agentCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.agentCountry.length == 0) {
            this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Drawee Bank cannot be empty', agentCountryData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
          }
        })
        break;
      case 'destinationcountry':
        this.setState({ destinationCountryCheck: false }, () => {
          if (this.state.destinationCountry == undefined) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty', }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.destinationCountry.length == 0) {
            this.setState({ destinationCountryCheck: false, destinationCountryerrMsg: 'Beneficiary Bank cannot be empty' }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
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
    else {
      this.setState({ saveDisabled: true });
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
                  
                })
              }
              else if (this.state.lengthRuleValidations[index].minLength.length == 0) {
                lengthRuleValidations[index].minLength = 0;
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  
                })
              }
              else if (this.state.lengthRuleValidations[index].minLength < 0) {
                lengthRuleValidations[index].minLengthCheck = true;
                lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  
                })
              }
              else {
                lengthRuleValidations[index].minLengthCheck = false;
                lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  
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
                  
                });
              }
              if(value > 0 && (this.state.lengthRuleValidations[index].minLength == null || this.state.lengthRuleValidations[index].minLength == undefined || this.state.lengthRuleValidations[index].minLength == '')){
                lengthRuleValidations[index].minLengthCheck = true;
                lengthRuleValidations[index].minLengthErrMsg = 'Min Length cannot be empty';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  
                });
              }
              else if (this.state.lengthRuleValidations[index].maxLength.length == 0) {
                lengthRuleValidations[index].maxLength = 0;
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  
                });
              }
              else if (this.state.lengthRuleValidations[index].maxLength < 0) {
                lengthRuleValidations[index].maxLengthCheck = true;
                lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                 
                });
              }
              else {
                lengthRuleValidations[index].maxLengthCheck = false;
                lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be negative';
                this.setState({ lengthRuleValidations }, () => {
                  this.handleSaveEnable();
                  
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
                      
                    });
                }
                else if (this.state.accountNumberValidations[index].position == 0){
                  accountNumberValidations[index].positionCheck = true;
                    accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      
                    });
                }
                else if (this.state.accountNumberValidations[index].position < 0) {
                  accountNumberValidations[index].positionCheck = true;
                  accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    
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
                    
                  });
                }
                else if (this.state.accountNumberValidations[index].position == 0) {
                  accountNumberValidations[index].positionCheck = true;
                  accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    
                  });
                }
              }
              else if (this.state.accountNumberValidations[index].position < 0) {
                accountNumberValidations[index].positionCheck = true;
                accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  
                });
              }
              else {
                accountNumberValidations[index].positionCheck = false;
                accountNumberValidations[index].positionErrMsg = '';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  
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
                    
                  });
                }
                if (this.state.accountNumberValidations[index].range == 0){
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    
                  });
                }
                if (this.state.accountNumberValidations[index].range < 0) {
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    
                  });
                }
                if (rangeLength > 0 && valueLength > 0) {
                  if (rangeLength == valueLength) {
                    accountNumberValidations[index].valueCheck = false;
                    accountNumberValidations[index].valueErrMsg = '';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      
                    });
                  }
                  else {
                    accountNumberValidations[index].valueCheck = true;
                    accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
                    this.setState({ accountNumberValidations }, () => {
                      this.handleSaveEnable();
                      
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
                    
                  });
                }
                else if (this.state.accountNumberValidations[index].range == 0) {
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    
                  });
                }
                else if (this.state.accountNumberValidations[index].range < 0) {
                  accountNumberValidations[index].rangeCheck = true;
                  accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
                  this.setState({ accountNumberValidations }, () => {
                    this.handleSaveEnable();
                    
                  });
                }
              }
              else if (this.state.accountNumberValidations[index].range < 0) {
                accountNumberValidations[index].rangeCheck = true;
                accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  
                });
              }
              else {
                accountNumberValidations[index].rangeCheck = false;
                accountNumberValidations[index].rangeErrMsg = '';
                this.setState({ accountNumberValidations }, () => {
                  this.handleSaveEnable();
                  
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
            
          });
        }
        else if (this.state.lengthRuleValidations[index].minLength < 0) {
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be negative';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else if (parseInt(lengthRuleValidations[index].minLength) > 100) {
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Min cannot be greater than 100';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else if (parseInt(lengthRuleValidations[index].minLength) == 0) {
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Please Enter Min Length should be 1';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else {
          lengthRuleValidations[index].minLengthCheck = false;
          lengthRuleValidations[index].maxLengthCheck = false;
          lengthRuleValidations[index].minLengthErrMsg = '';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        break;
      case 'maxLength':
        if (parseInt(lengthRuleValidations[index].minLength) != 0 && (parseInt(lengthRuleValidations[index].minLength) > parseInt(lengthRuleValidations[index].maxLength))) {
          lengthRuleValidations[index].maxLengthCheck = true;
          lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be less than min';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else if(value > 0 && (this.state.lengthRuleValidations[index].minLength == null || this.state.lengthRuleValidations[index].minLength == undefined || this.state.lengthRuleValidations[index].minLength == '')){
          lengthRuleValidations[index].minLengthCheck = true;
          lengthRuleValidations[index].minLengthErrMsg = 'Min Length cannot be empty';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else if (this.state.lengthRuleValidations[index].maxLength < 0) {
          lengthRuleValidations[index].maxLengthCheck = true;
          lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be negative';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else if (parseInt(lengthRuleValidations[index].maxLength) > 100) {
          lengthRuleValidations[index].maxLengthCheck = true;
          lengthRuleValidations[index].maxLengthErrMsg = 'Max cannot be greater than 100';
          this.setState({ lengthRuleValidations }, () => {
            this.handleSaveEnable();
            
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
              
            });
          }
        else if (this.state.accountNumberValidations[index].position == 0){
          accountNumberValidations[index].positionCheck = true;
            accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              
            });
        }
          else if (this.state.accountNumberValidations[index].position < 0) {
            accountNumberValidations[index].positionCheck = true;
            accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              
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
              
            });
          }
          else if (this.state.accountNumberValidations[index].position == 0){
            accountNumberValidations[index].positionCheck = true;
              accountNumberValidations[index].positionErrMsg = 'Position value must be Min 1';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
          }
          else if (this.state.accountNumberValidations[index].position < 0) {
            accountNumberValidations[index].positionCheck = true;
            accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              
            });
          }
        }
        else if (this.state.accountNumberValidations[index].position < 0) {
          accountNumberValidations[index].positionCheck = true;
          accountNumberValidations[index].positionErrMsg = 'Position cannot be negative';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else {
          accountNumberValidations[index].positionCheck = false;
          accountNumberValidations[index].positionErrMsg = '';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            
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
              
            });
          }
          else if (this.state.accountNumberValidations[index].range == 0){
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              
            });
          }
          if (this.state.accountNumberValidations[index].range < 0) {
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              
            });
          }
          if (rangeLength > 0 && valueLength > 0) {
            if (rangeLength == valueLength) {
              accountNumberValidations[index].valueCheck = false;
              accountNumberValidations[index].valueErrMsg = '';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
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
              
            });
          }
          else if (this.state.accountNumberValidations[index].range == 0) {
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range value must be Min 1';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              
            });
          }
          if (this.state.accountNumberValidations[index].range < 0) {
            accountNumberValidations[index].rangeCheck = true;
            accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
              
            });
          }
        }
        else if (this.state.accountNumberValidations[index].range < 0) {
          accountNumberValidations[index].rangeCheck = true;
          accountNumberValidations[index].rangeErrMsg = 'Range cannot be negative';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
            
          });
        }
        else {
          accountNumberValidations[index].rangeCheck = false;
          accountNumberValidations[index].rangeErrMsg = '';
          this.setState({ accountNumberValidations }, () => {
            this.handleSaveEnable();
           
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
               
              });
            }
          }
          else if (rangeLength == 0 && positionLength == 0 && valueLength == 0) {
            if (ruleAllowedLength == 0) {
              accountNumberValidations[index].ruleAllowedCheck = false;
              accountNumberValidations[index].ruleAllowedErrMsg = '';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
          }
          else {
            accountNumberValidations[index].ruleAllowedCheck = false;
            accountNumberValidations[index].ruleAllowedErrMsg = '';
            this.setState({ accountNumberValidations }, () => {
              this.handleSaveEnable();
             
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
            
          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               

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
           
          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
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
            
          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
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
           
          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
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
            
          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
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
           
          });
        }
        else if (valueLength > 0) {
          if (this.state.isalphanumeric == true) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else if (pattern1.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be alphanumeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
               
              });
            }
          }
          else if (this.state.isalphanumeric == false) {
            if (accountNumberValidations[index].value.length != parseInt(accountNumberValidations[index].range)) {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value length must be equal to range';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else if (pattern.test(accountNumberValidations[index].value)) {
              accountNumberValidations[index].valueCheck = false;
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
              });
            }
            else {
              accountNumberValidations[index].valueCheck = true;
              accountNumberValidations[index].valueErrMsg = 'Value should be numeric';
              this.setState({ accountNumberValidations }, () => {
                this.handleSaveEnable();
                
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
          <div>
            <div className="grid">
              <Grid container spacing={24}>
                <Grid item xs={12} style={{ marginBottom: 20, marginTop: 20 }}>
                  <Breadcrumps links={this.state.breadcrumps} />
                </Grid>
              </Grid>
              <p className="bank-profile global-font">Account Number Validation(Edit)</p>
            </div>
            <Card style={getModalStyle()}>
              <p className="account-validation-header">Validations</p>
              <Grid container spacing={24}>
                <Grid item xs={4}>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Country
                  </Typography>
                  <span className="drawee-profile-view" >
                    {this.state.agentSourceCountry}
                  </span>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Drawee Bank
                  </Typography>
                  <span className="drawee-profile-view" >
                    {this.state.draweeBank}</span>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Drawee Bank Profile
                  </Typography>
                  <span className="drawee-profile-view" >
                    {this.state.agentCountry}</span>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Beneficiary Bank
                  </Typography>
                  <span className="drawee-profile-view" >
                    {this.state.destinationCountry}
                  </span>
                </Grid>
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
              <Grid container direction="row" className="" spacing={24}>
                {
                  this.state.lengthRuleValidations.map((rule, index) => {
                    return (
                      <Grid style={{ margin: `0px 0px 0px 8px` }} container direction="row" className="" justify="space-between"
                        alignItems="center" spacing={24}>
                        <Grid item xs={5} className="grid-error">
                          <Input id={'minLength' + index} value={`${rule.minLength}`} placeholder="Min Length" regex={/^[0-9]+$/i} label="Min Length" type="numeric" onChange={(e) => this.handleTextfieldChange(e, index, 'minLength')} onBlur={(e) => this.handleLengthBlur(e, index, 'minLength')} />
                          {rule.minLengthCheck ? <span className="errorMessage-add">{rule.minLengthErrMsg} </span> : ''}
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5} className="grid-error">
                          <Input id={'maxLength' + index} value={`${rule.maxLength}`} placeholder="Max Length" regex={/^[0-9]+$/i} label="Max Length" type="numeric" onChange={(e) => this.handleTextfieldChange(e, index, 'maxLength')} onBlur={(e) => this.handleLengthBlur(e, index, 'maxLength')} />
                          {rule.maxLengthCheck ? <span className="errorMessage-add">{rule.maxLengthErrMsg} </span> : ''}
                        </Grid>
                        <Grid item xs={1} alignItems="flex-end">
                          {
                            (index == this.state.lengthRuleValidations.length - 1) ?
                              <FloatButton isEnabled={((rule.minLengthCheck == true) || (rule.maxLengthCheck == true) || (rule.maxLength == '' && rule.minLength == '') || (rule.maxLength == undefined && rule.minLength == undefined) || (parseInt(rule.maxLength) == 0 && parseInt(rule.minLength) == 0) || (isNaN(rule.minLength) == true && isNaN(rule.maxLength) == true)) ? false : true} icon="plus" style={{ margin: 0, height: 32, width: 32 }} onClick={() => this.addNewLengthRule(index)} />
                              :
                              <FloatButton umClass="validation-delete-btn" icon="delete" style={{ margin: 0, height: 32, width: 32, backgroundColor: '#c03018' }} onClick={() => this.deleteLengthRule(index)} />
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
                      <Grid item xs={3} className="grid-error">
                        <Selectable
                          id="allowed/disallowed"
                          searchable={false}
                          label='Allowed/DisAllowed'
                          value={row.ruleAllowed}
                          options={selectLabels}
                          placeholder={'Allowed/DisAllowed'}
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
                            <FloatButton isEnabled={(row.ruleAllowedCheck || row.positionCheck || row.rangeCheck || row.valueCheck || (row.ruleAllowed == undefined) || (row.ruleAllowed == "") || (isNaN(row.position) || (isNaN(row.range) || (row.value.length == 0)))) ? false : true} icon="plus" style={{ margin: 0, height: 32, width: 32 }} onClick={() => this.addNewRule(index)} />
                            :
                            <FloatButton umClass="validation-delete-btn" icon="delete" style={{ margin: 0, height: 32, width: 32, backgroundColor: '#c03018' }} onClick={() => this.deleteRule(index)} />
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
                    <TextButton isEnabled={this.state.saveDisabled} style={{ color: "#19ace3",fontSize: 18,fontFamily:"Gotham-Rounded",marginBottom:20,fontWeight:500 }} onClick={this.handleData} >Save</TextButton>
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
              this.state.confirmClear ? <ModalBox isOpen={this.state.confirmClear} fromAction={this.state.fromAction} actionType="Yes" message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
            }
          </div>
      }
      </div>
    )
  }
}

export default withStyles(styles)(EditAccountValidation);
