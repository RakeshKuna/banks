import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import { Toggle, Selectable, FloatButton, TextButton } from 'finablr-ui';
import ModalBox from './../component/Modalbox';
import getMuiTheme from "../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as ApiService from './ApiService';
import * as Exceptionhandler from '../ExceptionHandling';
import { Notifications,IconButton } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from './../config/config';
import './../vendor/common.css';

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
//     top: `10%`,
//     left: `10%`,
//     // minHeight: `50%`,
//     width: `78%`,
//     bottom: '10%',
//     right: '10%',
//     borderRadius: `5px`,
//     overflowY: 'auto'
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
    // margin: theme.spacing.unit,
    fontSize: 18,
    fontFamily:"Gotham-Rounded",
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

class DraweeBankCreateModal extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      open: false,
      country: '',
      bank: '',
      serviceProvider: '',
      bankData: {},
      countryData: {},
      bankList: [],
      bankListLen: null,
      totalRecords: null,
      countryCheck: false,
      banknameCheck: false,
      serviceproviderCheck: false,
      countryerrMsg: '',
      bankerrMsg: '',
      fromAction: '',
      serviceProvidererrMsg: '',
      serviceProviderDisabled: true,
      status: true,
      dataFieldsError: false,
      serviceProviderList: [],
      countryList: [],
      confirmDelete: false,
      modalMessage: '',
      saveDisabled: false,
      clearDisabled:false,
      serviceProviderData: {},
      snackbar:false,
      snackbarMessage:'',
      notificationType:''
    }
   
  }

  componentDidMount() {
    console.log('modal open');
    if (this.props.isOpen) {
      this.fetchCountryList();
      this.handleSaveEnable();
      this.handleClearEnable();
      this.handleEscape();
    }
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

  fetchServiceProviderList = () => {
    let serviceProviderList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiService.fetchServiceProviderList(headers).then((response) => {
        if (response.data.length > 0) {
          response.data.map((obj) => {
            let serviceProvider = {};
            serviceProvider.id = obj.id;
            serviceProvider.value = obj.code;
            serviceProvider.label = obj.serviceProvider;
            serviceProviderList.push(serviceProvider);
          })
          this.setState({ serviceProviderList, serviceProviderDisabled: true }, () => {
            this.handleOpen();
          });
        }
        else {
          // alert('no service provider records');
          this.setState({snackbar:false,serviceProviderDisabled: false},()=>{
            this.setState({snackbar:true, snackbarMessage: 'No Service Provider Records found', notificationType:'warning'})
          })
        }
      }).catch(error => {
        if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({snackbar:false}, () => {
            this.setState({ loading: false, serverError: true, snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
        // alert(error, 'oops error in api call');
        // throw (error)
      });
    }
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
      ApiService.fetchCountryList(headers).then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          response.data.map((obj) => {
            let country = {};
            country.id = obj.id;
            country.label = obj.name + ' - ' + obj.countryCode;
            country.value = obj.countryCode;
            country.name = obj.name;
            countryList.push(country);
          })
          this.setState({ countryList }, () => {
            this.fetchServiceProviderList();
          });
        }
        else {
          // alert('no country records');
          this.setState({snackbar:false},()=>{
            this.setState({snackbar:true, snackbarMessage: 'No Country Records found', notificationType:'warning'})
          })
        }
      }).catch(error => {
        if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({snackbar:false}, () => {
            this.setState({ loading: false, serverError: true, snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
        // alert(error, 'oops error in api call');
        // throw (error)
      });
    }
  }

  fetchBankList = (countryCode) => {
    var banksList = [];
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
      ApiService.fetchBanks(params,headers).then((response) => {
        console.log(response);
        if (response.data.data.length > 0) {
          response.data.data.map((obj) => {
            var bankObj = {};
            bankObj.id = obj.bankId;
            bankObj.label = obj.bankCode + ' - ' + obj.bankName;
            bankObj.value = obj.bankCode;
            banksList.push(bankObj);
          })
          this.setState({ bankList: banksList }, () => {
      
          });
        }
        else {
          // alert('no bank records');
          this.setState({snackbar:false},()=>{
            this.setState({snackbar:true, snackbarMessage: 'No Banks available for the selected country! Please choose a different country to create a Drawee Bank.', notificationType:'error'})
          })
        }
      }).catch(error => {
        if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({snackbar:false}, () => {
            this.setState({ loading: false, serverError: true, snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
        // alert(error, 'oops error in api call');
        // throw (error)
      });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClear = () => {
    this.setState({ confirmDelete: false, snackbar: false }, () => {
      let countryLength = (this.state.country != undefined) ? this.state.country.length : 0;
      let bankLength = (this.state.bank != undefined) ? this.state.bank.length : 0;
      let serviceProviderLength = (this.state.serviceProvider != undefined) ? this.state.serviceProvider.length : 0;
      // let data = ((this.state.country != undefined) || (this.state.bank != undefined) || (this.state.serviceProvider != undefined)) ? true : false;
      if ((countryLength > 0) || (bankLength > 0) || (serviceProviderLength > 0)) {
        this.setState({ confirmDelete: true, fromAction: 'clear', modalMessage: 'This will clear all data. Are you sure you want to continue?' })
      }
    })
  }

  handleClearEnable = () => {
    if (Object.keys(this.state.countryData).length > 0 || Object.keys(this.state.bankData).length > 0 || Object.keys(this.state.serviceProviderData).length > 0) {
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
      if ( Object.keys(this.state.bankData).length > 0 || Object.keys(this.state.countryData).length > 0 || Object.keys(this.state.serviceProviderData).length > 0) {
        this.setState({ confirmDelete: true, fromAction: 'close', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
      }
      else {
        this.setState({ confirmDelete: false }, () => {
          this.props.modalAction(null, 'close');
        })
      }
    })
  };

  handleBlur = (e) => {
    switch (e.target.id) {
      case 'country':
        this.setState({ countryCheck: false }, () => {
          if (this.state.country == undefined) {
            this.setState({ countryCheck: true, countryerrMsg: 'Select valid country', countryData: {}, bankList:[], bank:undefined, bankData:{} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.country.length == 0) {
            this.setState({ countryCheck: true, countryerrMsg: 'Select valid country', countryData: {}, bankList:[], bank:undefined, bankData:{} }, () => {
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
      case 'serviceProvider':
        this.setState({ serviceProviderCheck: false }, () => {
          if (this.state.serviceProvider == undefined) {
            this.setState({ serviceProviderCheck: true, serviceProvidererrMsg: 'Service Provider can not be empty', serviceProviderData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.serviceProvider.length == 0) {
            this.setState({ serviceProviderCheck: true, serviceProvidererrMsg: 'Service Provider can not be empty', serviceProviderData: {} }, () => {
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
      case 'bank':
        this.setState({ banknameCheck: false }, () => {
          if (this.state.bank == undefined) {
            this.setState({ banknameCheck: true, bankerrMsg: 'Bank name can not be empty', bankData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.bank.length == 0) {
            this.setState({ banknameCheck: true, bankerrMsg: 'Bank name can not be empty', bankData: {} }, () => {
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

  handleModalResponse = (data, from) => {
    if (data == true && from == 'close') {
      this.setState({ confirmDelete: true }, () => {
        this.props.modalAction(null, 'close');
      })
    }
    else if (data == true && from == 'clear') {
      this.setState({
        confirmDelete: false,
        country: undefined,
        countryData: {},
        serviceProvider: undefined,
        serviceProviderData:{},
        bankList:[],
        bank: undefined,
        bankData: {},
        countryCheck: false,
        banknameCheck: false,
        saveDisabled: true,
        clearDisabled:false,
        status: true,
        snackbar: false,
        serviceproviderCheck: false,
      }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
      })
    }
    else {
      this.setState({ confirmDelete: true }, () => {
      });
    }
  }

  handleData = () => {
    if ((this.state.country == undefined) || (this.state.country.length == 0) || (this.state.bank == undefined) || (this.state.bank.length == 0) || (this.state.serviceProvider == undefined) || (this.state.serviceProvider.length == 0) || (this.state.countryCheck == true) || (this.state.banknameCheck == true)) {
      this.setState({ dataFieldsError: true });
    }
    else {
      var bankData = {};
      bankData.country = this.state.countryData;
      bankData.bank = this.state.bankData;
      bankData.serviceProvider = this.state.serviceProviderData;
      bankData.status = this.state.status;
      this.setState({ dataFieldsError: false }, () => {
        this.props.modalAction(bankData, 'save');
      })
    }
  }

  onChange = (e) => {
    switch (e.target.id) {
      case ('status'):
        this.setState({ status: e.target.checked }, () => {
          this.setState({snackbar:false},()=>{
            if(this.state.status == false){
              this.setState({snackbar:true,snackbarMessage:'This bank will be disabled',notificationType:'warning'})
            }
          })
        });
      break;
    }
  }

  handleCountryChange = (e) => {
    console.log(e);
    this.setState({ country: e, countryCheck: false }, () => {
      if (this.state.country == undefined) {
        this.setState({ countryCheck: true, countryerrMsg: 'Select valid country', countryData: {}, bankList:[], bank:undefined, bankData:{} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else if (this.state.country.length == 0) {
        this.setState({ countryCheck: true, countryerrMsg: 'Select valid country', countryData: {}, bankList:[], bank:undefined, bankData:{} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else if(this.state.country.length > 0){
        this.state.countryList.map((obj)=>{
          if(this.state.country == obj.value){
            this.setState({country:obj.value,countryData:obj,bankList:[],bank:undefined,bankData:{}},()=>{
              this.fetchBankList(this.state.countryData.value);
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
  }

  handleBankChange = (e) => {
    this.setState({ bank: e, banknameCheck: false }, () => {
      if (this.state.bank == undefined) {
        this.setState({ banknameCheck: true, bankerrMsg: 'Bank name can not be empty', bankData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else if (this.state.bank.length == 0) {
        this.setState({ banknameCheck: true, bankerrMsg: 'Bank name can not be empty', bankData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else if(this.state.bank.length > 0){
        this.state.bankList.map((obj)=>{
          if(this.state.bank == obj.value){
            this.setState({bank:obj.value,bankData:obj},()=>{
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
  }

  handleServiceProviderChange = (e) => {
    this.setState({ serviceProvider: e, serviceProviderCheck: false }, () => {
      if (this.state.serviceProvider == undefined) {
        this.setState({ serviceProviderCheck: true, serviceProvidererrMsg: 'Service Provider can not be empty', serviceProviderData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else if (this.state.serviceProvider.length == 0) {
        this.setState({ serviceProviderCheck: true, serviceProvidererrMsg: 'Service Provider can not be empty', serviceProviderData: {} }, () => {
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else if(this.state.serviceProvider.length > 0){
        this.state.serviceProviderList.map((obj)=>{
          if(this.state.serviceProvider == obj.value){
            this.setState({serviceProvider:obj.value,serviceProviderData:obj},()=>{
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
  }

  handleCountyTypeValueClick = (e) => {
    this.setState({ countryData: {} }, () => {
      let value = e.value;
      this.setState({ countryData: e, country: value, bankList:[],bank:undefined,bankData:{}}, () => {
        this.fetchBankList(this.state.countryData.value);
        this.handleSaveEnable();
        this.handleClearEnable();
      })
    })
  }

  handleBankTypeValueClick = (e) => {
    this.setState({ bankData: {} }, () => {
      let value = e.value;
      this.setState({ bankData: e, bank: value, snackbar: false }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
      })
    })
  }

  handleServiceTypeValueClick = (e) => {
    this.setState({ serviceProviderData: {} }, () => {
      let value = e.value;
      this.setState({ serviceProviderData: e, serviceProvider: value, snackbar: false }, () => {
        this.handleSaveEnable();
        this.handleClearEnable();
      })
    })
  }

  handleSaveEnable = () => {
    if (Object.keys(this.state.countryData).length == 0 || Object.keys(this.state.bankData).length == 0 || Object.keys(this.state.serviceProviderData).length == 0) {
      this.setState({ saveDisabled: true })
    }
    else {
      this.setState({ saveDisabled: false })
    }
  }

  handleCloseModal = () => {
    this.handleClose(null, 'close');
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={()=>this.handleCloseModal()}
          >
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
                          {/* <Fab size="small" color="secondary" aria-label="Add" className={classes.fab} onClick={() => this.handleClose(null, 'close')}>
                            <Close />
                          </Fab> */}
                          {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} /> */}
                          <IconButton style={{ height: 36, width: 36 }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <Grid container direction="row" justify="space-between" spacing={24}>
                  <Grid item xs={12}>
                    <h3 className="global-font title-margin">Drawee Bank Details</h3>
                  </Grid>
                  {
                    this.state.dataFieldsError ?
                      <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
                        <Grid item xs={2}>
                          <span className="errorMessage">Fill all fields correctly</span>
                        </Grid>
                      </Grid> : ''
                  }
                  <Grid item xs={6} className="grid-error">
                    <Selectable
                      id="country"
                      label="Country *"
                      autocomplete='off'
                      isRequired
                      searchable={true}
                      isClearable={true}
                      value={this.state.country}
                      options={this.state.countryList}
                      noResultsText="Country Name Not Found"
                      searchBy={'any'}
                      placeholder="Country"
                      onChange={(e) => this.handleCountryChange(e, 'country')}
                      onBlur={this.handleBlur}
                      onValueClick={(e) => this.handleCountyTypeValueClick(e, 'country')}
                      ref={this.child}
                    />
                    {this.state.countryCheck ? <span className="errorMessage">{this.state.countryerrMsg} </span> : ''}
                  </Grid>
                  {
                    this.state.bankList.length > 0
                    ?
                    <Grid item xs={6} className="grid-error">
                      <Selectable
                        id="bank"
                        label="Bank Name *"
                        isRequired
                        searchable={true}
                        isClearable={true}
                        value={this.state.bank}
                        options={this.state.bankList}
                        noResultsText="Bank Name Not Found"
                        searchBy={'any'}
                        placeholder={'Bank Name'}
                        onChange={(e) => this.handleBankChange(e, 'bank')}
                        onBlur={this.handleBlur}
                        onValueClick={(e) => this.handleBankTypeValueClick(e, 'bank')}
                        ref={this.child}
                      />
                      {this.state.banknameCheck ? <span className="errorMessage">{this.state.bankerrMsg} </span> : ''}
                    </Grid>:<Grid item xs={6} className="grid-error"></Grid>
                  }
                  <Grid item xs={6} className="grid-error">
                    <Selectable
                      id="serviceProvider"
                      label="Service Provider Code *"
                      isRequired
                      searchable={true}
                      isClearable={true}
                      value={this.state.serviceProvider}
                      options={this.state.serviceProviderList}
                      noResultsText="No Service Provider Found"
                      searchBy={'any'}
                      placeholder={'Service Provider Code'}
                      onChange={(e) => this.handleServiceProviderChange(e, 'serviceProvider')}
                      onBlur={this.handleBlur}
                      onValueClick={(e) => this.handleServiceTypeValueClick(e, 'serviceProvider')}
                      ref={this.child}
                    />
                    {this.state.serviceProviderCheck ? <span className="errorMessage">{this.state.serviceProvidererrMsg} </span> : ''}
                  </Grid>
                  <Grid className="global-font" item xs={12}>
                    <p className="toggle-alignment"><b>Status :</b> Disable </p>
                    <div className="toggle-alignment">
                      <Toggle isChecked={this.state.status} id={'status'} isEnabled={true} onChange={this.onChange} />
                    </div>
                    <p className="toggle-alignment">Enable</p>
                  </Grid>
                  <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                    <Grid item xs={4}>
                      <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                        <TextButton isEnabled={this.state.clearDisabled} className={classes.button} umStyle="default" onClick={this.handleClear}>Clear</TextButton>
                        <TextButton
                          className={classes.button}
                          isEnabled={!this.state.saveDisabled}
                          style={
                            {
                              color: this.state.saveDisabled ? null : '#19ace3'
                            }}
                          onClick={this.handleData}>
                          Save
                        </TextButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <DraweeBankCreateModalPopup />
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
            </div>
          </Modal>
          {
            this.state.confirmDelete ? <ModalBox isOpen={this.state.confirmDelete} fromAction={this.state.fromAction} actionType="Yes" message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
          } 
        </div>
      </MuiThemeProvider>
    );
  }
}

DraweeBankCreateModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DraweeBankCreateModalPopup = withStyles(styles)(DraweeBankCreateModal);

export default DraweeBankCreateModalPopup;
