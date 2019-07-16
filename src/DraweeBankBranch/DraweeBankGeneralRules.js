import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import getMuiTheme from "../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import '../vendor/common.css';
import * as Exceptionhandler from './../ExceptionHandling';
import Loader from '../component/Loader';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import { CheckBox, Notifications, Toggle, TextButton, Input } from 'finablr-ui';
import { Selectable } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from './../config/config';
import './../vendor/common.css';
import { relative } from 'path';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',

    fontFamily: 'Gotham-Rounded'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    overflow: `scroll`
  },
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: `100%`,
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
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  tabsRoot: {
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: 'bold',
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: 'black',
      opacity: 1,
    },
    '&$tabSelected': {
      color: 'white',
      fontWeight: 'bold',
    },
    '&:focus': {
      color: 'white',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },

  bootstrapRoot: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
});

// const theme = createMuiTheme({
//    palette: {
//      primary: green,
//    },
//    typography: {
//      useNextVariants: true,
//    },
//  });

const TrasmissionTypeList = [
{ 'id': 1, 'label': 'API', 'value': 'API' },
{ 'id': 2, 'label': 'FILE', 'value': 'FILE' },
{ 'id': 3, 'label': 'SWIFT', 'value': 'SWIFT' }]

const CustomerTypeList = [{ 'id': 1, 'label': 'INDIVIDUAL', 'value': 'INDIVIDUAL' },
{ 'id': 2, 'label': 'CORPORATE', 'value': 'CORPORATE' },
{ 'id': 3, 'label': 'BOTH', 'value': 'BOTH' }]

const BeneficiaryTypeList = [{ 'id': 1, 'label': 'INDIVIDUAL', 'value': 'INDIVIDUAL' },
{ 'id': 2, 'label': 'CORPORATE', 'value': 'CORPORATE' },
{ 'id': 3, 'label': 'BOTH', 'value': 'BOTH' }]

const RegAccountValid = /^[0-9\b]+$/;
const payoutRegExp = /^\d*(\.\d{0,3})?$/;

const Floatvalid = /[+-]?([0-9]*[.])?[0-9]+/;

class DraweeBankGeneralRules extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      checkedBankcode: false,
      checkedBranchcode: false,
      checkedAmount: false,
      toggleAML: false,
      toggleStatus: false,
      toggleAccount: false,
      toggleBankTransaction: false,
      toggleBeneficiaryValidation: false,
      toggleOralBeneficiaryValidationChecked: false,
      checkedAML: false,
      checkedCountrySupervisor: false,
      toggleOralCustomerValidationChecked: false,
      DraweeSettlementCcyCode: '',
      DraweeSettlementCcyCodeData:{},
      DraweeSettlementCcyCodecheck: false,
      DraweeSettlementCcyCodeerrMsg: '',
      isDraweeSettlementCcyCodeDisabled:false,
      TrasmissionType: undefined,
      TrasmissionTypeData:{},
      TrasmissionTypecheck: false,
      TrasmissionTypeerrMsg: '',
      CustomerType: '',
      CustomerTypeData:{},
      CustomerTypecheck: false,
      CustomerTypeerrMsg: '',
      BeneficiaryType: '',
      BeneficiaryTypeData:{},
      BeneficiaryTypecheck: false,
      BeneficiaryTypeerrMsg: '',
      AccountValidation: null,
      DefaultBeneAccountNumber: '',
      PayoutCcyCode: '',
      MinimumPayoutAmount: null,
      MaximumPayoutAmount: null,
      MinimumPayoutAmounterrMsg: '',
      MaximumPayoutAmounterrMsg: '',
      MinMaxPayoutAmounterrMsg: '',
      AccountValidationerrMsg: '',
      MinimumPayoutAmountCheck: false,
      AccountValidationCheck: false,
      MaximumPayoutAmountCheck: false,
      MinMaxPayoutAmountCheck: false,
      toggleAMLcheck: false,
      loading: true,
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      showWarning: false,
      loaderMessage: 'Retrieving Data',
      DraweeSettlementCcyCodeList:[],
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.fetchCurrencyCodesList();
    this.props.handleCompValueChange(false);
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        // if (this.props.draweeBankBranchProfileView.serviceType == 'Flash') {
        //   this.setState({ TrasmissionType: 'API', TrasmissionTypeData:{'id': 1, 'label': 'API', 'value': 'API'} });
        // }
        DraweeeBankBranchApiService.getgeneralrules(this.props.draweeBankBranchProfileView.branchId,headers)
          .then(response => {
            console.log(response);
            console.log(response.data.message);
            if (response.data.hasOwnProperty("message")) {
              this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: response.data.message }, () => {
                return null;
              })
            }
            else if (Object.keys(response.data).length == 0) {
              this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'No Data Found' }, () => {
                return null;
              })
            }
            else {
              this.setState({
                MaximumPayoutAmount: response.data.generalDraweeRules.bankTransactionProcessRule.maximunPayoutAmount,
                MinimumPayoutAmount: response.data.generalDraweeRules.bankTransactionProcessRule.minimumPayoutAmount,
                checkedAML: response.data.generalDraweeRules.bankWiseAMLVerification.amlSupervisor,
                toggleAML: response.data.generalDraweeRules.bankWiseAMLVerification.bankAMLVerification,
                checkedCountrySupervisor: response.data.generalDraweeRules.bankWiseAMLVerification.countrySupervisor,
                checkedBranchcode: response.data.generalDraweeRules.beneficiaryBankBranchCode,
                checkedBankcode: response.data.generalDraweeRules.beneficiaryBankCode,
                BeneficiaryType: response.data.generalDraweeRules.beneficiaryType,
                CustomerType: response.data.generalDraweeRules.customerType,
                AccountValidation: response.data.generalDraweeRules.numberOfWordsInAccountName,
                checkedAmount: response.data.generalDraweeRules.payoutAmountDecimalsAllowed,
                DraweeSettlementCcyCode: response.data.generalDraweeRules.settlementCurrencyCode,
                TrasmissionType: (response.data.generalDraweeRules.transmissionType == 'NONE') ? undefined : response.data.generalDraweeRules.transmissionType,
                // loading: false
              },()=>{
                this.state.DraweeSettlementCcyCodeList.map((obj)=>{
                  if(obj.value == this.state.DraweeSettlementCcyCode){
                    this.setState({DraweeSettlementCcyCodeData:obj})
                  }
                })
                CustomerTypeList.map((obj)=>{
                  if(obj.value == this.state.CustomerType){
                    this.setState({CustomerTypeData:obj})
                  }
                })
                BeneficiaryTypeList.map((obj)=>{
                  if(obj.value == this.state.BeneficiaryType){
                    this.setState({BeneficiaryTypeData:obj})
                  }
                })

              })
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (error.response.status == 409 || error.response.status == 400) {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' });
            } else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' });
            }
          });
      })
    }
  }

  fetchCurrencyCodesList = () => {
    let DraweeSettlementCcyCodeList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      DraweeeBankBranchApiService.CurrencyCodesList(headers).then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          response.data.map((obj) => {
            let CurrencyCode = {};
            CurrencyCode.id = obj.id;
            CurrencyCode.label = obj.code + ' - ' + obj.currencyName;
            CurrencyCode.value = obj.code;
            DraweeSettlementCcyCodeList.push(CurrencyCode);
          })
          this.setState({ DraweeSettlementCcyCodeList, isDraweeSettlementCcyCodeDisabled: true,loading: false }, () => {
            //console.log(this.state.serviceProviderList);
          });
        }
        else {
          this.setState({ isDraweeSettlementCcyCodeDisabled: false })
          alert('No Currency Code records found');
        }
      })
      .catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
          this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
      });
    }
  }

  //Toggle Button Changes
  handleToggleChange = (event, type) => {
    this.props.handleCompValueChange(true);
    switch (type || event.target.id) {
      case ('amount'):
        this.setState({ toggleAmount: event });
        break;
      // case ('amlvarification'):
      //   this.setState({ toggleAML: event }, () => {
      //     if (!event) {
      //       this.setState({
      //         toggleAMLcheck: false,
      //         toggleAMLerrMsg: "", checkedAML: false, checkedCountrySupervisor: false
      //       })
      //     }
      //   });
      //   break;
      case ('status'):
        this.setState({ toggleStatus: event });
        break;
      case ('account'):
        this.setState({ toggleAccount: event });
        break;
      case ('banktrasaction'):
        this.setState({ toggleBankTransaction: event });
        break;
      case ('beneficiaryvalidation'):
        this.setState({ toggleBeneficiaryValidation: event });
        break;
    }
  };

  onChange = (e) => {
    console.log(e.target.id, e.target.checked);
    this.props.handleCompValueChange(true);
    switch (e.target.id) {
      case ('amlvarification'):
        this.setState({ toggleAML: e.target.checked }, () => {
          if (!this.state.toggleAML) {
            this.setState({
              toggleAMLcheck: false,
              toggleAMLerrMsg: "", checkedAML: false, checkedCountrySupervisor: false
            })
          }
        });
        break;
    }
  }

  //Beneficiary Fields Validations
  handleCheckedChange = (event, value) => {
    console.log(event.target.id, value);
    this.props.handleCompValueChange(true);
    switch (event.target.id) {
      case ('bankcode'):
        this.setState({ checkedBankcode: value });
        break;
      case ('aml'):
        if (value) {
          this.setState({
            toggleAMLcheck: false,
            toggleAMLerrMsg: "", checkedAML: value
          })
        } else {
          if (!this.state.checkedCountrySupervisor) {
            this.setState({
              toggleAMLcheck: false,
              toggleAMLerrMsg: "Select at-least one value for Verification.", checkedAML: value
            })
          } else {
            this.setState({ checkedAML: value })
          }
        }
        break;
      case ('countrysupervisor'):
        if (value) {
          this.setState({
            toggleAMLcheck: false,
            toggleAMLerrMsg: "", checkedCountrySupervisor: value
          })
        } else {
          if (!this.state.checkedAML) {
            this.setState({
              toggleAMLcheck: false,
              toggleAMLerrMsg: "Select at-least one value for Verification.", checkedCountrySupervisor: value
            })
          } else {
            this.setState({ checkedCountrySupervisor: value })
          }
        }
        this.setState({ checkedCountrySupervisor: value });
        break;
      case ('branchcode'):
        this.setState({ checkedBranchcode: value });
        break;
   
      case ('amount'):
        this.setState({ checkedAmount: value });
        break;
    }
  };

  //Select Fields Changes

  handleChange = (data, id) => {
    this.props.handleCompValueChange(true);
    switch (id) {
      case ('DraweeSettlementCcyCode'):
        this.setState({ DraweeSettlementCcyCode: data, DraweeSettlementCcyCodecheck: false }, () => {
          if (this.state.DraweeSettlementCcyCode == undefined) {
            this.setState({ DraweeSettlementCcyCodecheck: false, DraweeSettlementCcyCodeerrMsg: 'Customer Type cannot be empty', customerTypeData: {} }, () => {
            })
          }
          // else if (this.state.DraweeSettlementCcyCode.length == 0) {
          //   this.setState({ DraweeSettlementCcyCodecheck: true, DraweeSettlementCcyCodeerrMsg: 'Customer Type cannot be empty', customerTypeData: {} }, () => {
          //   })
          // }
          else if(this.state.DraweeSettlementCcyCode.length > 0){
            this.state.DraweeSettlementCcyCodeList.map((obj)=>{
              if(this.state.DraweeSettlementCcyCode == obj.value){
                this.setState({ DraweeSettlementCcyCodeData: obj, DraweeSettlementCcyCode: obj.value }, () => {
                })
              }
            })
          }
        });
        break;
        case ('TrasmissionType'):
        this.setState({ TrasmissionType: data, TrasmissionTypecheck: false }, () => {
          if (this.state.TrasmissionType == undefined) {
            this.setState({ TrasmissionTypecheck: false, TrasmissionTypeerrMsg: 'Trasmission Type cannot be empty', TrasmissionTypeData: {} }, () => {
            })
          }
          else if(this.state.TrasmissionType.length > 0){
            TrasmissionTypeList.map((obj)=>{
              if(this.state.TrasmissionType == obj.value){
                this.setState({ TrasmissionTypeData: obj, TrasmissionType: obj.value }, () => {
                })
              }
            })
          }
        //   else if (this.state.TrasmissionType.length == 0) {
        //     this.setState({ TrasmissionTypecheck: true, TrasmissionTypeerrMsg: 'Trasmission Type cannot be empty', TrasmissionTypeData: {} }, () => {
        //     })
        //   }
        //  else {
        //   this.setState({ TrasmissionTypecheck: false, TrasmissionTypeerrMsg: '', TrasmissionType: data });
        //   }
        });
        break;
        case ('CustomerType'):
        this.setState({ CustomerType: data, CustomerTypecheck: false }, () => {
          if (this.state.CustomerType == undefined) {
            this.setState({ CustomerTypecheck: true, CustomerTypeerrMsg: 'Customer Type cannot be Empty', CustomerTypeData: {} }, () => {
            })
          }
          else if (this.state.CustomerType.length == 0) {
            this.setState({ CustomerTypecheck: true, CustomerTypeerrMsg: 'Customer Type cannot be Empty', CustomerTypeData: {} }, () => {
            })
          }
          else if(this.state.CustomerType.length > 0){
            CustomerTypeList.map((obj)=>{
              if(this.state.CustomerType == obj.value){
                this.setState({ CustomerTypeData: obj, CustomerType: obj.value }, () => {
                })
              }
            })
          }
        });
        break;
        case ('BeneficiaryType'):
        this.setState({ BeneficiaryType: data, BeneficiaryTypecheck: false }, () => {
          if (this.state.BeneficiaryType == undefined) {
            this.setState({ BeneficiaryTypecheck: true, BeneficiaryTypeerrMsg: 'Beneficiary Type cannot be Empty', BeneficiaryTypeData: {} }, () => {
            })
          }
          else if (this.state.BeneficiaryType.length == 0) {
            this.setState({ BeneficiaryTypecheck: true, BeneficiaryTypeerrMsg: 'Beneficiary Type cannot be Empty', BeneficiaryTypeData: {} }, () => {
            })
          }
          else if(this.state.BeneficiaryType.length > 0){
            BeneficiaryTypeList.map((obj)=>{
              if(this.state.BeneficiaryType == obj.value){
                this.setState({ BeneficiaryTypeData: obj, BeneficiaryType: obj.value }, () => {
                })
              }
            })
          }
        });
        break;

      }
    }

    handleValueClick = (obj, id) => {
      console.log(obj, id);
      switch (id) {
        case 'DraweeSettlementCcyCode':
          this.setState({ DraweeSettlementCcyCodeData: {} }, () => {
            let value = obj.value;
            this.setState({ DraweeSettlementCcyCodeData: obj, DraweeSettlementCcyCode: value }, () => {
            })
          });
          break;
          case 'TrasmissionType':
          this.setState({ TrasmissionTypeData: {} }, () => {
            let value = obj.value;
            this.setState({ TrasmissionTypeData: obj, TrasmissionType: value }, () => {
            })
          });
          break;
          case 'CustomerType':
          this.setState({ CustomerTypeData: {} }, () => {
            let value = obj.value;
            this.setState({ CustomerTypeData: obj, CustomerType: value }, () => {
            })
          });
          break;
          case 'BeneficiaryType':
          this.setState({ BeneficiaryTypeData: {} }, () => {
            let value = obj.value;
            this.setState({ BeneficiaryTypeData: obj, BeneficiaryType: value }, () => {
            })
          });
          break;
        }
      }

      handleBlur = (e) => {
        switch (e.target.id) {
          case 'DraweeSettlementCcyCode':
            this.setState({ DraweeSettlementCcyCodecheck: false }, () => {
              // if (this.state.DraweeSettlementCcyCode == undefined) {
              //   this.setState({ DraweeSettlementCcyCodecheck: true, DraweeSettlementCcyCodeerrMsg: 'customer type cannot be empty', DraweeSettlementCcyCodelist: {} }, () => {
              //   })
              // }
              // else if (this.state.DraweeSettlementCcyCode.length == 0) {
              //   this.setState({ DraweeSettlementCcyCodecheck: true, DraweeSettlementCcyCodeerrMsg: 'customer type cannot be empty', DraweeSettlementCcyCodelist: {} }, () => {
              //   })
              // }
             
            })
            break;
            case 'TrasmissionType':
            this.setState({ TrasmissionTypecheck: false }, () => {
              // if (this.state.TrasmissionType == undefined) {
              //   this.setState({ TrasmissionTypecheck: true, TrasmissionTypeerrMsg: 'Trasmission type cannot be empty', TrasmissionTypeData: {} }, () => {
              //     this.handleSaveEnable();
              //   })
              // }
              // else if (this.state.TrasmissionType.length == 0) {
              //   this.setState({ TrasmissionTypecheck: true, TrasmissionTypeerrMsg: 'Trasmission type cannot be empty', TrasmissionTypeData: {} }, () => {
              //     this.handleSaveEnable();
              //   })
              // }
            
            })
            break;
            case 'CustomerType':
            this.setState({ CustomerTypecheck: false }, () => {
              if (this.state.CustomerType == undefined) {
                this.setState({ CustomerTypecheck: true, CustomerTypeerrMsg: 'Customer type cannot be empty', CustomerTypeData: {} }, () => {
                })
              }
              else if (this.state.CustomerType.length == 0) {
                this.setState({ CustomerTypecheck: true, CustomerTypeerrMsg: 'Customer type cannot be empty', CustomerTypeData: {} }, () => {
                })
              }
            
            })
            break;
            case 'BeneficiaryType':
            this.setState({ BeneficiaryTypecheck: false }, () => {
              if (this.state.BeneficiaryType == undefined) {
                this.setState({ BeneficiaryTypecheck: true, BeneficiaryTypeerrMsg: 'Beneficiary type cannot be empty', BeneficiaryTypeData: {} }, () => {
                })
              }
              else if (this.state.BeneficiaryType.length == 0) {
                this.setState({ BeneficiaryTypecheck: true, BeneficiaryTypeerrMsg: 'Beneficiary type cannot be empty', BeneficiaryTypeData: {} }, () => {
                })
              }
            
            })
            break;
          }
        }



  //TextField handleChanges

  handleTextFieldChange = (e, value) => {
    // this.setState({ dataFieldsError: false });
    this.props.handleCompValueChange(true);
    console.log('fdg',value)
    switch (e.target.id) {
      case ('accountvalidation'):
        this.setState({ AccountValidation: value, AccountValidationCheck: false },() => {
          console.log(typeof(value));
          if (parseInt(this.state.AccountValidation) == 0) {
            console.log('value',this.state.AccountValidation)
            this.setState({
              AccountValidationCheck: true, 
              AccountValidationerrMsg: 'Please Enter Account Name Minimum No of Words 1'
            })
          }
          else {
          this.setState({
            AccountValidationCheck:false,
            AccountValidationerrMsg:'',
          })
        }
        });
        break;
        case ('minimumpayoutamount'):
        this.setState({ MinimumPayoutAmount: value, MinimumPayoutAmountCheck: false },()=>{
          if (parseFloat(this.state.MinimumPayoutAmount) == 0 ) {
            this.setState({
              MinimumPayoutAmountCheck: true, 
              MinimumPayoutAmounterrMsg: 'Please Enter Minimum Payout Amount 1'
            })
          }else {
            this.setState({
            MinimumPayoutAmountCheck:false,
            MinimumPayoutAmounterrMsg:''})
          }
        });
        break;
        case ('maximumpayoutamount'):
        this.setState({ MaximumPayoutAmount: value, MaximumPayoutAmountCheck: false },()=>{
          if (parseFloat(this.state.MaximumPayoutAmount) == 0) {
            this.setState({
              MaximumPayoutAmountCheck: true, 
              MaximumPayoutAmounterrMsg: 'Please Enter Maximum Payout Amount 1'
            })
          }
        });
        break;
    }
  };

  handleAccountNumberError = (e) => {
    switch (e) {
      case 'regex':
        this.setState({ AccountValidationCheck: true, AccountValidationerrMsg: 'Only Numbers Allowed.' }, () => {
        })
        break;
      // case 'required':
      //   this.setState({
      //     accountNumberCheck: true,
      //     accountNumberErrMsg: 'Account Number cannot be Empty.'
      //   }, () => {
      //     this.handleSaveEnable();
      //   })
      //   break;
    }
  }

  handleMinimumPayoutError = (e) => {
    switch (e) {
      case 'regex':
        this.setState({ MinimumPayoutAmountCheck: true, MinimumPayoutAmounterrMsg: 'Enter Numeric Values and Upto 3 Decimals.' }, () => {
        })
        break;
      // case 'required':
      //   this.setState({
      //     accountNumberCheck: true,
      //     accountNumberErrMsg: 'Account Number cannot be Empty.'
      //   }, () => {
      //     this.handleSaveEnable();
      //   })
      //   break;
    }
  }

  handleMaximumPayoutError = (e) => {
    switch (e) {
      case 'regex':
        this.setState({ MaximumPayoutAmountCheck: true, MaximumPayoutAmounterrMsg: 'Enter Numeric Values and Upto 3 Decimals' }, () => {
        })
        break;
      // case 'required':
      //   this.setState({
      //     accountNumberCheck: true,
      //     accountNumberErrMsg: 'Account Number cannot be Empty.'
      //   }, () => {
      //     this.handleSaveEnable();
      //   })
      //   break;
    }
  }

  handleDraweeRuleSubmit = (event) => {
    event.preventDefault();
    if (this.state.CustomerTypecheck || Object.keys(this.state.CustomerTypeData).length == 0) {
      this.setState({
        CustomerTypecheck: true,
        CustomerTypeerrMsg: 'Please Select Customer Type'
      })
    }
    else if (Object.keys(this.state.BeneficiaryTypeData).length == 0) {
      this.setState({
        BeneficiaryTypecheck: true,
        BeneficiaryTypeerrMsg: 'Please Select Beneficiary Type'
      })
    }
    else if(this.state.AccountValidationCheck || this.state.MinimumPayoutAmountCheck || this.state.MaximumPayoutAmountCheck ){
      return null;
    }
    // else if(this.state.MinimumPayoutAmount == null){
    //   return null;
    // }
    // else if(this.state.MaximumPayoutAmount == null){
    //   return null;
    // }
    else if (parseFloat(this.state.MaximumPayoutAmount) < parseFloat(this.state.MinimumPayoutAmount)) {
      this.setState({
        MinMaxPayoutAmountCheck: true,
        MinMaxPayoutAmounterrMsg: "The Maximum Amount should be Always Greater than  Minimum Amount"
      })
    }
    
    else {
      this.setState({
        loading: true, loaderMessage: 'Posting data', DraweeSettlementCcyCodecheck: false,
        TrasmissionTypecheck: false,
        CustomerTypecheck: false,
        BeneficiaryTypecheck: false,
        toggleAMLcheck: false,
        AccountValidationCheck: false,
        MinimumPayoutAmountCheck: false,
        MaximumPayoutAmountCheck: false,
        MinMaxPayoutAmountCheck: false,
      }, () => {
        let minAmtLength = (this.state.MinimumPayoutAmount == undefined || this.state.MinimumPayoutAmount == null || this.state.MinimumPayoutAmount.length == 0) ? 0 : JSON.stringify(this.state.MinimumPayoutAmount).length;
        let maxAmtLength = (this.state.MaximumPayoutAmount == undefined || this.state.MaximumPayoutAmount == null || this.state.MaximumPayoutAmount.length == 0) ? 0 : JSON.stringify(this.state.MaximumPayoutAmount).length;
        let accValLength = (this.state.AccountValidation == undefined || this.state.AccountValidation == null || this.state.AccountValidation.length == 0) ? 0 : JSON.stringify(this.state.AccountValidation).length;
        let draweerulesdata = {
          "generalDraweeRules": {
            "bankTransactionProcessRule": {
              "maximunPayoutAmount":(this.state.MaximumPayoutAmount == null || this.state.MaximumPayoutAmount.length == 0 ) ? null :parseFloat(this.state.MaximumPayoutAmount),
              "minimumPayoutAmount":(this.state.MinimumPayoutAmount == null || this.state.MinimumPayoutAmount.length == 0 ) ? null :parseFloat(this.state.MinimumPayoutAmount),
              "payoutCurrencyCode": "INR",
            },
            "bankWiseAMLVerification": {
              "amlSupervisor": this.state.checkedAML,
              "bankAMLVerification": this.state.toggleAML,
              "countrySupervisor": this.state.checkedCountrySupervisor,
            },
            "beneficiaryBankBranchCode": this.state.checkedBranchcode,
            "beneficiaryBankCode": this.state.checkedBankcode,
            "beneficiaryType": this.state.BeneficiaryType,
            "customerType": this.state.CustomerType,
            "numberOfWordsInAccountName": this.state.AccountValidation,
            "payoutAmountDecimalsAllowed": this.state.checkedAmount,
            "settlementCurrencyCode": this.state.DraweeSettlementCcyCode,
            "transmissionType": (this.state.TrasmissionType == undefined || this.state.TrasmissionType == '') ? 'NONE' : this.state.TrasmissionType,
          },
          "ruleType": "GENERAL"
        }
        console.log(draweerulesdata);
        if(sessionStorage.getItem('token') == undefined){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else{
          let headers = {
            Authorization:sessionStorage.getItem('token')
          }
        DraweeeBankBranchApiService.postgeneralrules(draweerulesdata, this.props.draweeBankBranchProfileView.branchId,headers)
          .then((response) => {
            if (response.status == 200) {
              this.props.handleCompValueChange(false);
              this.setState({ loading: false, snackbar: true, notificationType: 'success', snackbarMessage: response.data.message, loaderMessage: 'Retrieving Data' })
            }
          })
          .catch((error) => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (error.response) {
              this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: error.response.data.message, loaderMessage: 'Retrieving Data' });
            }
          })
        }
      })
    }
  }

  render() {
    const props  = this.props.draweeBankBranchProfileView;
    console.log(props.productSubType,props.serviceType,this.state.TrasmissionType);
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <TabContainer>
        {
          this.state.loading ?
            <Loader action={this.state.loaderMessage} />
            :
            <MuiThemeProvider theme={getMuiTheme}>
              <div className={classes.root}>
                <h3>Drawee Bank Rules</h3>
                <div>
                  <div>
                    <Grid container justify="space-between" spacing={24}>
                      {/* <Grid item xs={6}>
                        <Selectable
                          id="DraweeSettlementCcyCode"
                          ref="Selectable"
                          label="Drawee Settlement Ccy Code"
                          searchable={true}
                          isCreatable={false}
                          isClearable={true}
                          value={this.state.DraweeSettlementCcyCode}
                          options={DraweeSettlementCcyCodeList}
                          noResultsText="No DraweeSettlementCcyCode Found"
                          searchBy={'any'}
                          placeholder={'Drawee Settlement Ccy Code'}
                          onChange={(e) => this.handleChange(e, 'DraweeSettlementCcyCode')}
                          onValueClick={(e) => this.handleValueClick(e, 'DraweeSettlementCcyCode')}
                          onBlur={this.handleBlur}
                          isEnabled={!this.state.isDraweeSettlementCcyCodeDisabled}
                        />
                        {this.state.DraweeSettlementCcyCodecheck ? <span className="errorMessage">{this.state.DraweeSettlementCcyCodeerrMsg} </span> : ''}
                      </Grid> */}
                        <Grid item xs={6} className='grid-no-top-padding'>
                          <Selectable
                            id="DraweeSettlementCcyCode"
                            ref="Selectable"
                            label="Drawee Settlement Ccy Code"
                            searchable={true}
                            isCreatable={false}
                            isClearable={true}
                            value={this.state.DraweeSettlementCcyCode}
                            options={this.state.DraweeSettlementCcyCodeList}
                            noResultsText="No Drawee Settlement Ccy Code Found"
                            searchBy={'any'}
                            placeholder={'Drawee Settlement Ccy Code'}
                            onChange={(e) => this.handleChange(e, 'DraweeSettlementCcyCode')}
                            onValueClick={(e) => this.handleValueClick(e, 'DraweeSettlementCcyCode')}
                            onBlur={this.handleBlur}
                            isEnabled={this.state.isDraweeSettlementCcyCodeDisabled}
                            />
                        {this.state.DraweeSettlementCcyCodecheck ? <span className="errorMessage">{this.state.DraweeSettlementCcyCodeerrMsg} </span> : ''}
                        </Grid>
                      <Grid item xs={6}>
                        <Selectable
                          id="TrasmissionType"
                          ref="Selectable"
                          label="Transmission Type"
                          searchable={true}
                          isClearable={true}
                          value={this.state.TrasmissionType}
                          options={TrasmissionTypeList} 
                          noResultsText="No Trasmission Type Found"
                          searchBy={'any'}
                          placeholder={'Trasmission Type'}
                          onChange={(e) => this.handleChange(e, 'TrasmissionType')}
                          onValueClick={(e) => this.handleValueClick(e, 'TrasmissionType')}
                          onBlur={this.handleBlur}
                        />
                        {this.state.TrasmissionTypecheck ? <span className="errorMessage">{this.state.TrasmissionTypeerrMsg} </span> : ''}
                      </Grid>
                      <Grid item xs={6} className="grid-error">
                          <Selectable
                          id="CustomerType"
                          ref="Selectable"
                          label="Customer Type *"
                          searchable={true}
                          isCreatable={false}
                          isClearable={true}
                          value={this.state.CustomerType}
                          options={CustomerTypeList}
                          noResultsText="No Customer Type Found"
                          searchBy={'any'}
                          placeholder={'Customer Type'}
                          onChange={(e) => this.handleChange(e, 'CustomerType')}
                          onValueClick={(e) => this.handleValueClick(e, 'CustomerType')}
                          onBlur={this.handleBlur}
                        />
                        {this.state.CustomerTypecheck ? <span className="errorMessage">{this.state.CustomerTypeerrMsg} </span> : ''}
                      </Grid>
                      <Grid item xs={6} className="grid-error">
                        <Selectable
                          id="BeneficiaryType"
                          ref="Selectable"
                          label="Beneficiary Type *"
                          searchable={true}
                          isCreatable={false}
                          isClearable={true}
                          value={this.state.BeneficiaryType}
                          options={BeneficiaryTypeList}
                          noResultsText="No Beneficiary Type Found"
                          searchBy={'any'}
                          placeholder={'Beneficiary Type'}
                          onChange={(e) => this.handleChange(e, 'BeneficiaryType')}
                          onValueClick={(e) => this.handleValueClick(e, 'BeneficiaryType')}
                          onBlur={this.handleBlur}
                        />
                        {this.state.BeneficiaryTypecheck ? <span className="errorMessage">{this.state.BeneficiaryTypeerrMsg} </span> : ''}
                      </Grid>
                    </Grid>
                    <Grid container justify="space-between" spacing={24}>
                      <Grid item xs={5}>

                        <div className="inline-alignment">
                          {/* <RegulerCheckbox type="bankcode" value={this.state.checkedBankcode} getChecked={this.handleCheckedChange} /> */}
                          <CheckBox id="bankcode" isChecked={this.state.checkedBankcode} isEnabled onChange={this.handleCheckedChange} />
                        </div><p className="inline-alignment">Beneficiary Bank Code</p>

                      </Grid>
                      <Grid item xs={5}>

                        <div className="inline-alignment">
                          {/* <RegulerCheckbox type="branchcode" value={this.state.checkedBranchcode} getChecked={this.handleCheckedChange} /> */}
                          <CheckBox id="branchcode" isChecked={this.state.checkedBranchcode} isEnabled onChange={this.handleCheckedChange} />
                        </div><p className="inline-alignment"> Beneficiary Bank Branch Code</p>

                      </Grid>
                      <Grid item xs={5}>
                        {/* <div className="inline-alignment">
                          <CheckBox id="balance" isChecked={this.state.checkedBalence} isEnabled onChange={this.handleCheckedChange} />
                        </div><p className="inline-alignment"> Vostro Balance Fetch</p> */}
                          <div className="inline-alignment">
                          {/* <RegulerCheckbox type="amount" value={this.state.checkedAmount} getChecked={this.handleCheckedChange} /> */}
                          <CheckBox id="amount" isChecked={this.state.checkedAmount} isEnabled onChange={this.handleCheckedChange} />
                        </div><p className="inline-alignment">Payout Amount Decimals allowed</p>

                      </Grid>
                      <Grid item xs={5}>
                        {/* <div className="inline-alignment">
                          <CheckBox id="amount" isChecked={this.state.checkedAmount} isEnabled onChange={this.handleCheckedChange} />
                        </div><p className="inline-alignment">Payout Amout Decimals allowed</p> */}

                      </Grid>
                      <Grid item xs={5}>
                        <p className="inline-alignment">Bank wise AML Verification : No </p>
                        <div className="inline-alignment">
                          {/* <Toggleswitch type="amlvarification" value={this.state.toggleAML} getToggleValue={this.handleToggleChange} /> */}
                          <Toggle isChecked={this.state.toggleAML} id={'amlvarification'} isEnabled={true} onChange={this.onChange} />
                        </div>
                        <p className="inline-alignment">Yes</p>
                        {
                          this.state.toggleAML ?
                            <div>
                              <div>
                                <div className="inline-alignment">
                                  {/* <RegulerCheckbox type='aml' value={this.state.checkedAML} getChecked={this.handleCheckedChange} /> */}
                                  <CheckBox id="aml" isChecked={this.state.checkedAML} isEnabled onChange={this.handleCheckedChange} />
                                </div>
                                <p className="inline-alignment">AML Supervisor</p>
                              </div>
                              <div className="inline-alignment">
                                {/* <RegulerCheckbox type='countrysupervisor' value={this.state.checkedCountrySupervisor} getChecked={this.handleCheckedChange} /> */}
                                <CheckBox id="countrysupervisor" isChecked={this.state.checkedCountrySupervisor} isEnabled onChange={this.handleCheckedChange} />
                              </div>
                              <p className="inline-alignment">Country Supervisor</p> </div> : null
                        }
                        {this.state.toggleAMLcheck ? <span className="errorMessage">{this.state.toggleAMLerrMsg} </span> : ''}

                      </Grid>
                    </Grid>
                    <span>
                      {this.state.showWarning}
                      {
                        <p className="error-msgs">{this.state.alertMessage}</p>
                      }
                    </span>
                  </div>
                </div>
                <hr />
                <h3>ACCOUNT NAME VALIDATION</h3>
                <Grid container style={{ paddingBottom: "20px" }} justify="space-between" spacing={24}>
                  <Grid item xs={5} className="grid-error">
                    {/* <RegulerTextfield value={this.state.AccountValidation} type='accountvalidation'
                     label={'No.of Words in Account Name'}
                      error={this.state.errorAccountValidation}
                      getEnterText={this.handleTextfieldChange} /> */}
            <Input id='accountvalidation' autocomplete='off' value={`${this.state.AccountValidation}`}  placeholder="Minimum no of words in Account Name"
             regex={/^[0-9\b]+$/} label="Minimum no of words in Account Name" type="numeric"
              onChange={(e, value) => this.handleTextFieldChange(e, value)} 
              onError={e => this.handleAccountNumberError(e)} />
                    {this.state.AccountValidationCheck ? <span className="errorMessage">{this.state.AccountValidationerrMsg} </span> : ''}
                  </Grid>
                </Grid>
                <div><hr /></div>
                <h3>BANK TRANSACTION PROCESS RULE</h3>
                <Grid container justify="space-between" spacing={24} style={{position:"relative"}}>
                  <Grid item xs={5} className="grid-error">
                    <Input id='minimumpayoutamount' autocomplete='off' value={`${this.state.MinimumPayoutAmount}`}
                    placeholder="Minimum Payout Amount"
                    regex={/^\d*(\.\d{0,3})?$/} label="Minimum Payout Amount" type="numeric"
                    onChange={(e, value) => this.handleTextFieldChange(e, value)} 
                    onError={e => this.handleMinimumPayoutError(e)} />
                    {this.state.MinimumPayoutAmountCheck ? <span className="errorMessage">{this.state.MinimumPayoutAmounterrMsg} </span> : ''}
                  </Grid>
                  <Grid item xs={5} className="grid-error">
                    <Input id='maximumpayoutamount' autocomplete='off' value={`${this.state.MaximumPayoutAmount}`}
                    placeholder="Maximum Payout Amount"
                    regex={/^\d*(\.\d{0,3})?$/} label="Maximum Payout Amount" type="numeric"
                    onChange={(e, value) => this.handleTextFieldChange(e, value)} 
                    onError={e => this.handleMaximumPayoutError(e)} />
                    {this.state.MaximumPayoutAmountCheck ? <span className="errorMessage">{this.state.MaximumPayoutAmounterrMsg} </span> : ''}
                  </Grid>
                    {this.state.MinMaxPayoutAmountCheck ? <span className="errorMessage-rules">{this.state.MinMaxPayoutAmounterrMsg} </span> : ''}
                  </Grid>
                <Grid container direction="row" justify="flex-end" alignItems="flex-end" spacing={24}>
                  <Grid item xs={2}>
                    <TextButton style={{ color: "#19ace3", fontSize: 18,fontFamily:"Gotham-Rounded" }} onClick={this.handleDraweeRuleSubmit} >SAVE</TextButton>
                  </Grid>
                </Grid>
              </div>
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
            </MuiThemeProvider>
        }
      </TabContainer>
    )
  }
}

DraweeBankGeneralRules.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DraweeBankGeneralRules);