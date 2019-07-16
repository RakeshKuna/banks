import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import ModalBox from './../../component/Modalbox';
import getMuiTheme from "../../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as ApiService from './ApiService';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import { FloatButton,IconButton, Selectable, TextButton, Toggle, Notifications } from 'finablr-ui';
import Loader from '../../component/Loader';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import * as Exceptionhandler from '../../ExceptionHandling';
import EmptyListComponent from '../../component/EmptylistComponent';
import ErrorModalBox from './../../component/ErrorModalbox';
import * as config from '../../config/config';
import '../../vendor/common.css';

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
    height: 24
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


const selectLabels = [{ 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' }, { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }, { 'id': 3, 'label': 'Both', 'value': 'BOTH' }];

class CreateCountryRestrictionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: true,
      loaderMsg: 'Retrieving Data',
      customerType: '',
      beneficiaryType: '',
      agentSourceCountry: '',
      customerTypeData: {},
      agentSourceCountryData: {},
      agentCountry: '',
      agentCountryData: {},
      beneficiaryTypeData: {},
      destinationCountry: '',
      destinationCountryData: {},
      totalRecords: null,
      agentSourceCountryCheck: false,
      agentCountryCheck: false,
      destinationCountryCheck: false,
      customerTypeCheck: false,
      beneficiaryTypeCheck: false,
      agentBranchesCheck: false,
      beneficiaryTypeErrMsg: '',
      destinationCountryErrMsg: '',
      customerTypeErrMsg: '',
      agentSourceCountryErrMsg: '',
      agentErrMsg: '',
      agentBranchesErrMsg: '',
      status: true,
      dataFieldsError: false,
      countryList: [],
      agentList: [],
      agentBranchesList: [],
      confirmDelete: false,
      modalMessage: '',
      createnationalityrestriction: true,
      fromAction: '',
      isCustomerTypeDisabled: false,
      isBeneficiaryTypeDisabled: false,
      custTypeCountryArr: [],
      isSaveEnabled: false,
      clearDisabled:false,
      agentDisabled: true,
      agentBranchesDisabled: true,
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      ruledefaultvalue: {},
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      shownogeneralrules: false,
      apiErrMsg:''
    }
    // this.handleClose = this.handleClose.bind(this);
    // this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    console.log('country');
    if (this.props.hasOwnProperty('ruledefaultvalue')) {
      this.setState({ ruledefaultvalue: this.props.ruledefaultvalue }, () => {
        let customerTypeData = {};
        let beneficiaryTypeData = {};
        if (this.state.ruledefaultvalue.customerType == 'INDIVIDUAL') {
          customerTypeData = { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }
        }
        if (this.state.ruledefaultvalue.customerType == 'CORPORATE') {
          customerTypeData = { 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' };
        }
        if (this.state.ruledefaultvalue.customerType == 'BOTH') {
          customerTypeData = { 'id': 3, 'label': 'Both', 'value': 'BOTH' };
        }
        if (this.state.ruledefaultvalue.beneficiaryType == 'INDIVIDUAL') {
          beneficiaryTypeData = { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }
        }
        if (this.state.ruledefaultvalue.beneficiaryType == 'CORPORATE') {
          beneficiaryTypeData = { 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' };
        }
        if (this.state.ruledefaultvalue.beneficiaryType == 'BOTH') {
          beneficiaryTypeData = { 'id': 3, 'label': 'Both', 'value': 'BOTH' };
        }
        if (this.props.isOpen) {
          this.setState({
            customerType: this.state.ruledefaultvalue.customerType,
            beneficiaryType: this.state.ruledefaultvalue.beneficiaryType,
            isCustomerTypeDisabled: this.state.ruledefaultvalue.isCustomerTypeDisabled,
            isBeneficiaryTypeDisabled: this.state.ruledefaultvalue.isBeneficiaryTypeDisabled,
            customerTypeData: customerTypeData,
            beneficiaryTypeData: beneficiaryTypeData
          }, () => {
            this.fetchCountryList();
            this.handleSaveEnable();
            this.handleClearEnable();
            this.handleOpen();
            this.handleEscape();
          })
        }
      })
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

  handleOpen = () => {
    this.setState({ open: true, loading: true });
  };

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
        if (response.data.length > 0) {
          response.data.map((obj) => {
            let country = {};
            country.id = obj.id;
            country.label = obj.name + ' - ' + obj.countryCode;
            country.value = obj.countryCode;
            country.name = obj.name;
            countryList.push(country);
          })
          this.setState({ countryList, loading: false });
        }
        else {
          this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'No country records' });
        }
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({snackbar:false}, () => {
            this.setState({ loading: false, serverError: true, snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
        // alert('error in api call');
        // throw (error)
      });
    }
  }

  fetchAgentsList = (country) => {
    let agentList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiService.fetchAgentList(country,headers).then((response) => {
        this.setState({ snackbar: false }, () => {
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let agent = {};
              agent.id = obj.id;
              agent.label = obj.name;
              agent.value = obj.displayName;
              agentList.push(agent);
            })
            this.setState({ agentList }, () => {
              this.setState({ agentDisabled: false });
            });
          }
          else {
            this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'No agent records found' });
          }
        })
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({snackbar:false}, () => {
            this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
        // alert('oops error in api call');
        // throw (error)
      });
    }
  }

  fetchAgentBranchesList = (agentId) => {
    let agentBranchesList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiService.fetchAgentBranchesList(agentId).then((response) => {
        this.setState({ snackbar: false }, () => {
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let branch = {};
              branch.id = obj.id;
              branch.label = obj.branchName;
              branch.field = obj.branchDisplayName;
              agentBranchesList.push(branch);
            })
            this.setState({ agentBranchesList }, () => {
              this.setState({ agentBranchesDisabled: false });
            });
          }
          else {
            this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'No agent branches records found' });
          }
        })
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          this.setState({snackbar:false}, () => {
            this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
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

  handleClear = () => {
    this.setState({ confirmDelete: false, modalMessage: '' }, () => {
      let customerType = (this.state.customerType == undefined) ? 0 : this.state.customerType.length;
      let beneficiaryTypeLength = (this.state.beneficiaryType == undefined) ? 0 : this.state.beneficiaryType.length;
      let agentSourceCountryLength = (this.state.agentSourceCountry == undefined) ? 0 : this.state.agentSourceCountry.length;
      let destinationCountryLength = (this.state.destinationCountry == undefined) ? 0 : this.state.destinationCountry.length;
      if (agentSourceCountryLength > 0 || ((customerType > 0) && (this.state.isCustomerTypeDisabled == false)) || ((beneficiaryTypeLength > 0) && (this.state.isBeneficiaryTypeDisabled == false)) || Object.keys(this.state.agentSourceCountryData).length > 0 || destinationCountryLength > 0) {
        this.setState({ confirmDelete: true, fromAction: 'clear', modalMessage: 'This will clear all data. Are you sure you want to continue?' })
      }
    })
  }

  handleClearEnable = () => {
    if ( (this.state.custTypeCountryArr.length > 0) || (Object.keys(this.state.customerTypeData).length > 0 && this.state.isCustomerTypeDisabled == false) || (Object.keys(this.state.beneficiaryTypeData).length > 0 && this.state.isBeneficiaryTypeDisabled == false) 
    || (Object.keys(this.state.agentSourceCountryData).length > 0) || (Object.keys(this.state.destinationCountryData).length > 0)
    ||  (Object.keys(this.state.agentCountryData).length > 0) )
     {
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
    this.setState({ confirmDelete: false, modalMessage: '' }, () => {
      let customerType = (this.state.customerType == undefined) ? 0 : this.state.customerType.length;
      let beneficiaryTypeLength = (this.state.beneficiaryType == undefined) ? 0 : this.state.beneficiaryType.length;
      let agentSourceCountryLength = (this.state.agentSourceCountry == undefined) ? 0 : this.state.agentSourceCountry.length;
      let destinationCountryLength = (this.state.destinationCountry == undefined) ? 0 : this.state.destinationCountry.length;
      if (agentSourceCountryLength > 0 || ((customerType > 0) && (this.state.isCustomerTypeDisabled == false)) || ((beneficiaryTypeLength > 0) && (this.state.isBeneficiaryTypeDisabled == false)) || Object.keys(this.state.agentSourceCountryData).length > 0 || destinationCountryLength > 0) {
        this.setState({ confirmDelete: true, fromAction: 'close', modalMessage: 'This will clear all data. Are you sure you want to continue?' })
      }
      else {
        this.setState({ confirmDelete: false }, () => {
          this.props.modalAction(null, 'close');
        })
      }
    })
  };

  handleChange = (data, id) => {
    switch (id) {
      case ('allowedCustomerType'):
        this.setState({ customerType: data, customerTypeCheck: false }, () => {
          if (this.state.customerType == undefined) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'Customer Type cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.customerType.length == 0) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'Customer Type cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.customerType.length > 0){
            selectLabels.map((obj)=>{
              if(this.state.customerType == obj.value){
                this.setState({ customerTypeData: obj, customerType: obj.value }, () => {
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
      case ('agentSourceCountry'):
        this.setState({ agentSourceCountry: data, agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: false, agentSourceCountryErrMsg: 'Agent Source Country cannot be empty', agentSourceCountryData: {}, agentList: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: false, agentSourceCountryErrMsg: 'Agent Source Country cannot be empty', agentSourceCountryData: {}, agentList: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.agentSourceCountry.length > 0){
            this.state.countryList.map((obj)=>{
              if(this.state.agentSourceCountry == obj.value){
                this.setState({ agentSourceCountryData: obj, agentSourceCountry: obj.value }, () => {
                  this.setState({ agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesDisabled: true, custTypeCountryArr: [] }, () => {
                    this.fetchAgentsList(this.state.agentSourceCountryData.value);
                    this.handleSaveEnable();
                    this.handleClearEnable();
                  })
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
      case ('agentCountry'):
        this.setState({ agentCountry: data, agentCountryCheck: false }, () => {
          if (this.state.agentCountry == undefined) {
            this.setState({ agentCountryCheck: true, agentErrMsg: 'Agent cannot be empty', agentCountryData: {}, agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentCountry.length == 0) {
            this.setState({ agentCountryCheck: true, agentErrMsg: 'Agent cannot be empty', agentCountryData: {}, agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.agentCountry.length > 0){
            this.state.agentList.map((obj)=>{
              if(this.state.agentCountry == obj.value){
                this.setState({ agentCountryData: obj, agentCountry: obj.value,agentBranchesDisabled: true, custTypeCountryArr: [] }, () => {
                  this.fetchAgentBranchesList(this.state.agentCountryData.id);
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
      case ('allowedBeneficiaryType'):
        this.setState({ beneficiaryType: data, agentCountryCheck: false }, () => {
          if (this.state.beneficiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.beneficiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.beneficiaryType.length > 0){
            selectLabels.map((obj)=>{
              if(this.state.beneficiaryType == obj.value){
                this.setState({ beneficiaryTypeData: obj, beneficiaryType: obj.value }, () => {
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
      case ('destinationCountry'):
        this.setState({ destinationCountry: data, agentCountryCheck: false }, () => {
          if (this.state.destinationCountry == undefined) {
            this.setState({ destinationCountryCheck: true, destinationCountryErrMsg: 'Destination Country cannot be empty', destinationCountryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.destinationCountry.length == 0) {
            this.setState({ destinationCountryCheck: true, destinationCountryErrMsg: 'Destination Country cannot be empty', destinationCountryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.destinationCountry.length > 0){
            this.state.countryList.map((obj)=>{
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
        });
        break;
    }
  }

  handleValueClick = (obj, id) => {
    console.log(obj, id);
    switch (id) {
      case 'allowedCustomerType':
        this.setState({ customerTypeData: {} }, () => {
          let value = obj.value;
          this.setState({ customerTypeData: obj, customerType: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        });
      break;
      case 'agentSourceCountry':
        this.setState({ agentSourceCountryData: {} }, () => {
          console.log(obj);
          let value = obj.value;
          this.setState({ agentSourceCountryData: obj, agentSourceCountry: value }, () => {
            this.setState({ agentCountry: undefined, agentCountryData: {}, agentList: [], agentBranchesDisabled: true, custTypeCountryArr: [] }, () => {
              this.fetchAgentsList(this.state.agentSourceCountryData.value);
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          })
        });
      break;
      case 'agentCountry':
        this.setState({ agentCountryData: {} }, () => {
          let value = obj.value;
          this.setState({ agentCountryData: obj, agentCountry: value }, () => {
            this.setState({ agentBranchesDisabled: true, custTypeCountryArr: [] }, () => {
              this.fetchAgentBranchesList(this.state.agentCountryData.id);
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          })
        });
      break;
      case 'allowedBeneficiaryType':
        this.setState({ beneficiaryTypeData: {} }, () => {
          let value = obj.value;
          this.setState({ beneficiaryTypeData: obj, beneficiaryType: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        });
      break;
      case 'destinationCountry':
        this.setState({ destinationCountryData: {} }, () => {
          let value = obj.value;
          this.setState({ destinationCountryData: obj, destinationCountry: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        });
      break;
    }
  }

  handleBlur = (e) => {
    switch (e.target.id) {
      case 'allowedCustomerType':
        this.setState({ customerTypeCheck: false }, () => {
          if (this.state.customerType == undefined) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'Customer type cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.customerType.length == 0) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'Customer type cannot be empty', customerTypeData: {} }, () => {
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
      case 'agentSourceCountry':
        this.setState({ agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: false, agentSourceCountryErrMsg: 'Agent Source Country cannot be empty', agentSourceCountryData: {}, agentCountryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: false, agentSourceCountryErrMsg: 'Agent Source Country cannot be empty', agentSourceCountryData: {}, agentCountryData: {} }, () => {
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
          if (this.state.agentCountry == undefined) {
            this.setState({ agentCountryCheck: true, agentErrMsg: 'Agent cannot be empty', agentCountryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentCountry.length == 0) {
            this.setState({ agentCountryCheck: true, agentErrMsg: 'Agent cannot be empty', agentCountryData: {} }, () => {
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
      case 'allowedBeneficiaryType':
        this.setState({ beneficiaryTypeCheck: false }, () => {
          if (this.state.beneficiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.beneficiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
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
      case 'destinationCountry':
        this.setState({ destinationCountryCheck: false }, () => {
          if (this.state.destinationCountry == undefined) {
            this.setState({ destinationCountryCheck: true, destinationCountryErrMsg: 'Destination Country cannot be empty', destinationCountryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.destinationCountry.length == 0) {
            this.setState({ destinationCountryCheck: true, destinationCountryErrMsg: 'Destination Country cannot be empty', destinationCountryData: {} }, () => {
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

  onToggleChange = (e) => {
    switch (e.target.id) {
      case ('status'):
      this.setState({ status: e.target.checked }, () => {
        this.setState({snackbar:false},()=>{
          if(this.state.status == false){
            this.setState({snackbar:true,snackbarMessage:'This rule will be disabled',notificationType:'warning'})
          }
        })
      });
      break;
    }
  }

  handleChangeCustAgentBranch = (data) => {
    this.setState({ custTypeCountryArr: data })
  }

  handleViewCustAgentBranchValues = (data) => {
    this.setState({ custTypeCountryArr: data })
  }

  handleModalResponse = (data, from) => {
    if (data == true && from == 'close') {
      this.setState({ confirmDelete: false }, () => {
        this.props.modalAction(null, 'close');
      })
    }
    else if (data == true && from == 'clear') {
      this.setState({
        agentSourceCountry: undefined,
        agentSourceCountryData: {},
        agentSourceCountryCheck: false,
        agentCountryData: {},
        agentCountry: undefined,
        agentList: [],
        agentCountryCheck: false,
        agentCountryData: {},
        destinationCountry: undefined,
        destinationCountryCheck: false,
        destinationCountryData: {},
        status: true,
        confirmDelete: false,
        custTypeCountryArr: [],
        customerTypeCheck: false,
        beneficiaryTypeCheck: false,
        snackbar: false,
        isSaveEnabled: false,
        clearDisabled:false,

      }, () => {
        (this.state.isCustomerTypeDisabled == false) ? 
          (this.setState({ customerType: undefined, customerTypeData:{} },() => {
            this.handleSaveEnable();
            this.handleClearEnable();
        })) : this.setState({ confirmDelete: false });
        (this.state.isBeneficiaryTypeDisabled == false) ?
          (this.setState({ beneficiaryType: undefined, beneficiaryTypeData:{} },() => {
            this.handleSaveEnable();
            this.handleClearEnable();
        })) : this.setState({ confirmDelete: false });
      })
    }
    else {
      this.setState({ confirmDelete: true }, () => {
        //this.props.modalAction(null,'close');
      });
    }
  }

  handleData = () => {
    let data = {};
    data.status = (this.state.status == true) ? 'ENABLED' : 'DISABLED';
    data.beneficiaryType = this.state.beneficiaryType;
    data.customerType = this.state.customerType;
    if (Object.keys(this.state.agentSourceCountryData).length > 0) {
      data.country = {};
      data.country.id = this.state.agentSourceCountryData.id;
      data.country.name = this.state.agentSourceCountryData.name;
      if (Object.keys(this.state.agentCountryData).length > 0) {
        data.agent = {};
        data.agent.id = this.state.agentCountryData.id;
        data.agent.name = this.state.agentCountryData.label;
        data.agent.agentBranches = [];
        if (this.state.custTypeCountryArr.length > 0) {
          this.state.custTypeCountryArr.map((obj) => {
            let branchObj = {};
            branchObj.id = obj.id;
            branchObj.branchName = obj.label;
            data.agent.agentBranches.push(branchObj);
          })
        }
        else {
          data.agent.agentBranches = [];
        }
      }
    }
    if (Object.keys(this.state.destinationCountryData).length > 0) {
      data.destinationCountry = {};
      data.destinationCountry.id = this.state.destinationCountryData.id;
      data.destinationCountry.name = this.state.destinationCountryData.name;
    }
    console.log(data);
    this.props.modalAction(data, 'save');
  }

  handleSaveEnable = () => {
    console.log(this.state)
    if (Object.keys(this.state.customerTypeData).length == 0 || Object.keys(this.state.beneficiaryTypeData).length == 0  || Object.keys(this.state.destinationCountryData).length == 0) {
      this.setState({ isSaveEnabled: false })
    }
    // else if (Object.keys(this.state.agentSourceCountryData).length > 0) {
    //   if (this.state.agentList.length > 0 && Object.keys(this.state.agentCountryData).length == 0) {
    //     this.setState({ isSaveEnabled: false })
    //   }
    //   else {
    //     this.setState({ isSaveEnabled: true })
    //   }
    // }
    else {
      this.setState({ isSaveEnabled: true })
    }
  }

  handleCloseModal = () => {
    this.handleClose(null, 'close');
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
      {
            // this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
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
                              {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={this.handleClose} /> */}
                              <IconButton style={{ height: 36, width: 36 }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <Grid container spacing={24} direction="row" justify="space-between" >
                      <Grid item xs={12} className={'grid-no--bottom-margin'}>
                        <h3 className="global-font title-margin">Country Restriction</h3>
                      </Grid>
                      <Grid item xs={12} className={'grid-no--bottom-margin'}>
                        <span className="global-font">Customer Info</span>
                      </Grid>
                      <Grid item xs={6} className={'grid-no--bottom-margin grid-error'}>
                        <Selectable
                          id="allowedCustomerType"
                          ref="Selectable"
                          label="Customer Type"
                          isRequired
                          searchable={true}
                          isCreatable={false}
                          isClearable={true}
                          value={this.state.customerType}
                          options={selectLabels}
                          noResultsText="No customerType Found"
                          searchBy={'any'}
                          placeholder={'Customer Type'}
                          onChange={(e) => this.handleChange(e, 'allowedCustomerType')}
                          onValueClick={(e) => this.handleValueClick(e, 'allowedCustomerType')}
                          onBlur={this.handleBlur}
                          isEnabled={!this.state.isCustomerTypeDisabled}
                        />
                        {this.state.customerTypeCheck ? <span className="errorMessage">{this.state.customerTypeErrMsg} </span> : ''}
                      </Grid>
                      <Grid item xs={6}></Grid>
                      {/* <Grid container direction="row" spacing={24} > */}
                        <Grid item xs={6} className={'grid-no--bottom-margin grid-error'}>
                          <Selectable
                            id="agentSourceCountry"
                            ref="Selectable"
                            label="Agent Source Country"
                            isRequired
                            searchable={true}
                            isCreatable={false}
                            isClearable={true}
                            value={this.state.agentSourceCountry}
                            options={this.state.countryList}
                            noResultsText="No Agent Source Country Found"
                            searchBy={'any'}
                            placeholder={'Agent Source Country'}
                            onChange={(e) => this.handleChange(e, 'agentSourceCountry')}
                            onValueClick={(e) => this.handleValueClick(e, 'agentSourceCountry')}
                            onBlur={this.handleBlur}
                          // isEnabled={true}
                          />
                          {this.state.agentSourceCountryCheck ? <span className="errorMessage">{this.state.agentSourceCountryErrMsg} </span> : ''}
                        </Grid>
                        <Grid item xs={6} className="grid-error">
                          {
                            (this.state.agentList.length > 0)
                              ?
                              <div>
                                <Selectable
                                  id="agentCountry"
                                  ref="Selectable"
                                  label="Agent"
                                  isRequired
                                  searchable={true}
                                  isCreatable={false}
                                  isClearable={true}
                                  value={this.state.agentCountry}
                                  options={this.state.agentList}
                                  noResultsText="No Agent Found"
                                  searchBy={'any'}
                                  placeholder={'Agent'}
                                  onChange={(e) => this.handleChange(e, 'agentCountry')}
                                  onValueClick={(e) => this.handleValueClick(e, 'agentCountry')}
                                  onBlur={this.handleBlur}
                                  isEnabled={!this.state.agentDisabled}
                                />
                                {this.state.agentCountryCheck ? <span className="errorMessage">{this.state.agentErrMsg} </span> : ''}
                              </div>
                              :
                              null
                          }

                        </Grid>
                        <Grid item xs={6}>
                          {
                            ((this.state.agentList.length > 0) && (this.state.agentBranchesList.length > 0))
                              ?
                              <MultiSelectTextField disabled={this.state.agentBranchesDisabled} value={this.state.custTypeCountryArr} label='Agent Branches' type='agentbranches' suggestionFields={this.state.agentBranchesList} placeholder={'Agent Branches'} MultiSelectText='Agent Branches' getAutoSelectValue={this.handleChangeCustAgentBranch} getViewValues={this.handleViewCustAgentBranchValues} />
                              :
                              null
                          }

                        </Grid>
                      </Grid>
                      <Grid container direction="row" className="" spacing={24}>
                        <Grid item xs={12}>
                          <p className="global-font grid-no--bottom-margin">Beneficiary Info</p>
                        </Grid>
                        <Grid item xs={6} className="grid-error">
                          <Selectable
                            id="allowedBeneficiaryType"
                            ref="Selectable"
                            label="Beneficiary Type"
                            isRequired
                            searchable={true}
                            isCreatable={false}
                            isClearable={true}
                            value={this.state.beneficiaryType}
                            options={selectLabels}
                            noResultsText="No Beneficiary Type Found"
                            searchBy={'any'}
                            placeholder={'Beneficiary Type'}
                            onChange={(e) => this.handleChange(e, 'allowedBeneficiaryType')}
                            onValueClick={(e) => this.handleValueClick(e, 'allowedBeneficiaryType')}
                            onBlur={this.handleBlur}
                            isEnabled={!this.state.isBeneficiaryTypeDisabled}
                          />
                          {this.state.beneficiaryTypeCheck ? <span className="errorMessage">{this.state.beneficiaryTypeErrMsg} </span> : ''}
                        </Grid>
                        <Grid item xs={6} className="grid-error">
                          <Selectable
                            id="destinationCountry"
                            ref="Selectable"
                            label="Destination Country"
                            isRequired
                            searchable={true}
                            isCreatable={false}
                            isClearable={true}
                            value={this.state.destinationCountry}
                            options={this.state.countryList}
                            noResultsText="No Destination Country Found"
                            searchBy={'any'}
                            placeholder={'Destination Country'}
                            onChange={(e) => this.handleChange(e, 'destinationCountry')}
                            onValueClick={(e) => this.handleValueClick(e, 'destinationCountry')}
                            onBlur={this.handleBlur}
                          />
                          {this.state.destinationCountryCheck ? <span className="errorMessage">{this.state.destinationCountryErrMsg} </span> : ''}
                        </Grid>
                      </Grid>
                    <Grid style={{marginTop:'20px'}} className="global-font" item={24}>
                      <p className="toggle-alignment"><b>Status :</b> Disable </p>
                      <div className="toggle-alignment">
                        <Toggle isChecked={this.state.status} id={'status'} isEnabled={true} onChange={this.onToggleChange} />
                      </div>
                      <p className="toggle-alignment">Enable</p>
                    </Grid>
                    <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                      <Grid item xs={4}>
                        <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                          <TextButton isEnabled={this.state.clearDisabled} style={{ color: "#888888",fontWeight: 500, fontSize: 18,fontFamily:"Gotham-Rounded" }} onClick={this.handleClear} >Clear</TextButton>
                          <TextButton isEnabled={this.state.isSaveEnabled} style={{ color: "#19ace3",fontWeight: 500, fontSize: 18,fontFamily:"Gotham-Rounded" }} onClick={this.handleData} >Save</TextButton>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* <CreateCountryRestrictionModalPopup /> */}
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
    )
  }
}

CreateCountryRestrictionModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const CreateCountryRestrictionModalPopup = withStyles(styles)(CreateCountryRestrictionModal);

export default CreateCountryRestrictionModalPopup;
