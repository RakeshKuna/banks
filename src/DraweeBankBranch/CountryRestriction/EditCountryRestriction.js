import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import ModalBox from '../../component/Modalbox';
import Loader from '../../component/Loader';
import * as ApiService from './ApiService';
import * as Exceptionhandler from '../../ExceptionHandling';
import Regularselect from './../../container/Regularselect';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import getMuiTheme from "../../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { FloatButton,IconButton, Toggle, TextButton, Notifications } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import { Selectable } from 'finablr-ui';
import ErrorModalBox from '../../component/ErrorModalbox';
import EmptyListComponent from '../../component/EmptylistComponent';
import * as config from '../../config/config';

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

const selectLabels = [{ 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' }, { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }, { 'id': 3, 'label': 'Both', 'value': 'BOTH' }];

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

class EditCountryRestrictionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      status: true,
      prevStatus: false,
      deleted: false,
      countryDetails: {},
      customerType: '',
      customerTypeData:{},
      beneficiaryTypeData:{},
      prevcustomerType: '',
      benificiaryType: '',
      prevbenificiaryType: '',
      confirmDelete: false,
      actionType: '',
      modalMessage: '',
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      loading: true,
      agentBranchesList: [],
      custTypeCountryArr: [],
      prevcustTypeCountryArr: [],
      isCustomerTypeDisabled: false,
      isBeneficiaryTypeDisabled: false,
      beneficiaryTypeCheck: false,
      beneficiaryTypeerrMsg: '',
      customerTypeCheck: false,
      customerTypeErrMsg: '',
      ruleId: null,
      loaderMessage: 'Retrieving Data',
      agentBranchesDisabled: false,
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
    //console.log(this.props);
    this.handleOpen();
    this.fetchCountryRestrictions(this.props.editCountryRestriction);
    this.fetchAgentBranchesList(this.props.editingAgentId);
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


  fetchCountryRestrictions = (countryrestrictioncode) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiService.getCountryRestrictionDetails(this.props.draweebankProfilebranchid, countryrestrictioncode,headers)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              //console.log(response);
              this.setState({ ruleId: response.data.id, countryDetails: response.data, customerType: response.data.customerType, prevcustomerType: response.data.customerType, benificiaryType: response.data.beneficiaryType, prevbenificiaryType: response.data.beneficiaryType, deleted: response.data.deleted }, () => {
                if (response.data.agentBranches !== null) {
                  if (response.data.agentBranches.length > 0) {
                    let custTypeCountryArr = []
                    response.data.agentBranches.map((obj, index) => {
                      let item = {};
                      item.id = obj.id;
                      item.label = obj.branchName;
                      item.field = obj.branchName;
                      custTypeCountryArr.push(item);
                    })
                    this.setState({ custTypeCountryArr, prevcustTypeCountryArr: custTypeCountryArr });
                  }
                }
                if(this.state.customerType == 'CORPORATE'){
                  this.setState({customerTypeData:{ 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' }})
                }
                if(this.state.customerType == 'INDIVIDUAL'){
                  this.setState({customerTypeData:{ 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }})
                }
                if(this.state.customerType == 'BOTH'){
                  this.setState({customerTypeData:{ 'id': 3, 'label': 'Both', 'value': 'BOTH' }})
                }
                if(this.state.benificiaryType == 'CORPORATE'){
                  this.setState({beneficiaryTypeData:{ 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' }})
                }
                if(this.state.benificiaryType == 'INDIVIDUAL'){
                  this.setState({beneficiaryTypeData:{ 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }})
                }
                if(this.state.benificiaryType == 'BOTH'){
                  this.setState({beneficiaryTypeData:{ 'id': 3, 'label': 'Both', 'value': 'BOTH' }})
                }
                if (response.data.status == 'ENABLED') {
                  this.setState({ status: true, prevStatus: true })
                }
                else {
                  this.setState({ status: false, prevStatus: false })
                }
              })
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
              this.setState({snackbar:false}, () => {
                this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
              })
            }
            else {
              this.setState({ loading: false, serverError: false, confirmStatus: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      });
    }
  }

  fetchAgentBranchesList = (agentId) => {
    let agentBranchesList = [];
    if (agentId == 0) {
      this.setState({loading:false, snackbar: true, notificationType: 'warning', snackbarMessage: 'No agent branches records found', agentBranchesDisabled: true });
    }
    else {
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        ApiService.fetchAgentBranchesList(agentId,headers).then((response) => {
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let branch = {};
              branch.id = obj.id;
              branch.label = obj.branchName;
              branch.field = obj.branchDisplayName;
              agentBranchesList.push(branch);
            })
            this.setState({ agentBranchesList, loading:false });
          }
          else {
            this.setState({loading:false, snackbar: true, notificationType: 'warning', snackbarMessage: 'No agent branches records found', agentBranchesDisabled: true });
          }
        }).catch(error => {
          // this.setState({loading:false});
          // alert('oops error in api call');
          // throw (error)
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
            this.setState({snackbar:false}, () => {            
              this.setState({ loading: false,snackbar: true, notificationType: 'error', snackbarMessage: Exceptionhandler.throwErrorType(error).message, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            })
          }
          else {
            this.setState({ loading: false, serverError: false, confirmStatus: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
          }
        });
      }
    }
  }

  handleData = () => {
    this.setState({ confirmDelete: false, actionType: '', modalMessage: '' }, () => {
      let data = {};
      data.customerType = this.state.customerType;
      data.beneficiaryType = this.state.benificiaryType;
      data.status = (this.state.status == true) ? 'ENABLED' : 'DISABLED';
      data.id = this.state.ruleId;
      data.agentBranch = [];
      if (this.state.custTypeCountryArr.length > 0) {
        this.state.custTypeCountryArr.map((obj) => {
          let branchObj = {};
          branchObj.id = obj.id;
          branchObj.branchName = obj.label;
          data.agentBranch.push(branchObj);
        })
      }
      else {
        data.agentBranch = [];
      }
      this.props.modalEditAction(data, 'save');
    })
  }
  
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ actionType: 'Yes', confirmDelete: false, modalMessage: '' }, () => {
      if ((this.state.status !== this.state.prevStatus) || (this.state.customerType !== this.state.prevcustomerType) || (this.state.benificiaryType !== this.state.benificiaryType)) {
        this.setState({ confirmDelete: true, actionType: 'Yes', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
      }
      else {
        this.handleModalResponse(true);
      }
    })
  };

  handleSaveEnable = () => {
    if (Object.keys(this.state.customerTypeData).length == 0 || Object.keys(this.state.beneficiaryTypeData).length == 0 ) {
      this.setState({ isSaveEnabled: false })
    }
    else {
      this.setState({ isSaveEnabled: true })
    }
  }

  handleChange = (data, id) => {
    switch (id) {
      case ('allowedCustomerType'):
        this.setState({ customerType: data, customerTypeCheck: false }, () => {
          if (this.state.customerType == undefined) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'Customer Type cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.customerType.length == 0) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'Customer Type cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if(this.state.customerType.length > 0){
            selectLabels.map((obj)=>{
              if(this.state.customerType == obj.value){
                this.setState({ customerTypeData: obj, customerType: obj.value }, () => {
                  this.handleSaveEnable();
                })
              }
            })
          }
          else {
            this.handleSaveEnable();
          }
        });
      break;
      case ('allowedBeneficiaryType'):
        this.setState({ benificiaryType: data, agentCountryCheck: false }, () => {
          if (this.state.benificiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.benificiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if(this.state.benificiaryType.length > 0){
            selectLabels.map((obj)=>{
              if(this.state.benificiaryType == obj.value){
                this.setState({ beneficiaryTypeData: obj, benificiaryType: obj.value }, () => {
                  this.handleSaveEnable();
                })
              }
            })
          }
          else {
            this.handleSaveEnable();
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
          })
        });
      break;
      case 'allowedBeneficiaryType':
        this.setState({ beneficiaryTypeData: {} }, () => {
          let value = obj.value;
          this.setState({ beneficiaryTypeData: obj, benificiaryType: value }, () => {
            this.handleSaveEnable();
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
            })
          }
          else if (this.state.customerType.length == 0) {
            this.setState({ customerTypeCheck: true, customerTypeErrMsg: 'Customer type cannot be empty', customerTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
          }
        })
      break;
      case 'allowedBeneficiaryType':
        this.setState({ beneficiaryTypeCheck: false }, () => {
          if (this.state.benificiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.benificiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary Type cannot be empty', beneficiaryTypeData: {} }, () => {
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

  onChange = (e) => {
    console.log(e.target.id, e.target.checked);
    let isChecked = e.target.checked;
    switch (e.target.id) {
      case ('status'):
      this.setState({ status: e.target.checked }, () => {
        this.setState({snackbar:false},()=>{
          if(this.state.status == false){
            this.setState({snackbar:true,snackbarMessage:'This Country  Restriction will be disabled',notificationType:'warning'})
          }
        })
      });
        // this.setState({ snackbar: false, status: e.target.checked }, () => {
        //   if (isChecked == true) {
        //     this.setState({ snackbar: false, snackbarMessage: '' })
        //   }
        //   else {
        //     this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'This Country  Restriction will be disabled' })
        //   }
        // })
        break;
    }
  }

  handleModalResponse = (data) => {
    if (data == true) {
      if (this.state.actionType == 'Yes') {
        let prevStatus = this.state.prevStatus;
        let prevcustomerType = this.state.prevcustomerType;
        let prevbenificiaryType = this.state.prevbenificiaryType;
        let prevcustTypeCountryArr = this.state.prevcustTypeCountryArr;
        this.setState({ status: prevStatus, confirmDelete: false, actionType: '', customerType: prevcustomerType, benificiaryType: prevbenificiaryType, custTypeCountryArr: prevcustTypeCountryArr }, () => {
          this.props.modalEditAction(null, 'close');
        })
      }
    }
    else {
      this.setState({ confirmDelete: false, actionType: '' });
    }
  }

  handleChangeCustAgentBranch = (data) => {
    this.setState({ custTypeCountryArr: data })
  }

  handleViewCustAgentBranchValues = (data) => {
    this.setState({ custTypeCountryArr: data })
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
                <Loader action={this.state.loaderMessage} />
                :
                <div className="modal-card-y-scroll">
                  <div style={getModalStyle()} className={classes.paper}>
                    <div className="modal-card-header">
                      <div className="modal-card-header-content">
                        <Grid container spacing={12}>
                          <Grid item xs={6}>
                            <h3 className="screenTitle">Edit</h3>
                          </Grid>
                          <Grid item xs={6}>
                            <Grid direction="column" alignItems="flex-end" container spacing={12}>
                              {/* <Fab size="small" color="secondary" aria-label="Add" className={classes.fab} onClick={() => this.handleClose()}>
                                <Close />
                              </Fab> */}
                              {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={() => this.handleClose()} /> */}
                              <IconButton style={{ height: 36, width: 36 }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <Grid container direction="row" justify="space-between" spacing={24}>
                      <Grid item xs={12}>
                      <h3 className="global-font title-margin ">Country Restriction</h3>
                      </Grid>
                      </Grid>
                      <Grid container direction="row" justify="space-between" spacing={24}>
                        {
                          (this.props.ruledefaultvalue.customerType == 'BOTH') ?
                            <Grid item xs={4} className="grid-margin grid-error">
                              {/* <Regularselect InputLabel={"Customer Type"} value={this.state.customerType} type='allowed customer type' selectLabels={selectLabels} placeholder={'Customer Type'} getSelectValue={this.handleChange} /> */}
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
                              {this.state.customerTypeCheck ? <span className="errorMessage-add">{this.state.customerTypeErrMsg} </span> : ''}
                            </Grid> :
                            <Grid item xs={4} className="grid-margin">
                              <p className="bank-profile-detail-view">Allowed Customer Type</p>
                              <p className="bank-profile-detail">{this.state.countryDetails.customerType}</p>
                            </Grid>
                        }

                        {
                          (this.props.ruledefaultvalue.beneficiaryType == 'BOTH') ?
                            <Grid item xs={4} className="grid-margin">
                              {/* <Regularselect InputLabel={"Beneficiary Type"} value={this.state.benificiaryType} type='allowed beneficiary type' selectLabels={selectLabels} placeholder={'Beneficiary Type'} getSelectValue={this.handleChange} /> */}
                              <Selectable
                                id="allowedBeneficiaryType"
                                ref="Selectable"
                                label="Beneficiary Type"
                                isRequired
                                searchable={true}
                                isCreatable={false}
                                isClearable={true}
                                value={this.state.benificiaryType}
                                options={selectLabels}
                                noResultsText="No Beneficiary Type Found"
                                searchBy={'any'}
                                placeholder={'Beneficiary Type'}
                                onChange={(e) => this.handleChange(e, 'allowedBeneficiaryType')}
                                onValueClick={(e) => this.handleValueClick(e, 'allowedBeneficiaryType')}
                                onBlur={this.handleBlur}
                                isEnabled={!this.state.isBeneficiaryTypeDisabled}
                              />
                              {this.state.beneficiaryTypeCheck ? <span className="errorMessage">{this.state.beneficiaryTypeerrMsg} </span> : ''}
                            </Grid> :
                            <Grid item xs={4} className="grid-margin">
                              <p className="bank-profile-detail-view">Allowed Beneficiary Type</p>
                              <p className="bank-profile-detail">{this.state.countryDetails.beneficiaryType}</p>
                            </Grid>
                        }
                        <Grid item xs={4} className="grid-margin">

                        </Grid>
                        <Grid item xs={4} className="grid-margin">
                          <p className="bank-profile-detail-view">Agent Source Country</p>
                          <p className="bank-profile-detail">{(this.state.countryDetails.country == null) ? '--' : this.state.countryDetails.country.name}</p>
                        </Grid>
                        <Grid item xs={4} className="grid-margin">
                          <p className="bank-profile-detail-view">Agent</p>
                          <p className="bank-profile-detail">{this.state.countryDetails.agent ? this.state.countryDetails.agent : '--'}</p>
                        </Grid>
                        <Grid item xs={4} className="grid-margin">
                          <p className="bank-profile-detail-view">Destination Country</p>
                          <p className="bank-profile-detail">{(this.state.countryDetails.destinationCountry == null) ? '--' : this.state.countryDetails.destinationCountry.name}</p>
                        </Grid>
                        <Grid item xs={6}>
                          <MultiSelectTextField value={this.state.custTypeCountryArr} label='Agent Branches' MultiSelectText='Agent Branches' type='agentbranches' suggestionFields={this.state.agentBranchesList} placeholder={'Agent Branches'} getAutoSelectValue={this.handleChangeCustAgentBranch} getViewValues={this.handleViewCustAgentBranchValues} disabled={this.state.agentBranchesDisabled} />
                        </Grid>
                        <Grid className="global-font" item xs={12}>
                          <p className="toggle-alignment"><b>Status :</b> Disable </p>
                          <div className="toggle-alignment">
                            <Toggle isChecked={this.state.status} id={'status'} isEnabled={true} onChange={this.onChange} />
                          </div>
                          <p className="toggle-alignment">Enable</p>
                        </Grid>
                      </Grid>
                    
                    <Grid container spacing={24} direction="row" justify="space-between" >
                      <Grid item xs={12}>
                        <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-end">
                          <TextButton style={{ color: "#19ace3",fontSize: 18,fontFamily:"Gotham-Rounded" }} 
                          onClick={this.handleData} >
                          <span className="saveBtn">Save</span>
                          </TextButton>
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
            this.state.confirmDelete ? <ModalBox isOpen={this.state.confirmDelete} actionType={this.state.actionType} message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
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

EditCountryRestrictionModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const EditCountryRestrictionModalPopup = withStyles(styles)(EditCountryRestrictionModal);

export default EditCountryRestrictionModalPopup;
