import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import ModalBox from '../../component/Modalbox';
import getMuiTheme from "../../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as ApiService from './ApiService';
import Loader from './../../component/Loader';
import { Selectable,Toggle, TextButton, FloatButton,IconButton, Notifications } from 'finablr-ui';
import * as Exceptionhandler from '../../ExceptionHandling';
import ErrorModal from '../../component/ErrorModalbox';
import EmptyListComponent from '../../component/EmptylistComponent';
import * as config from '../../config/config';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import '../../vendor/common.css';

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    maxHeight: `75%`,
    width: `78%`,
    transform: `translate(-50%, -50%)`,
    borderRadius: `5px`,
    overflowY: 'auto',
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

class DraweeBankCreateNationalityModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      country: '',
      countryData: {},
      countryCheck: false,
      countryerrMsg: '',
      customerType: '',
      customerTypeCheck: false,
      customerTypeErrMsg: '',
      customerTypeData: '',
      isCustomerTypeDisabled: false,
      beneficiaryType: '',
      beneficiaryTypeCheck: false,
      beneficiaryTypeErrMsg: '',
      beneficiaryTypeData: {},
      isBeneficiaryTypeDisabled: false,
      status: true,
      dataFieldsError: false,
      countryList: [],
      confirmDelete: false,
      modalMessage: '',
      createnationalityrestriction: false,
      clearDisabled:false,
      fromAction: '',
      loading: true,
      loaderMsg: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      shownogeneralrules: false,
      apiErrMsg:'',
      snackbar:false,
      snackbarMessage:'',
      notificationType: 'success',
    }
    // this.handleClose = this.handleClose.bind(this);
    // this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    let customerTypeData = {};
    let beneficiaryTypeData = {};

    if (this.props.ruledefaultvalue.customerType == 'INDIVIDUAL') {
      customerTypeData = { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }
    }
    else if (this.props.ruledefaultvalue.customerType == 'CORPORATE') {
      customerTypeData = { 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' };
    }
    else {
      customerTypeData = { 'id': 3, 'label': 'Both', 'value': 'BOTH' };
    }

    if (this.props.ruledefaultvalue.beneficiaryType == 'INDIVIDUAL') {
      beneficiaryTypeData = { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }
    }
    else if (this.props.ruledefaultvalue.beneficiaryType == 'CORPORATE') {
      beneficiaryTypeData = { 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' };
    }
    else {
      beneficiaryTypeData = { 'id': 3, 'label': 'Both', 'value': 'BOTH' };
    }

    if (this.props.isOpen) {
      this.setState({
        customerType: this.props.ruledefaultvalue.customerType,
        beneficiaryType: this.props.ruledefaultvalue.beneficiaryType,
        isCustomerTypeDisabled: this.props.ruledefaultvalue.isCustomerTypeDisabled,
        isBeneficiaryTypeDisabled: this.props.ruledefaultvalue.isBeneficiaryTypeDisabled,
        customerTypeData: customerTypeData,
        beneficiaryTypeData: beneficiaryTypeData
      }, () => {
        this.handleOpen();
        this.fetchCountryList();
        this.handleSaveEnable();
        this.handleClearEnable();
        this.handleEscape();
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
          alert('no country records');
          this.setState({snackbar:false},()=>{
            this.setState({snackbar:true,snackbarMessage:'No country Records found',notificationType: 'warning'})
          })
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
    }
  }

  handleClose = () => {
    this.setState({ confirmDelete: false, modalMessage: '' }, () => {
      let countryLength = (this.state.country == undefined) ? 0 : this.state.country.length;
      let beneficiaryTypeLength = (this.state.beneficiaryType == undefined) ? 0 : this.state.beneficiaryType.length;
      let customerType = (this.state.customerType == undefined) ? 0 : this.state.customerType.length;
      if (countryLength > 0 || ((customerType > 0) && (this.state.isCustomerTypeDisabled == false)) || ((beneficiaryTypeLength > 0) && (this.state.isBeneficiaryTypeDisabled == false)) || Object.keys(this.state.countryData).length > 0) {
        this.setState({ confirmDelete: true, fromAction: 'close', modalMessage: 'This will clear all data. Are you sure you want to continue?' })
      }
      else {
        this.setState({ confirmDelete: false }, () => {
          this.props.modalAction(null, 'close');
        })
      }
    })
  };

  handleClear = () => {
    this.setState({ confirmDelete: false, modalMessage: '' }, () => {
      let countryLength = (this.state.country == undefined) ? 0 : this.state.country.length;
      let beneficiaryTypeLength = (this.state.beneficiaryType == undefined) ? 0 : this.state.beneficiaryType.length;
      let customerType = (this.state.customerType == undefined) ? 0 : this.state.customerType.length;
      if (countryLength > 0 || ((customerType > 0) && (this.state.isCustomerTypeDisabled == false)) || ((beneficiaryTypeLength > 0) && (this.state.isBeneficiaryTypeDisabled == false)) || Object.keys(this.state.countryData).length) {
        this.setState({ confirmDelete: true, fromAction: 'clear', modalMessage: 'This will clear all data. Are you sure you want to continue?' })
      }
    })
  }

  handleClearEnable = () => {
    if ((Object.keys(this.state.customerTypeData).length > 0 && this.state.isCustomerTypeDisabled==false)
    || (Object.keys(this.state.beneficiaryTypeData).length > 0 && this.state.isBeneficiaryTypeDisabled == false)
     || (Object.keys(this.state.countryData).length > 0)) {
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

  onChange = (e) => {
    console.log(e.target.id, e.target.checked);
    switch (e.target.id) {
      case ('status'):
      this.setState({ status: e.target.checked }, () => {
        this.setState({snackbar:false},()=>{
          if(this.state.status == false){
            this.setState({snackbar:true,snackbarMessage:'This Rule will be disabled',notificationType:'warning'})
          }
        })
      });
      break;
    }
  }

  handleData = () => {
    if (Object.keys(this.state.customerTypeData).length == 0 || Object.keys(this.state.beneficiaryTypeData).length == 0 || Object.keys(this.state.countryData).length == 0) {
      this.setState({ dataFieldsError: true });
    }
    else {
      var nationalityrestriction = {};
      nationalityrestriction.beneficiaryType = this.state.beneficiaryTypeData.value;
      nationalityrestriction.customerType = this.state.customerTypeData.value;
      if (Object.keys(this.state.countryData).length > 0) {
        nationalityrestriction.country = {};
        nationalityrestriction.country.id = this.state.countryData.id;
        nationalityrestriction.country.name = this.state.countryData.name;
      }
      nationalityrestriction.status = (this.state.status == true) ? 'ENABLED' : 'DISABLED';
      this.setState({ dataFieldsError: false }, () => {
        this.props.modalAction(nationalityrestriction, 'close');
      })
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
        country: undefined,
        countryData: {},
        status: true,
        confirmDelete: false,
        countryCheck: false,
        agentCountryCheck: false,
        clearDisabled:false,
        snackbar: false,
      }, () => {
        (this.state.isCustomerTypeDisabled == false) ? (this.setState({ customerType: undefined, customerTypeData:{},customerTypeCheck:false })) : this.setState({ confirmDelete: false });
        (this.state.isBeneficiaryTypeDisabled == false) ? (this.setState({ beneficiaryType: undefined, beneficiaryTypeData:{},beneficiaryTypeCheck:false })) : this.setState({ confirmDelete: false });
        this.handleSaveEnable();
        this.handleClearEnable();
      })
    }
    else {
      this.setState({ confirmDelete: true }, () => {
      });
    }
  }

  handleChange = (e, id) => {
    console.log(e, id);
    switch (id) {
      case 'allowed customer type':
        this.setState({ customerType: e, customerTypeCheck: false }, () => {
          if (this.state.customerType == undefined) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'CustomerType cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.customerType.length == 0) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'CustomerType cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.customerType.length > 0){
            selectLabels.map((obj)=>{
              if(this.state.customerType == obj.value){
                this.setState({customerType:obj.value,customerTypeData:obj,customerTypeCheck:false},()=>{
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
      case 'allowed beneficiary type':
        this.setState({ beneficiaryType: e, beneficiaryTypeCheck: false }, () => {
          if (this.state.beneficiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.beneficiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.beneficiaryType.length > 0){
            selectLabels.map((obj)=>{
              if(this.state.beneficiaryType == obj.value){
                this.setState({beneficiaryType:obj.value,beneficiaryTypeData:obj,beneficiaryTypeCheck:false},()=>{
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
      case 'country':
        this.setState({ country: e, countryCheck: false }, () => {
          if (this.state.country == undefined) {
            this.setState({ countryCheck: true, countryerrMsg: 'Country cannot be empty', countryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.country.length == 0) {
            this.setState({ countryCheck: true, countryerrMsg: 'Country cannot be empty', countryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if(this.state.country.length > 0){
            this.state.countryList.map((obj)=>{
              if(this.state.country == obj.value){
                this.setState({country:obj.value,countryData:obj,countryCheck:false},()=>{
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
      case 'allowed customer type':
        this.setState({ customerTypeData: {} }, () => {
          let value = e.value;
          this.setState({ customerTypeData: e, customerType: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
        break;
      case 'allowed beneficiary type':
        this.setState({ beneficiaryTypeData: {} }, () => {
          let value = e.value;
          this.setState({ beneficiaryTypeData: e, beneficiaryType: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
        break;
      case 'country':
        this.setState({ countryData: {} }, () => {
          let value = e.value;
          this.setState({ countryData: e, country: value }, () => {
            this.handleSaveEnable();
            this.handleClearEnable();
          })
        })
        break;
    }
  }

  handleBlur = (e) => {
    // console.log(e.target.id);
    switch (e.target.id) {
      case 'allowed customer type':
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
      case 'allowed beneficiary type':
        this.setState({ beneficiaryTypeCheck: false }, () => {
          if (this.state.beneficiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.beneficiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
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
      case 'country':
        this.setState({ countryCheck: false }, () => {
          if (this.state.country == undefined) {
            this.setState({ countryCheck: true, countryerrMsg: 'Country cannot be empty', countryData: {} }, () => {
              this.handleSaveEnable();
              this.handleClearEnable();
            })
          }
          else if (this.state.country.length == 0) {
            this.setState({ countryCheck: true, countryerrMsg: 'Country cannot be empty', countryData: {} }, () => {
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
    if (Object.keys(this.state.customerTypeData).length == 0 || Object.keys(this.state.beneficiaryTypeData).length == 0 || Object.keys(this.state.countryData).length == 0) {
      this.setState({ createnationalityrestriction: true })
    }
    else {
      this.setState({ createnationalityrestriction: false })
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
                              {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} /> */}
                              <IconButton style={{ height: 36, width: 36 }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <Grid container direction="row" justify="space-between" spacing={24}>
                      <Grid item xs={12}>
                        <h3 className="global-font title-margin">Nationality Restriction</h3>
                      </Grid>
                      {
                        this.state.dataFieldsError ?
                          <Grid container direction="row" justify="center" alignItems="center" spacing={24}>
                            <Grid item xs={2}>
                              <span className="errorMessage">Fill all fields correctly</span>
                            </Grid>
                          </Grid> : ''
                      }
                      <Grid className="grid-margin-bottom grid-error" item xs={6}>
                        {/* <Regularselect InputLabel={"Customer Type"} value={this.state.customerType} type='allowed customer type' selectLabels={selectLabels} placeholder={'Customer Type'} getSelectValue={this.handleChange} disabled={this.state.isCustomerTypeDisabled} /> */}
                        <Selectable
                          id="allowed customer type"
                          isRequired
                          searchable={true}
                          label='Customer Type'
                          value={this.state.customerType}
                          options={selectLabels}
                          noResultsText="No Customer Type Found"
                          searchBy={'label'}
                          placeholder={'Customer Type'}
                          onChange={(e) => this.handleChange(e, 'allowed customer type')}
                          isEnabled={!this.state.isCustomerTypeDisabled}
                          onValueClick={(e) => this.handleValueClick(e, 'allowed customer type')}
                          onBlur={this.handleBlur}
                        />
                        {this.state.customerTypeCheck ? <span className="errorMessage">{this.state.customerTypeErrMsg} </span> : ''}
                      </Grid>
                      <Grid className="grid-margin-bottom grid-error" item xs={6}>
                        {/* <Regularselect InputLabel={"Beneficiary Type"} value={this.state.beneficiaryType} type='allowed beneficiary type' disabled={this.state.isBeneficiaryTypeDisabled} selectLabels={selectLabels} placeholder={'Allowed Beneficiary Type'} getSelectValue={this.handleChange} /> */}
                        <Selectable
                          id="allowed beneficiary type"
                          isRequired
                          searchable={true}
                          label='Beneficiary Type'
                          value={this.state.beneficiaryType}
                          options={selectLabels}
                          noResultsText="No Beneficiary Type Found"
                          searchBy={'label'}
                          placeholder={'Beneficiary Type'}
                          onChange={(e) => this.handleChange(e, 'allowed beneficiary type')}
                          isEnabled={!this.state.isBeneficiaryTypeDisabled}
                          onValueClick={(e) => this.handleValueClick(e, 'allowed beneficiary type')}
                          onBlur={this.handleBlur}
                        />
                        {this.state.beneficiaryTypeCheck ? <span className="errorMessage">{this.state.beneficiaryTypeErrMsg} </span> : ''}
                      </Grid>
                      <Grid className="grid-margin-bottom grid-error" item xs={6}>
                        {/* <DownshiftMultiple value={this.state.country} label='Country' type='country' suggestionFields={this.state.countryList} placeholder={'Country'} getAutoSelectValue={this.handleChange} getHandleBlurValue={this.handleBlur} /> */}
                        <Selectable
                          id="country"
                          isRequired
                          searchable={true}
                          value={this.state.country}
                          options={this.state.countryList}
                          noResultsText="No Country Found"
                          searchBy={'label'}
                          placeholder={'Country'}
                          onChange={(e) => this.handleChange(e, 'country')}
                          onValueClick={(e) => this.handleValueClick(e, 'country')}
                          onBlur={this.handleBlur}
                        />
                        {this.state.countryCheck ? <span className="errorMessage">{this.state.countryerrMsg} </span> : ''}
                      </Grid>
                    </Grid>
                    <Grid className="grid-margin-bottom global-font" item xs={12}>
                      <p className="toggle-alignment"><b>Status :</b> Disable </p>
                      <div className="toggle-alignment">
                        <Toggle isChecked={this.state.status} id={'status'} isEnabled={true} onChange={this.onChange} />
                      </div>
                      <p className="toggle-alignment">Enable</p>
                    </Grid>
                    <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                      <Grid item xs={4}>
                        <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                          <TextButton isEnabled={this.state.clearDisabled} style={{ color: "#888888", fontSize: 18,fontWeight:500, fontFamily:"Gotham-Rounded"}} onClick={this.handleClear} >Clear</TextButton>
                          <TextButton isEnabled={!this.state.createnationalityrestriction} style={{ color: "#19ace3",fontWeight:500,fontSize: 18,fontFamily:"Gotham-Rounded"}} onClick={this.handleData} >Save</TextButton>
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
            }
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

DraweeBankCreateNationalityModel.propTypes = {
  classes: PropTypes.object.isRequired,
};
const DraweeBankCreateNationalityModelPopup = withStyles(styles)(DraweeBankCreateNationalityModel);

export default DraweeBankCreateNationalityModelPopup;
