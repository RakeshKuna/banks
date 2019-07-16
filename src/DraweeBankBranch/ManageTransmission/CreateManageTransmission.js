import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import { Selectable, Toggle, TextButton, Notifications, FloatButton,IconButton } from 'finablr-ui';
import { TimePicker } from '../../finablr-ui';
import ModalBox from '../../component/Modalbox';
import getMuiTheme from "../../theme/theme";
import '../../theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as ApiManageService from './ApiManageService';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import moment from 'moment';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import ErrorModal from './../../component/ErrorModalbox';
import * as Exceptionhandler from '../../ExceptionHandling';
import EmptyListComponent from '../../component/EmptylistComponent';
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

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

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

const transanctionTypeList = [{ 'id': 1, 'label': 'Spot', 'value': 'SPOT' },
{ 'id': 2, 'label': 'Priority', 'value': 'PRIORITY' },
{ 'id': 3, 'label': 'Regular', 'value': 'REGULAR' },
{ 'id': 3, 'label': 'All', 'value': 'ALL' },]

const excludeDays = [{ 'id': 1, 'label': 'Sunday', 'value': 'SUNDAY' },
{ 'id': 2, 'label': 'Monday', 'value': 'MONDAY' },
{ 'id': 3, 'label': 'Tuesday', 'value': 'TUESDAY' },
{ 'id': 4, 'label': 'Wednesday', 'value': 'WEDNESDAY' },
{ 'id': 5, 'label': 'Thursday', 'value': 'THURSDAY' },
{ 'id': 6, 'label': 'Friday', 'value': 'FRIDAY' },
{ 'id': 7, 'label': 'Saturday', 'value': 'SATURDAY' },]

class CreateManageTransmission extends React.Component {
  constructor(props) {
    super(props);
    let d = new Date();
    this.state = {
      open: false,
      transmissionTime: d,
      transmissionTimeCheck: false,
      transmissionTimeerrMsg: '',
      displayTransmissionTime: moment(d).format("hh:mm a"),
      transactionType: '',
      transactionTypeCheck: false,
      transactionTypeData: {},
      transactionTypeerrMsg: '',
      transmissionType: '',
      agentSourceCountry: '',
      excludeDays: [],
      agentSourceCountryData: {},
      agentCountry: '',
      agentCountryData: {},
      weekDays: [],
      totalRecords: null,
      agentSourceCountryCheck: false,
      agentCountryCheck: false,
      transmissionTypeCheck: false,
      transmissionTypeErrMsg: '',
      customerTypeErrMsg: '',
      resultTime:'',
      status: true,
      dataFieldsError: false,
      countryList: [],
      agentList: [],
      agentBranchesList: [],
      confirmDelete: false,
      modalMessage: '',
      createmanagetransmissions: true,
      fromAction: '',
      saveDisabled: false,
      clearDisabled:false,
      agentDisabled: true,
      custTypeCountryArr: [],
      selecteddays: [],
      agentBranchesDisabled: true,
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      excludeDayscheck: false,
      excludeDayserrMsg: '',
      showAgentInfo: true,
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      shownogeneralrules: false,
      apiErrMsg:''
    }
  //   this.handleClose = this.handleClose.bind(this);
  //   this.handleOpen = this.handleOpen.bind(this);
   }

  componentDidMount() {
    if (this.props.isOpen) {
      this.handleOpen();
      this.fetchCountryList();
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
      ApiManageService.fetchCountryList(headers).then((response) => {
        if (response.data.length > 0) {
          response.data.map((obj) => {
            let country = {};
            country.id = obj.id;
            country.label = obj.name + ' - '+ obj.countryCode;
            country.field = obj.name;
            country.value = obj.countryCode;
            countryList.push(country);
          })
          this.setState({ countryList });
        }
        else {
          alert('no country records');
        }
      }).catch(error => {
        // alert(error, 'oops error in api call');
        // throw (error)
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
      this.setState({ snackbar: false, custTypeCountryArr: [] }, () => {
        ApiManageService.fetchAgentBranchesList(agentId,headers).then((response) => {
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let branch = {};
              branch.id = obj.id;
              branch.label = obj.branchName;
              branch.field = obj.branchDisplayName;
              agentBranchesList.push(branch);
            })
            this.setState({ agentBranchesList }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
              this.setState({ agentBranchesDisabled: false });
            });
          }
          else {
            this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'No Agent branches records found', agentBranchesDisabled: true }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
        }).catch(error => {
          // alert(error, 'oops error in api call');
          // throw (error)
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
        });
      })
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
      this.setState({ snackbar: false }, () => {
        ApiManageService.fetchAgentList(country,headers).then((response) => {
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let agent = {};
              agent.id = obj.id;
              agent.label = obj.name;
              agent.value = obj.displayName;
              agentList.push(agent);
            })
            this.setState({ agentList }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
              this.setState({ agentDisabled: false });
            });
          }
          else {
            this.setState({ snackbar: true, agentList: [], notificationType: 'warning', snackbarMessage: 'No Agent records found' }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            });
          }
        }).catch(error => {
          // alert('oops error in api call');
          // throw (error)
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
        });
      })
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ actionType: 'Yes', confirmDelete: false, modalMessage: '' }, () => {
      let transmissionTime = this.state.transmissionTime == undefined ? 0 : this.state.transmissionTime.length;
      let transactionType = this.state.transactionType == undefined ? 0 : this.state.transactionType.length;
      if ((transmissionTime) > 0 || (transactionType) > 0 || (this.state.excludeDays.length) > 0) {
        this.setState({ confirmDelete: true, fromAction: 'close', modalMessage: 'All changes will be lost. Are you sure you want to continue?' })
      }
      else {
        this.props.modalAction(null, 'close');
      }
    })
  };

  handleClear = () => {
    this.setState({ confirmDelete: false, snackbar: false }, () => {
      let transmissionTime = this.state.transmissionTime == undefined ? 0 : this.state.transmissionTime.length;
      let transactionType = this.state.transactionType == undefined ? 0 : this.state.transactionType.length;
      if ((transmissionTime) > 0 || (transactionType) > 0 || (this.state.excludeDays.length) > 0) {
        this.setState({ confirmDelete: true, fromAction: 'clear', modalMessage: 'This will clear all data. Are you sure you want to continue?' })
      }
    })
  }

  handleClearEnable = () => {
    if ((this.state.excludeDays.length > 0) || (Object.keys(this.state.transactionTypeData).length > 0)
    || (Object.keys(this.state.agentSourceCountryData).length > 0) || (this.state.agentList.length > 0)
     || (Object.keys(this.state.agentCountryData).length > 0) || (this.state.agentBranchesList.length > 0)
     || (this.state.custTypeCountryArr.length > 0)){
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

  onTimeChange = (value) => {
    let time = moment(value._d).format("hh:mm a")
    this.setState({ transmissionTime: value, displayTransmissionTime: time }, () => {
      console.log(this.state.displayTransmissionTime);
      if (this.state.displayTransmissionTime.length == 0) {
        this.setState({ transmissionTimeCheck: true, transmissionTimeerrMsg: 'Please Select Transmission Type' });
      } else {
        this.setState({ transmissionTimeCheck: false, transmissionTimeerrMsg: '' });
      }
    })
  }

  onChange = (e) => {
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
    this.setState({ custTypeCountryArr: data }, () => {
      this.handleSaveEnable();
      this.handleClearEnable();
    })
  }

  handleViewCustAgentBranchValues = (data) => {
    this.setState({ custTypeCountryArr: data }, () => {
      this.handleSaveEnable();
      this.handleClearEnable();
    })
  }

  handleChangeselecteddays = (data) => {
    this.setState({ excludeDays: data, excludeDayscheck: false }, () => {
      if (this.state.excludeDays.length == 0) {
        this.setState({ excludeDayscheck: false, excludeDayserrMsg: 'Exclude days cannot be empty' },()=>{
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else{
        this.handleSaveEnable();
        this.handleClearEnable();
      }
    })
  }

  handleViewselecteddaysValues = (data) => {
    this.setState({ excludeDays: data, excludeDayscheck: false }, () => {
      if (this.state.excludeDays.length == 0) {
        this.setState({ excludeDayscheck: false, excludeDayserrMsg: 'Exclude days cannot be empty' },()=>{
          this.handleSaveEnable();
          this.handleClearEnable();
        })
      }
      else{
        this.handleSaveEnable();
        this.handleClearEnable();
      } 
    })
  }

  handleModalResponse = (data, from) => {
    if (data == true && from == 'close') {
      this.setState({ confirmDelete: true }, () => {
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
        agentCountryCheck: false,
        showAgentInfo: true,
        status: true,
        confirmDelete: false,
        custTypeCountryArr: [],
        snackbar: false,
        saveDisabled: false,
        clearDisabled:false,
        transactionType: undefined,
        excludeDays: [],
        transmissionTime: undefined,
      })
    }
    else {
      this.setState({ confirmDelete: true }, () => {
        //this.props.modalAction(null,'Try Again closed');
      });
    }
  }

  handleData = () => {
    let a=this.state.transmissionTime
    let abcd = moment(a).format("hh:mm a")
    this.setState({
      resultTime: abcd
    })
    // if(this.state.displayTransmissionTime==''){
    //   this.setState({
    //     resultTime: abcd

    //   })
    // }

    // else{
    //   this.setState({
    //     resultTime:this.state.displayTransmissionTime

    //   })
    // }
    let data = {};
    data.status = (this.state.status == true) ? 'ENABLED' : 'DISABLED';
    data.time = this.state.displayTransmissionTime;
    data.transactionType = this.state.transactionType;
    let result = this.state.excludeDays.map(a => a.value);
    console.log(result);
    this.setState({
      weekDays: result
    }, () => {
      console.log(this.state.weekDays)
    });
    data.weekDays = result;
    if(this.state.transactionType == 'PRIORITY'){
      if (Object.keys(this.state.agentSourceCountryData).length > 0) {
        data.country = {};
        data.country.id = this.state.agentSourceCountryData.id;
        data.country.name = this.state.agentSourceCountryData.field;
      }
      if (Object.keys(this.state.agentCountryData).length > 0) {
        data.agent = {}
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
      }
    }
    this.props.modalAction(data, 'save');
  }

  handleChange = (e, id) => {
    console.log(e, id);
    switch (id) {
      case 'transactionType':
        this.setState({ transactionType: e, transactionTypeCheck: false }, () => {
          if (this.state.transactionType == undefined) {
            this.setState({ transactionTypeCheck: true, transactionTypeerrMsg: 'Transaction type cannot be empty', transactionTypeData: {}, showAgentInfo: true }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.transactionType.length == 0) {
            this.setState({ transactionTypeCheck: true, transactionTypeerrMsg: 'Transaction type cannot be empty', transactionTypeData: {}, showAgentInfo: true }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.transactionType.length > 0){
            transanctionTypeList.map((obj)=>{
              if(this.state.transactionType == obj.value){
                this.setState({transactionType:obj.value,transactionTypeData:obj,transactionTypeCheck:false},()=>{
                  if (this.state.transactionTypeData.value === 'SPOT' || this.state.transactionTypeData.value === 'REGULAR' || this.state.transactionTypeData.value === 'ALL') {
                    this.setState({
                      agentDisabled: true,
                      agentBranchesDisabled: true,
                      showAgentInfo: true,
                    }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();
                    })
                  }
                  else {
                    this.setState({
                      agentDisabled: false,
                      agentBranchesDisabled: false,
                      showAgentInfo: false
                    }, () => {
                      this.handleSaveEnable();
                      this.handleClearEnable();
                    });
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
        break;
      case 'agentsourcecountry':
        this.setState({ agentSourceCountry: e, agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Agent source country cannot be empty', agentSourceCountryData: {}, agentCountryData: {}, agentCountry: undefined, custTypeCountryArr: [], agentList: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Agent source country cannot be empty', agentSourceCountryData: {}, agentCountryData: {}, agentCountry: undefined, custTypeCountryArr: [], agentList: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.agentSourceCountry.length > 0){
            this.state.countryList.map((obj)=>{
              if(this.state.agentSourceCountry == obj.value){
                this.setState({agentSourceCountry:obj.value,agentSourceCountryData:obj,agentSourceCountryCheck:false},()=>{
                  this.fetchAgentsList(this.state.agentSourceCountryData.value);
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
      case 'agentcountry':
        this.setState({ agentCountry: e, agentCountryCheck: false }, () => {
          if (this.state.agentCountry == undefined) {
            this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {}, custTypeCountryArr: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentCountry.length == 0) {
            this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {}, custTypeCountryArr: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.agentCountry.length > 0){
            this.state.agentList.map((obj)=>{
              if(this.state.agentCountry == obj.value){
                this.setState({agentCountry:obj.value,agentCountryData:obj,agentCountryCheck:false},()=>{
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
    }
  }

  handleValueClick = (e, id) => {
    console.log(e, id);
    switch (id) {
      case 'transactionType':
        this.setState({ transactionTypeData: {} }, () => {
          let value = e.value;
          this.setState({ transactionTypeData: e, transactionType: value }, () => {
            if (this.state.transactionTypeData.value === 'SPOT' || this.state.transactionTypeData.value === 'REGULAR' || this.state.transactionTypeData.value === 'ALL') {
              this.setState({
                agentDisabled: true,
                agentBranchesDisabled: true,
                showAgentInfo: true,
              }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();
              })
            }
            else {
              this.setState({
                agentDisabled: false,
                agentBranchesDisabled: false,
                showAgentInfo: false
              }, () => {
                this.handleSaveEnable();
                this.handleClearEnable();
              });
            }
          })
        })
        break;
      case 'agentsourcecountry':
        this.setState({ agentSourceCountryData: {} }, () => {
          let value = e.value;
          this.setState({ agentSourceCountryData: e, agentSourceCountry: value, agentCountry: undefined, agentList: [], custTypeCountryArr: [], agentBranchesList: [] }, () => {
            this.fetchAgentsList(this.state.agentSourceCountryData.value);
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
        break;
      case 'agentcountry':
        this.setState({ agentCountryData: {} }, () => {
          let value = e.value;
          this.setState({ agentCountryData: e, agentCountry: value }, () => {
            this.fetchAgentBranchesList(this.state.agentCountryData.id);
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
      case 'transactionType':
        this.setState({ transactionTypeCheck: false }, () => {
          if (this.state.transactionType == undefined) {
            this.setState({ transactionTypeCheck: true, transactionTypeerrMsg: 'Transaction type cannot be empty', transactionTypeData: {}, showAgentInfo: true }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.transactionType.length == 0) {
            this.setState({ transactionTypeCheck: true, transactionTypeerrMsg: 'Transaction type cannot be empty', transactionTypeData: {}, showAgentInfo: true }, () => {
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
      case 'agentsourcecountry':
        this.setState({ agentSourceCountryCheck: false }, () => {
          if (this.state.agentSourceCountry == undefined) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Agent source country cannot be empty', agentSourceCountryData: {}, agentCountryData: {}, agentCountry: undefined, custTypeCountryArr: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentSourceCountry.length == 0) {
            this.setState({ agentSourceCountryCheck: true, agentSourceCountryerrMsg: 'Agent source country cannot be empty', agentSourceCountryData: {}, agentCountryData: {}, agentCountry: undefined, custTypeCountryArr: [], agentBranchesList: [] }, () => {
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
      case 'agentcountry':
        this.setState({ agentCountryCheck: false }, () => {
          if (this.state.agentCountry == undefined) {
            this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {}, custTypeCountryArr: [], agentBranchesList: [] }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.agentCountry.length == 0) {
            this.setState({ agentCountryCheck: false, agentCountryerrMsg: 'Country cannot be empty', agentCountryData: {}, custTypeCountryArr: [], agentBranchesList: [] }, () => {
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
    if (Object.keys(this.state.transactionTypeData).length == 0) {
      this.setState({ saveDisabled: false })
    }
    else if (this.state.showAgentInfo == false) {
      if (Object.keys(this.state.agentSourceCountryData).length == 0 && this.state.transactionType == 'PRIORITY' && this.state.countryList.length > 0) {
        this.setState({ saveDisabled: false })
      }
      // else if (this.state.agentList.length > 0 && Object.keys(this.state.agentCountryData).length == 0) {
      //   this.setState({ saveDisabled: false })
      // }
      // else if (this.state.agentBranchesList.length > 0 && this.state.custTypeCountryArr.length == 0) {
      //   this.setState({ saveDisabled: false })
      // }
      else {
        this.setState({ saveDisabled: true })
      }
    }
    else {
      this.setState({ saveDisabled: true })
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
                          {/* <Fab size="small" color="secondary" aria-label="Add" className={classes.fab} onClick={this.handleClose}>
                            <Close />
                          </Fab> */}
                          {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={this.handleClose} /> */}
                          <IconButton style={{ height: 36, width: 36 }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <Grid container direction="row" justify="space-between" spacing={24}>
                  <Grid item xs={12}>
                    <h3 className="global-font title-margin">Manage Transmission</h3>
                  </Grid>
                </Grid>
                <Grid container direction="row" justify="space-between" spacing={24}>
                  <Grid className="grid-error" item xs={6}>
                    <TimePicker label="Transmission Time"
                      value={this.state.transmissionTime} style={{paddingTop:11}}
                      id="transmissionTime"
                      onChange={this.onTimeChange}
                    />
                    {/* {this.transmissionTimeCheck ? "please select data" : ''} */}
                    {this.state.transmissionTimeCheck ? <span className="errorMessage">{this.state.transmissionTimeerrMsg} </span> : ''}

                  </Grid>
                  <Grid className="grid-error" item xs={6}>
                    {/* <MultiSelectTextField value={this.state.excludeDays} label='Exclude days'
                      InputLabel={"Exclude Days"} type='excludedays' placeholder="days"
                      MultiSelectText='Exclude Days'
                      suggestionFields={excludeDays}
                      getAutoSelectValue={this.handleChangeselecteddays} getViewValues={this.handleViewselecteddaysValues} /> */}
                      <MultiSelectTextField InputLabel={"Exclude Days"} value={this.state.excludeDays} label='Exclude days' MultiSelectText='Exclude Days' type='excludedays' suggestionFields={excludeDays} placeholder={'days'} getAutoSelectValue={this.handleChangeselecteddays} getViewValues={this.handleViewselecteddaysValues} />
                    {this.state.excludeDayscheck ? <span className="errorMessage">{this.state.excludeDayserrMsg} </span> : ''}
                  </Grid>
                </Grid>
                <Grid className="grid-error" item xs={6} style={{marginTop:10}}>
                  <Selectable
                    id="transactionType"
                    isRequired
                    searchable={true}
                    label='Transaction Type'
                    value={this.state.transactionType}
                    options={transanctionTypeList}
                    noResultsText="No Transaction Type Found"
                    searchBy={'label'}
                    placeholder="Transaction Type"
                    onChange={(e) => this.handleChange(e, 'transactionType')}
                    onValueClick={(e) => this.handleValueClick(e, 'transactionType')}
                    onBlur={this.handleBlur}
                  />
                  {this.state.transactionTypeCheck ? <span className="errorMessage-add">{this.state.transactionTypeerrMsg} </span> : ''}
                </Grid>
                {this.state.showAgentInfo ? <div></div> : <Grid container direction="row" spacing={24} >
                  <Grid item xs={4} style={{marginTop:10}}>
                    <Selectable
                      id="agentsourcecountry"
                      isRequired
                      searchable={true}
                      label='Agent Source Country'
                      value={this.state.agentSourceCountry}
                      options={this.state.countryList}
                      noResultsText="No Country Found"
                      searchBy={'label'}
                      placeholder="Agent Source Country"
                      onChange={(e) => this.handleChange(e, 'agentsourcecountry')}
                      onValueClick={(e) => this.handleValueClick(e, 'agentsourcecountry')}
                      onBlur={this.handleBlur}
                    />
                    {this.state.agentSourceCountryCheck ? <span className="errorMessage-add">{this.state.agentSourceCountryerrMsg} </span> : ''}
                  </Grid>
                  <Grid item xs={4} style={{marginTop:10}}>
                    {
                      this.state.agentList.length > 0 ?
                        <Selectable
                          id="agentcountry"
                          searchable={true}
                          label='Agent'
                          value={this.state.agentCountry}
                          options={this.state.agentList}
                          noResultsText="No Agents Found"
                          searchBy={'label'}
                          placeholder="Agent"
                          onChange={(e) => this.handleChange(e, 'agentcountry')}
                          onValueClick={(e) => this.handleValueClick(e, 'agentcountry')}
                          onBlur={this.handleBlur}
                        />
                        : null
                    }
                    {this.state.agentCountryCheck ? <span className="errorMessage-add">{this.state.agentCountryerrMsg} </span> : ''}
                  </Grid>
                  <Grid item xs={4} style={{marginTop:10}}>
                    {
                      this.state.agentList.length > 0 ?
                        <MultiSelectTextField disabled={this.state.agentBranchesDisabled}
                          value={this.state.custTypeCountryArr} label='Agent Branches'
                          MultiSelectText='Agent Branches'
                          type='agentbranches' suggestionFields={this.state.agentBranchesList} placeholder={'Agent Branches'} getAutoSelectValue={this.handleChangeCustAgentBranch} getViewValues={this.handleViewCustAgentBranchValues} />
                        : null
                    }
                  </Grid>
                </Grid>
                }
                <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
                  <Grid className="grid-margin-bottom global-font" item xs={12} style={{paddingTop:"20px"}}>
                    <p className="toggle-alignment"><b>Status :</b> Disable </p>
                    <div className="toggle-alignment">
                      {/* <Toggleswitch value={this.state.status} type='status' getToggleValue={this.handleChange} /> */}
                      <Toggle isChecked={this.state.status} id={'status'} isEnabled={true} onChange={this.onChange} />
                    </div>
                    <p className="toggle-alignment">Enable</p>
                  </Grid>
                  <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                    <Grid item xs={4}>
                      <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                        <TextButton isEnabled={this.state.clearDisabled} style={{ color: "#888888", fontSize: 18,fontWeight:500,marginBottom:20, fontFamily:"Gotham-Rounded" }} onClick={this.handleClear} >Clear</TextButton>
                        <TextButton isEnabled={this.state.saveDisabled} style={{ color: "#19ace3",  fontSize: 18,fontWeight:500,marginBottom:20, fontFamily:"Gotham-Rounded" }} onClick={this.handleData} >Save</TextButton>
                      </Grid>
                    </Grid>
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
              
            </div>
          </Modal>
          {
            this.state.confirmDelete ? <ModalBox isOpen={this.state.confirmDelete} fromAction={this.state.fromAction} actionType="Yes" message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
          }
          {
            this.state.shownogeneralrules ? <ErrorModal isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleModalResponse} /> : null
          }
        </div>
      }
      </MuiThemeProvider>
    );
  }
}

CreateManageTransmission.propTypes = {
  classes: PropTypes.object.isRequired,
};

const CreateManageTransmissionPopup = withStyles(styles)(CreateManageTransmission);

export default CreateManageTransmissionPopup;
