import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import ModalBox from './../component/Modalbox';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import * as Exceptionhandler from './../ExceptionHandling';
import * as APISettlementService from './DraweeeBankBranchApiService';
import Snackbarcomp from './../component/snackbar';
import Loader from './../component/Loader';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme";
import { TextButton, Selectable, FloatButton,IconButton, Input, Toggle, Notifications } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import EmptyListComponent from '../component/EmptylistComponent';
import * as config from './../config/config';
import './../vendor/common.css';
import { isNull } from 'util';
import ErrorModalBox from '../component/ErrorModalbox';

function getModalStyle() {
    return {
      top: `50%`,
      left: `50%`,
      maxHeight: `75%`,
      width: `78%`,
      transform: `translate(-50%, -50%)`,
      borderRadius: `5px`,
      overflowY: 'auto'
    };
  }

// function getModalStyle() {
//   return {
//     top: `5%`,
//     left: `10%`,
//     minHeight: `50%`,
//     width: `78%`,
//     bottom: '5%',
//     right: '10%',
//     // transform: `translate(-50%, -50%)`,
//     borderRadius: `5px`,
//     overflowY: 'scroll'
//   };
// }

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
    marginTop: 15,
    marginRight: 2,
    // backgroundColor: "#000",
    boxShadow: `none`,
    width: 24,
    minHeight: 24
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
    //margin: theme.spacing.unit,
    fontSize: 18,
    fontFamily:"Gotham-Rounded"
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

const RegAccountValid = /^[a-zA-Z0-9]+$/;
const RegSwiftCodeValid = /^([A-Z0-9 _-]+)$/;

class CreateDraweeBankBranch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loaderMessage: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      status: true,
      saveDisabled: false,
      clearDisabled:false,
      confirmDelete: false,
      fromAction: '',
      snackbarMsg: '',
      snackbar: false,
      notificationType: 'success',
      shownogeneralrules: false,
      apiErrMsg: '',
      breadcrumps: [],
      displayName: '',
      displayNameList: [],
      displayNameData: {},
      displayNameCheck: false,
      displayNameErrMsg: '',
      displayNameDisabled: true,
      serviceProviderCode: '',
      serviceProviderCodeList: [],
      serviceProviderCodeData: {},
      serviceProviderCodeCheck: false,
      serviceProviderCodeErrMsg: '',
      serviceProviderCodeDisabled: true,
      productTypeDisabled: true,
      productsList: [],
      productType: '',
      productTypeData: {},
      productTypeCheck: false,
      productTypeerrMsg: '',
      subProductsResponse: [],
      subProductsList: [],
      subProductType: '',
      subProductTypeData: {},
      subProductTypeCheck: false,
      subProductTypeerrMsg: '',
      subProductTypeDisasbled: true,
      serviceTypeList: [],
      serviceType: '',
      serviceTypeData: {},
      serviceTypeCheck: false,
      serviceTypeerrMsg: '',
      serviceTypeDisabled: false,
      accountNumber: '',
      accountNumberList: [],
      accountNumberData: {},
      accountNumberCheck: false,
      accountNumberErrMsg: '',
      accountNumberDisabled: true,
      swiftCode: '',
      swiftCodeList: [],
      swiftCodeData: {},
      swiftCodeCheck: false,
      swiftCodeErrMsg: '',
      swiftcodeDisabled: true,
      currencyCode: '',
      currencyCodeList: [],
      currencyCodeData: {},
      currencyCodeCheck: false,
      currencyCodeErrMsg: '',
      currencyCodeDisabled: true,
      setSpecificRate: true,
      open: false,
      propsObj: {}
    }
  }

  componentDidMount() {
    console.log(this.props);
    if (this.props.hasOwnProperty('draweeBankView')) {
      this.setState({ propsObj: this.props }, () => {
        console.log(this.state.propsObj);
        let serviceProviderCode = this.state.propsObj.draweeBankView.serviceProviderCode;
        this.setState({ serviceProviderCode })
      });
    }
    this.fetchProductsList();
    // this.handleOpen(this.props.openval)
    this.handleClearEnable();
    this.handleSaveEnable();
    this.handleEscape();
  }

  handleEscape = () =>{
    document.onkeydown = (evt) => {
     evt = evt || window.event;
     let isEscape = false;
     if ("key" in evt) {
         isEscape = (evt.key === "Escape" || evt.key === "Esc");
     } else {
         isEscape = (evt.keyCode === 27);
     }
     if (isEscape) {
       this.handleCloseModal();
     }
   };
 }

  handleOpen = (open) => {
    this.setState({ open: open, loading: false });
  }

  fetchProductsList = () => {
    let productsList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      APISettlementService.getProductTypes(headers).then((response) => {
        if (response.status == 200) {
          if (response.data.response.length > 0) {
            response.data.response.map((obj, index) => {
              let product = {};
              product.id = index;
              product.label = obj.product;
              product.value = obj.product;
              if (obj.product == 'Remittance') {
                let subProductsList = [];
                this.setState({ productType: obj.product, productTypeData: obj, productTypeDisabled: false, subProductsResponse: obj.subProducts }, () => {
                  if (obj.subProducts.length > 0) {
                    obj.subProducts.map((obj, index) => {
                      let subProductType = {};
                      subProductType.id = index;
                      subProductType.label = obj.subProduct;
                      subProductType.value = obj.subProduct;
                      subProductsList.push(subProductType);
                    })
                    this.setState({ subProductsList, subProductTypeDisasbled: true })
                  }
                  else {
                    this.setState({ subProductsList, subProductTypeDisasbled: false })
                  }
                })
              }
              productsList.push(product);
            })
            this.setState({ productsList }, () => {
              this.fetchCurrencyCodesList();
            });
          }
          else {
            this.setState({ productTypeDisabled: false }, () => {
              this.fetchCurrencyCodesList();
            });
          }
        }
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL)
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, serverStatus: Exceptionhandler.throwErrorType(error).status, apiErrMsg: Exceptionhandler.throwErrorType(error).message })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
      });
    }
  }


  fetchCurrencyCodesList = () => {
    let currencyCodeList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL)
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      DraweeeBankBranchApiService.getCurrency(headers)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            if (response.data.length > 0) {
              response.data.map((obj) => {
                let currencycode = {};
                currencycode.id = obj.id;
                currencycode.value = obj.code;
                currencycode.label = obj.code + ' - ' + obj.currencyName;
                currencyCodeList.push(currencycode);
              })
              this.setState({ currencyCodeList, loaderMessage: '' }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();
                this.handleOpen(this.props.openval)
              });
            }
            else {
              this.setState({ loaderMessage: '', snackbar: true, notificationType: 'warning', snackbarMsg: 'No Currency Codes Found.' }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();
                this.handleOpen(this.props.openval)
              });
            }
          }
        }).catch(error => {
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL)
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
            this.setState({ loading: false, serverError: false, shownogeneralrules: true, serverStatus: Exceptionhandler.throwErrorType(error).status, apiErrMsg: Exceptionhandler.throwErrorType(error).message })
          }
          else {
            this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
          }
        });
      }
  }

  handleSaveEnable = () => {
    let displayNameLength = this.state.displayName == undefined || this.state.displayName == isNull ? 0 : this.state.displayName.replace(/\s/g, '').length;
    if ((displayNameLength == 0) || (Object.keys(this.state.subProductTypeData).length == 0) || (Object.keys(this.state.currencyCodeData).length == 0)) {
      this.setState({
        saveDisabled: false
      })
    }
    else if(this.state.displayNameCheck || this.state.subProductTypeCheck || this.state.serviceTypeCheck || this.state.accountNumberCheck || this.state.swiftCodeCheck || this.state.currencyCodeCheck){
      this.setState({
        saveDisabled: false
      })
    }
    else if (this.state.subProductType == 'Cash payout' || this.state.subProductType == 'Account Credit') {
      if (this.state.serviceType == undefined || Object.keys(this.state.serviceTypeData).length == 0) {
        this.setState({
          saveDisabled: false
        })
      }
      else {
        this.setState({ saveDisabled: true })
      }
    }
    else {
      this.setState({
        loading: false,
        saveDisabled: true
      })
    }
  }

  handleBlur = (e) => {
    // console.log(e.target.id);
    switch (e.target.id) {
      case 'subProductType':
        this.setState({ subProductTypeCheck: false }, () => {
          if (this.state.subProductType == undefined) {
            this.setState({ subProductTypeCheck: true, subProductTypeerrMsg: 'Sub Product Type Can not be Empty', subProductTypeData: {}, serviceTypeList: [], serviceType: undefined, serviceTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
          else if (this.state.subProductType.length == 0) {
            this.setState({ subProductTypeCheck: true, subProductTypeerrMsg: 'Sub Product Type Can not be Empty', subProductTypeData: {}, serviceTypeList: [], serviceType: undefined, serviceTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        })
        break;
      case 'serviceType':
        console.log('asdf', this.state.serviceType);
        this.setState({ serviceTypeCheck: false }, () => {
          if (this.state.serviceType == undefined) {
            this.setState({ serviceTypeCheck: true, serviceTypeerrMsg: 'service type Can not be Empty', serviceTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
          if (Object.keys(this.state.serviceTypeData).length == 0) {
            this.setState({ serviceTypeCheck: true, serviceTypeerrMsg: 'service type Can not be Empty', serviceTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
          else {
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        })
        break;
    }
  }

  handleSubProductTypeChange = (e) => {
    this.setState({ subProductType: e, subProductTypeCheck: false }, () => {
      if (this.state.subProductType == undefined) {
        this.setState({ subProductTypeCheck: true, subProductTypeerrMsg: 'Sub Product Type Can not be Empty', subProductTypeData: {}, serviceTypeList: [], serviceType: undefined, serviceTypeData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();

        });
      }
      else if (this.state.subProductType.length == 0) {
        this.setState({ subProductTypeCheck: true, subProductTypeerrMsg: 'Sub Product Type Can not be Empty', subProductTypeData: {}, serviceTypeList: [], serviceType: undefined, serviceTypeData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();

        });
      }
      else if(this.state.subProductType.length > 0){
        this.state.subProductsList.map((obj)=>{
          if(this.state.subProductType == obj.value){
            this.setState({subProductType:obj.value,subProductTypeData:obj},()=>{
              let count = 0;
              this.state.subProductsResponse.map((obj, index) => {
                //TODO after getting id in service types, change index to obj.id in if loop
                if (this.state.subProductTypeData.id == index) {
                  if (obj.hasOwnProperty('serviceTypes')) {
                    if (obj.serviceTypes.length > 0) {
                      count = count + 1;
                      let serviceTypeList = [];
                      obj.serviceTypes.map((obj, index) => {
                        let serviceType = {};
                        serviceType.id = index;
                        serviceType.label = obj;
                        serviceType.value = obj;
                        serviceTypeList.push(serviceType);
                      })
                      this.setState({ serviceTypeList: serviceTypeList, serviceTypeDisabled: true }, () => {
                        // console.log(this.state.serviceTypeList);
                        this.handleSaveEnable();
                        this.handleClearEnable();

                      })
                    }
                  }
                }
              })
              if (count == 0) {
                this.setState({ snackbar: true, notificationType: 'warning', snackbarMsg: 'No service types found', serviceTypeDisabled: false, serviceTypeList: [] })
              }
            })
          }
        })
      }
      else {
        this.handleSaveEnable();
        this.handleClearEnable();
      }
    });
  }

  handleSubProductTypeValueClick = (e) => {
    let value = e.value;
    this.setState({ subProductTypeData: e, subProductType: value, snackbar: false, serviceTypeList: [] }, () => {
      let count = 0;
      this.state.subProductsResponse.map((obj, index) => {
        //TODO after getting id in service types, change index to obj.id in if loop
        if (this.state.subProductTypeData.id == index) {
          if (obj.hasOwnProperty('serviceTypes')) {
            if (obj.serviceTypes.length > 0) {
              count = count + 1;
              let serviceTypeList = [];
              obj.serviceTypes.map((obj, index) => {
                let serviceType = {};
                serviceType.id = index;
                serviceType.label = obj;
                serviceType.value = obj;
                serviceTypeList.push(serviceType);
              })
              this.setState({ serviceTypeList: serviceTypeList, serviceTypeDisabled: true }, () => {
                // console.log(this.state.serviceTypeList);
                this.handleSaveEnable();
                this.handleClearEnable();
              })
            }
          }
        }
      })
      if (count == 0) {
        this.setState({ snackbar: true, notificationType: 'warning', snackbarMsg: 'No service types found', serviceTypeDisabled: false, serviceTypeList: [] })
      }
    })
  }

  handleServiceTypeChange = (e) => {
    console.log(e);
    this.setState({ serviceType: e, serviceTypeCheck: false }, () => {
      if (this.state.serviceType == undefined) {
        this.setState({ serviceTypeCheck: true, serviceTypeerrMsg: 'Service type Can not be Empty', serviceTypeData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        });
      }
      else if(this.state.serviceType.length > 0){
        console.log(this.state.serviceTypeList);
       this.state.serviceTypeList.map((obj)=>{
         if(this.state.serviceType == obj.value){
          this.setState({serviceType:obj.value,serviceTypeData:obj,serviceTypeCheck:false},()=>{
            this.handleSaveEnable();
            this.handleClearEnable();

          })
         }
       }) 
      }
      else if (Object.keys(this.state.serviceTypeData).length == 0) {
        this.setState({ serviceTypeCheck: true, serviceTypeerrMsg: 'Service type Can not be Empty', serviceTypeData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        });
      }
      else {
        this.handleSaveEnable();
        this.handleClearEnable();
      }
    });
  }

  handleServiceTypeValueClick = (e) => {
    let value = e.value;
    this.setState({ serviceTypeData: e, serviceType: value }, () => {
      this.handleSaveEnable();
      this.handleClearEnable();
    })
  }
  
  handleClear = () => {
    this.setState({ confirmDelete: false, snackbar: false }, () => {
      let displayNameLen = (this.state.displayName == undefined ) ? 0 : this.state.displayName.length;
      let accountNumberLen = (this.state.accountNumber == undefined) ? 0 : this.state.accountNumber.length;
      let swiftCodeLen = (this.state.swiftCode == undefined) ? 0 : this.state.swiftCode.length;
      if (displayNameLen > 0 ||
        Object.keys(this.state.subProductTypeData).length > 0 || Object.keys(this.state.serviceTypeData).length > 0 ||
        Object.keys(this.state.currencyCodeData).length > 0 ||  accountNumberLen > 0 || swiftCodeLen > 0) {
        this.setState({ confirmDelete: true, fromAction: 'clear', modalMessage: 'This will clear all data. Are you sure you want to continue?' }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        });
      }
    })
  }

  handleClearEnable = () => {
    let displayNameLength = this.state.displayName == undefined || this.state.displayName == isNull ? 0 : this.state.displayName.length;
    let accountNumberLength = this.state.accountNumber == undefined || this.state.accountNumber == isNull ? 0 : this.state.accountNumber.length;
    let swiftCodeLength = this.state.swiftCode == undefined || this.state.swiftCode == isNull ? 0 : this.state.swiftCode.length;
    if ((displayNameLength > 0) || (Object.keys(this.state.subProductTypeData).length > 0)
     || (Object.keys(this.state.currencyCodeData).length > 0)
    || (Object.keys(this.state.serviceTypeData).length > 0) || (accountNumberLength > 0 || (swiftCodeLength > 0)
     )) {
      this.setState({
        clearDisabled: true
      })
    }
    else {
      this.setState({
        clearDisabled: false
      })
    }
  }

  handleClose = () => {
    this.setState({ actionType: 'Yes', confirmDelete: false, modalMessage: '' }, () => {
      let displayNameLen = (this.state.displayName == undefined || this.state.displayName == isNull || this.state.displayName == '') ? 0 : this.state.displayName.length;
      let accountNumberLen = (this.state.accountNumber == undefined || this.state.accountNumber == isNull || this.state.accountNumber == '') ? 0 : this.state.accountNumber.length;
      let swiftCodeLen = (this.state.swiftCode == undefined || this.state.swiftCode == isNull || this.state.swiftCode == '') ? 0 : this.state.swiftCode.length;
      if ((displayNameLen > 0)
        || (Object.keys(this.state.subProductTypeData).length) || (Object.keys(this.state.currencyCodeData).length)
        || (accountNumberLen > 0) || (swiftCodeLen > 0)) {
        this.setState({ confirmDelete: true, fromAction: 'close', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
      }
      else {
        this.setState({ confirmDelete: false }, () => {
          this.props.modalAction(null, 'close');
        })
      }
    })
  };

  handleModalResponse = (data, from) => {
    if (data == true && from == 'close') {
      this.setState({ confirmDelete: true }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
        this.props.modalAction(null, 'close');
      })
    }
    else if (data == true && from == 'clear') {
      this.setState({
        confirmDelete: false,
        displayName: isNull,
        displayNameData: {},
        displayNameCheck: false,
        displayNameErrMsg: '',
        subProductType: undefined,
        subProductTypeData: {},
        subProductTypeCheck: false,
        subProductTypeErrMsg: '',
        serviceType: undefined,
        serviceTypeList: [],
        serviceTypeData: {},
        serviceTypeCheck: false,
        serviceTypeErrMsg: '',
        serviceTypeDisabled: false,
        accountNumber: isNull,
        accountNumberData: {},
        accountNumberCheck: false,
        accountNumberErrMsg: '',
        swiftCode: isNull,
        swiftCodeData: {},
        swiftCodeCheck: false,
        swiftCodeErrMsg: '',
        currencyCode: undefined,
        currencyCodeData: {},
        currencyCodeCheck: false,
        currencyCodeErrMsg: '',
        status: true,
        snackbar: false,
        saveDisabled: false,
        clearDisabled:false,
        fromAction: '',
        shownogeneralrules: false,
        apiErrMsg: '',
      }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
        console.log(this.state)
      });
    }
    else {
      this.setState({ confirmDelete: true }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
      });
    }
  }

  handleStatusResponse = (data) => {
    if (data == true) {
      this.setState({ shownogeneralrules: false }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
      });
    }
  }

  handleChange = (e, value) => {
    // this.setState({ dataFieldsError: false });
    switch (e.target.id) {
      case ('displayname'):
        this.setState({ displayName: value, displayNameCheck: false }, () => {
          if (this.state.displayName.length === 0) {
            this.setState({
              displayNameCheck: true,
              displayNameErrMsg: 'Display name Can not be Empty.'
            }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else{
            this.handleSaveEnable();
            this.handleClearEnable();
          }
        });
        break;
      case ('accountnumber'):
        this.setState({ accountNumber: value, accountNumberCheck: false }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        });
        break;
      case ('swiftcode'):
        this.setState({ swiftCode: value, swiftCodeCheck: false }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        });
        //    () => {
        //   if ((this.state.swiftCode.length > 11) || (this.state.swiftCode.length < 8)) {
        //     this.setState({
        //       swiftCodeCheck: true,
        //       swiftCodeErrMsg: 'BIC Code Should be 8 to 11 characters'
        //     }, () => {
        //       this.handleSaveEnable();
        //     })
        //   }
        //   else {
        //     this.setState({
        //       swiftCodeCheck: false,
        //       swiftCodeErrMsg: ''
        //     }, () => {
        //       this.handleSaveEnable();
        //     })
        //   }
        // });
        break;
      case ('status'):
        this.setState({ status: e.target.checked }, () => {
          console.log(this.state.status);
        });
        break;
    }
  };

  handleDisplayNameError = (e) => {
    switch (e) {
      case 'regex':
        this.setState({ displayNameCheck: true, displayNameErrMsg: 'Only alphanumeric values with # are allowed' }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();

        })
        break;
      case 'required':
        this.setState({
          displayNameCheck: true,
          displayNameErrMsg: 'Display Name Can not be Empty'
        }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        })
        break;
      case 'minLength':
        this.setState({
          displayNameCheck: true,
          displayNameErrMsg: 'Display Name should between 7 & 12 chars'
        }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
         })
        break;
        case 'maxLength':
        this.setState({
          displayNameCheck: true,
          displayNameErrMsg: 'Display Name should between 7 & 12 chars'
        }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
         })
        break;
    }
  }

  handleAccountNumberError = (e) => {
    switch (e) {
      case 'regex':
        this.setState({ accountNumberCheck: true, accountNumberErrMsg: 'Only Alphanumeric Allowed.' }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
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

  handleSwiftCodeError = (e) => {
    let bicCodeLen = (this.state.swiftCode == undefined) ? 0 : this.state.swiftCode.length;
    if(bicCodeLen > 0){
      switch (e) {
        case 'regex':
          this.setState({ swiftCodeCheck: true, 
            swiftCodeErrMsg: 'Please Enter 8-11 Uppercase with Alphanumeric characters' }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();

          })
          break;
          case 'minLength':
          this.setState({
            swiftCodeCheck: true,
            swiftCodeErrMsg: 'Please Enter 8-11 Uppercase with Alphanumeric characters'
          }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
          break;
          case 'maxLength':
          this.setState({
            swiftCodeCheck: true,
            swiftCodeErrMsg: 'Please Enter 8-11 Uppercase with Alphanumeric characters'
          }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
          break;
        // case 'required':
        //   this.setState({
        //     swiftCodeCheck: true,
        //     swiftCodeErrMsg: 'BIC Code cannot be Empty.'
        //   }, () => {
        //     this.handleSaveEnable();
        //   })
        //   break;
      }
    }
  }

  handleTextfieldChange = (e, value) => {
    let pattern = /^[0-9]+$/i;
    console.log(e.target.id, value);
    switch (e.target.id) {
      case 'setSpecificRate':
        this.setState({ setSpecificRate: value });
        break;
      case 'status':
      this.setState({ status: e.target.checked }, () => {
        this.setState({snackbar:false},()=>{
          if(this.state.status == false){
            this.setState({snackbar:true,snackbarMsg:'This bank will be disabled',notificationType:'warning'})
          }
        })
      });    
    break;
    }
  }

  handleCurrencyCodeChange = (e, id) => {
    // let index = index;
    console.log(e, id);
    this.setState({ currencyCode: e, currencyCodeCheck: false }, () => {
      if (this.state.currencyCode == undefined) {
        this.setState({ currencyCodeCheck: true, currencyCodeErrMsg: "Currency Code Can not be Empty", currencyCodeData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        });
      } else if (this.state.currencyCode.length == 0) {
        this.setState({ currencyCodeCheck: true, currencyCodeErrMsg: "Currency Code Can not be Empty", currencyCodeData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        });
      }
      else if(this.state.currencyCode.length > 0){
        this.state.currencyCodeList.map((obj)=>{
          if(this.state.currencyCode == obj.value){
            this.setState({currencyCode:obj.value,currencyCodeData:obj},()=>{
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
        })
      } 
      else {
        this.setState({ currencyCodeCheck: false, currencyCodeErrMsg: "" })
        this.handleSaveEnable();
        this.handleClearEnable();
      }
    })
  }

  handleCurrencyCodeValueClick = (e, id) => {
    console.log(e, id);
    let value = e.value
    this.setState({ currencyCodeData: e, currencyCode: value }, () => {
      // this.fetchAgentBranches(this.state.currencyCodeData.value)
      this.handleSaveEnable();
      this.handleClearEnable();
    })
  }

  handleCurrencyCodeBlur = (e, id) => {
    console.log(e, id);
    if (this.state.currencyCode == undefined || Object.keys(this.state.currencyCodeData).length == 0) {
      this.setState({ currencyCodeCheck: true, currencyCodeErrMsg: "Currency Code Can not be Empty", currencyCodeData: {} }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
      });
    } else if (this.state.currencyCode.length == 0) {
      this.setState({ currencyCodeCheck: true, currencyCodeErrMsg: "Currency Code Can not be Empty", currencyCodeData: {} }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
      });
    }
    else {
      this.setState({ currencyCodeCheck: false, currencyCodeErrMsg: "" })
      this.handleSaveEnable();
      this.handleClearEnable();
    }
  }

  handleData = () => {
    var data = {};
    data.currencyCode = this.state.currencyCodeData.value;
    if (this.state.accountNumber != undefined || this.state.accountNumber.length > 0) {
      data.accountNumber = this.state.accountNumber;
    }
    if (this.state.swiftCode != undefined || this.state.swiftCode.length > 0) {
      data.swiftCode = this.state.swiftCode;
    }
    data.displayName = this.state.displayName;
    data.productSubType = this.state.subProductTypeData.value;
    data.uaexBankWiseExchangeMarkUpCcy = this.state.setSpecificRate;
    if (this.state.subProductTypeData.value == 'Cash payout' || this.state.subProductTypeData.value == 'Account Credit') {
      data.serviceType = this.state.serviceTypeData.value;
    }
    data.status = this.state.status ? 'ENABLED' : 'DISABLED';
    this.props.modalAction(data, 'save');
  }

  handleCloseModal = () => {
    this.handleClose(null, 'close');
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
       {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={()=>this.handleCloseModal()}
          >
            {
              this.state.loading ?
                <Loader action={this.state.loaderMsg} />
                :
                <div className="modal-card-y-scroll">
                  <div style={getModalStyle()} className={classes.paper}>
                    <div className="modal-card-header">
                      <div className="modal-card-header-content">
                        <Grid container spacing={12}>
                          <Grid item xs={6}>
                            <h3 className="screenTitle">Create</h3>
                          </Grid>

                          <Grid item xs={6}>
                            <Grid direction="column" alignItems="flex-end" container spacing={12}>
                              {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} /> */}
                              <IconButton style={{ height: 36, width: 36 }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} />

                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <Grid item xs={12}>
                      <h3 className="global-font title-margin">Drawee Bank Profile Details</h3>
                    </Grid>
                    <Grid container direction="row" spacing={24}>
                      <Grid item xs={6} className="grid-error">
                        <Input id='displayname' autocomplete='off' value={this.state.displayName} placeholder="Display Name" regex={/^[a-zA-Z0-9#]+$/i} minLength={7} maxLength={12} label="Display Name *" type="freeText" isRequired onChange={(e, value) => this.handleChange(e, value)} onError={e => this.handleDisplayNameError(e)} />
                        {this.state.displayNameCheck ? <span className="errorMessage">{this.state.displayNameErrMsg}</span> : null}
                      </Grid>
                      <Grid item xs={6}>
                        <Input id='serviceprovidercode' isEnabled={false} value={this.state.serviceProviderCode} placeholder="ServiceProviderCode" label="Service Provider Code" type="freeText" />
                      </Grid>
                      <Grid item xs={6} className="grid-error">
                        <Selectable
                          id="subProductType"
                          isRequired
                          label={'Sub Product Type *'}
                          searchable={true}
                          value={this.state.subProductType}
                          options={this.state.subProductsList}
                          noResultsText="No Sub Product Types Found"
                          searchBy={'any'}
                          placeholder={'Sub Product Type'}
                          onChange={this.handleSubProductTypeChange}
                          onValueClick={this.handleSubProductTypeValueClick}
                          onBlur={this.handleBlur}
                          isEnabled={this.state.subProductTypeDisasbled}
                        />
                        {this.state.subProductTypeCheck ? <span className="errorMessage">{this.state.subProductTypeerrMsg} </span> : ''}
                      </Grid>
                      <Grid className="grid-margin-bottom" item xs={6} className="grid-error">
                        {
                          this.state.serviceTypeList.length > 0 ?
                            <div>
                              <Selectable
                                id="serviceType"
                                isRequired
                                searchable={true}
                                label={'Service Type *'}
                                value={this.state.serviceType}
                                options={this.state.serviceTypeList}
                                noResultsText="No Service Types Found"
                                searchBy={'label'}
                                placeholder={'Service Type'}
                                onChange={this.handleServiceTypeChange}
                                onValueClick={this.handleServiceTypeValueClick}
                                onBlur={this.handleBlur}
                                isEnabled={this.state.serviceTypeList.length > 0 ? true : false}
                              />
                              {this.state.serviceTypeCheck ? <span className="errorMessage">{this.state.serviceTypeerrMsg} </span> : ''}
                            </div> : null
                        }
                      </Grid>
                      <Grid item xs={6} className="grid-error">
                        <Input id='accountnumber' autocomplete='off' value={this.state.accountNumber}  regex={/^[a-zA-Z0-9]+$/} label="Account Number" type="freeText" onChange={(e, value) => this.handleChange(e, value)} onError={e => this.handleAccountNumberError(e)} />

                        {this.state.accountNumberCheck ? <span className='errorMessage'>{this.state.accountNumberErrMsg} </span> : ''}
                      </Grid>
                      <Grid item xs={6} className="grid-error">
                        <Input id='swiftcode' autocomplete='off' value={this.state.swiftCode} regex={/^([A-Z0-9 _-]+)$/} minLength={8} maxLength={11} placeholder="BIC Code" label="BIC Code" type="freeText" onChange={(e, value) => this.handleChange(e, value)} onError={e => this.handleSwiftCodeError(e)} />
                        {this.state.swiftCodeCheck ? <span className='errorMessage'>{this.state.swiftCodeErrMsg} </span> : ''}
                      </Grid>
                      <Grid className="grid-margin-bottom" item xs={6} className="grid-error">
                        <Selectable
                          id="country"
                          isRequired
                          searchable={true}
                          isClearable={true}
                          label={"Currency Code *"}
                          value={this.state.currencyCode}
                          options={this.state.currencyCodeList}
                          noResultsText="Country Name Not Found"
                          searchBy={'any'}
                          placeholder="Currency Code"
                          onChange={(e) => this.handleCurrencyCodeChange(e, 'currencycode')}
                          onValueClick={(e) => this.handleCurrencyCodeValueClick(e, 'currencycode')}
                          onBlur={(e) => this.handleCurrencyCodeBlur(e, 'currencycode')}
                          ref={this.child}
                        />
                        {this.state.currencyCodeCheck ? <span className="errorMessage">{this.state.currencyCodeErrMsg}</span> : ''}
                      </Grid>
                    </Grid>
                    <Grid className="global-font" item={24}>
                      <Grid item xs={12} style={{paddingTop:"10px"}}>
                        <h3 className="global-font">Uaex Bank wise Exchange Ccy Markup</h3>
                      </Grid>
                    </Grid>
                    <Grid className="global-font" item={24}>
                      <p className="toggle-alignment"><b>Set specific rate for pricing: :</b> No </p>
                      <div className="toggle-alignment">
                        <Toggle isChecked={this.state.setSpecificRate} id="setSpecificRate" isEnabled={true} onChange={this.handleTextfieldChange} />
                      </div>
                      <p className="toggle-alignment">Yes</p>
                    </Grid>

                    <Grid className="global-font" item={24}>
                      <p className="toggle-alignment"><b>Status :</b> Disable </p>
                      <div className="toggle-alignment">
                        <Toggle isChecked={this.state.status} id="status" isEnabled={true} onChange={this.handleTextfieldChange} />
                      </div>
                      <p className="toggle-alignment">Enable</p>
                    </Grid>
                    <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                      <Grid item xs={4}>
                        <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                          <TextButton className={classes.button} isEnabled={this.state.clearDisabled} umStyle="default" onClick={this.handleClear} >Clear</TextButton>
                          <TextButton className={classes.button} isEnabled={this.state.saveDisabled} 
                            style={
                              {
                                color: this.state.saveDisabled ? null : '#19ace3'
                              }}
                              onClick={this.handleData} >
                              Save
                          </TextButton>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* <DraweeBankProductCreateModalPopup /> */}
                  </div>
                  {
                    this.state.snackbar ?
                      <Notifications
                        id="notificationBar"
                        umStyle={this.state.notificationType}
                        placement="bottom-right"
                        children={this.state.snackbarMsg}
                        delayShow={SHOW_NOTIFICATION}
                        delayHide={HIDE_NOTIFICATION}
                        style={{ width: 'auto' }}
                      /> : null
                  }
                </div>
            }

          </Modal>
          {
            this.state.confirmDelete ? <ModalBox isOpen={this.state.confirmDelete} fromAction={this.state.fromAction} actionType="Yes" message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
          }
          {
            this.state.shownogeneralrules ? <ErrorModalBox isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleStatusResponse} /> : null
          }
        </div>
      }
      </MuiThemeProvider>
    );
  }
}

CreateDraweeBankBranch.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DraweeBankProductCreateModalPopup = withStyles(styles)(CreateDraweeBankBranch);

export default DraweeBankProductCreateModalPopup;
