import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import ModalBox from '../../component/Modalbox';
import * as ApiService from './ApiService';
import * as Exceptionhandler from '../../ExceptionHandling';
import getMuiTheme from "../../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Selectable, Toggle, TextButton, FloatButton,IconButton, Notifications } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
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

const selectLabels = [{ 'id': 1, 'label': 'CORPORATE', 'value': 'CORPORATE' }, { 'id': 2, 'label': 'INDIVIDUAL', 'value': 'INDIVIDUAL' }, { 'id': 3, 'label': 'BOTH', 'value': 'BOTH' }];

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

class DraweeBankEditNationalityRestrictionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      status: true,
      prevStatus: false,
      deleted: false,
      countryDetails: {},
      confirmDelete: false,
      actionType: '',
      modalMessage: '',
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      loading: false,
      customerType: '',
      customerTypeData: {},
      customerTypeCheck: false,
      isCustomerTypeDisabled: false,
      customerTypeErrMsg: '',
      prevcustomerType: '',
      beneficiaryType: '',
      beneficiaryTypeErrMsg: '',
      prevbeneficiaryType: '',
      isBeneficiaryTypeDisabled: false,
      beneficiaryTypeCheck: false,
      confirmDelete: false,
      beneficiaryTypeData: {},
      createnationalityrestriction: true,
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
    this.handleOpen();
    this.fetchCountryRestrictions(this.props.editingAgentId);
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
        ApiService.getNationalityRestrictionProfile(this.props.drweebankidd, countryrestrictioncode, headers)
          .then((response) => {
            if (response.status == 200) {
              let customerTypeData = {};
              let beneficiaryTypeData = {};
              if (response.data.customerType == 'INDIVIDUAL') {
                customerTypeData = { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }
              }
              if (response.data.customerType == 'CORPORATE') {
                customerTypeData = { 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' };
              }
              if (response.data.customerType == 'BOTH') {
                customerTypeData = { 'id': 3, 'label': 'Both', 'value': 'BOTH' };
              }
              if (response.data.beneficiaryType == 'INDIVIDUAL') {
                beneficiaryTypeData = { 'id': 2, 'label': 'Individual', 'value': 'INDIVIDUAL' }
              }
              if (response.data.beneficiaryType == 'CORPORATE') {
                beneficiaryTypeData = { 'id': 1, 'label': 'Corporate', 'value': 'CORPORATE' };
              }
              if (response.data.beneficiaryType == 'BOTH') {
                beneficiaryTypeData = { 'id': 3, 'label': 'Both', 'value': 'BOTH' };
              }
              this.setState({ ruleId: response.data.id, countryDetails: response.data, customerType: response.data.customerType, prevcustomerType: response.data.customerType, beneficiaryType: response.data.beneficiaryType, prevbeneficiaryType: response.data.beneficiaryType, deleted: response.data.deleted, loading: false, customerTypeData: customerTypeData, beneficiaryTypeData: beneficiaryTypeData }, () => {
                if (response.data.status == 'ENABLED') {
                  this.setState({ status: true, prevStatus: true })
                }
                else {
                  this.setState({ status: false, prevStatus: false })
                }
                this.handleSaveEnable();
              })
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 403) {
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

  handleData = (type) => {
    this.setState({ confirmDelete: false, actionType: '', modalMessage: '' }, () => {
      switch (type) {
        case 'submit':
          this.setState({ confirmDelete: false, actionType: '', modalMessage: '' }, () => {
            var bankData = {};
            bankData.customerType = this.state.customerTypeData.value;
            bankData.beneficiaryType = this.state.beneficiaryTypeData.value;
            bankData.status = (this.state.status == true) ? 'ENABLED' : 'DISABLED';
            bankData.id = this.props.editDraweeBankcode.id;
            bankData.status = this.state.status;
            this.props.modalEditAction(bankData, 'close');
          })
          break;
      }
    })
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ actionType: 'Yes', confirmDelete: false, modalMessage: '' }, () => {
      if ((this.state.status !== this.state.prevStatus) || (this.state.customerType !== this.state.prevcustomerType) || (this.state.beneficiaryType !== this.state.beneficiaryType)) {
        this.setState({ confirmDelete: true, actionType: 'Yes', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
      }
      else {
        this.handleModalResponse(true);
      }
    })
  };

  handleSaveEnable = () => {
    if (Object.keys(this.state.customerTypeData).length == 0 || Object.keys(this.state.beneficiaryTypeData).length == 0) {
      this.setState({ createnationalityrestriction: true })
    }
    else {
      this.setState({ createnationalityrestriction: false })
    }
  }

  onChange = (e) => {
    console.log(e.target.id, e.target.checked);
    let isChecked = e.target.checked;
    switch (e.target.id) {
      case ('status'):
        // this.setState({ snackbar: false, status: e.target.checked }, () => {
        //   if (isChecked == true) {
        //     this.setState({ snackbar: false, snackbarMessage: '' })
        //   }
        //   else {
        //     this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'This Nationality  Restriction will be disabled' })
        //   }
        // })
        this.setState({ status: e.target.checked }, () => {
          this.setState({snackbar:false},()=>{
            if(this.state.status == false){
              this.setState({snackbar:true,snackbarMessage:'This Nationality  Restriction will be disabled',notificationType:'warning'})
            }
          })
        });
        break;
    }
  }

  handleModalResponse = (data) => {
    if (data == true) {
      if (this.state.actionType == 'Yes') {
        let prevStatus = this.state.prevStatus;
        let prevcustomerType = this.state.prevcustomerType;
        let prevbeneficiaryType = this.state.prevbeneficiaryType;
        let prevcustTypeCountryArr = this.state.prevcustTypeCountryArr;
        this.setState({ status: prevStatus, confirmDelete: false, actionType: '', customerType: prevcustomerType, beneficiaryType: prevbeneficiaryType, custTypeCountryArr: prevcustTypeCountryArr }, () => {
          this.props.modalEditAction(null, 'close');
        })
      }
    }
    else {
      this.setState({ confirmDelete: false, actionType: '' });
    }
  }

  handleChange = (e, id) => {
    console.log(e, id);
    switch (id) {
      case 'allowed customer type':
        this.setState({ customerType: e, customerTypeCheck: false }, () => {
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
        });
        break;
      case 'allowed beneficiary type':
        this.setState({ beneficiaryType: e, beneficiaryTypeCheck: false }, () => {
          if (this.state.beneficiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.beneficiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else {
            this.handleSaveEnable();
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
          })
        })
        break;
      case 'allowed beneficiary type':
        this.setState({ beneficiaryTypeData: {} }, () => {
          let value = e.value;
          this.setState({ beneficiaryTypeData: e, beneficiaryType: value }, () => {
            this.handleSaveEnable();
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
      case 'allowed beneficiary type':
        this.setState({ beneficiaryTypeCheck: false }, () => {
          if (this.state.beneficiaryType == undefined) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
              this.handleSaveEnable();
            })
          }
          else if (this.state.beneficiaryType.length == 0) {
            this.setState({ beneficiaryTypeCheck: true, beneficiaryTypeErrMsg: 'Beneficiary type cannot be empty', beneficiaryTypeData: {} }, () => {
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
                        <h3 className="screenTitle">Edit</h3>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid direction="column" alignItems="flex-end" container spacing={12}>
                          {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={() => this.handleClose()} /> */}
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
                  </Grid>
                  <Grid container direction="row" justify="space-between" spacing={24}>
                    <Grid item xs={6}>
                      {
                        (this.props.ruledefaultvalue.customerType == 'BOTH') ?
                          <Grid item xs={6} className="grid-margin grid-error">
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
                            {this.state.customerTypeCheck ? <span className="errorMessage-add">{this.state.customerTypeErrMsg} </span> : ''}
                          </Grid> :
                          <Grid item xs={6} className="grid-margin">
                            <p className="bank-profile-detail-view">Customer Type</p>
                            <p className="bank-profile-detail">{this.state.countryDetails.customerType}</p>
                          </Grid>
                      }
                    </Grid>
                    <Grid item xs={6}>
                      {/* <p className="bank-profile-detail-view">Allowed Beneficiary Type</p>
                  <p className="bank-profile-detail">{this.state.countryDetails.beneficiaryType}</p> */}
                      {
                        (this.props.ruledefaultvalue.beneficiaryType == 'BOTH') ?
                          <Grid item xs={6} className="grid-margin grid-error">
                            <Selectable
                              id="allowed beneficiary type"
                              label='Beneficiary Type'
                              isRequired
                              searchable={true}
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
                            {this.state.beneficiaryTypeCheck ? <span className="errorMessage-add">{this.state.beneficiaryTypeErrMsg} </span> : ''}
                          </Grid> :
                          <Grid item xs={6} className="grid-margin">
                            <p className="bank-profile-detail-view">Beneficiary Type</p>
                            <p className="bank-profile-detail">{this.state.countryDetails.beneficiaryType}</p>
                          </Grid>
                      }
                    </Grid>
                    <Grid item xs={6}>
                      <p className="bank-profile-detail-view">Country</p>
                      <p className="bank-profile-detail">{(this.state.countryDetails.country == null) ? '--' : this.state.countryDetails.country.name}</p>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justify="space-between" spacing={24}>
                    <Grid className="global-font" item xs={6}>
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
                        <TextButton isEnabled={!this.state.createnationalityrestriction} style={{ color: "#19ace3",fontSize: 18,fontFamily:"Gotham-Rounded",marginBottom:20}} 
                        onClick={() => this.handleData('submit')} >
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
          </Modal>
          {
            this.state.confirmDelete ? <ModalBox isOpen={this.state.confirmDelete} actionType={this.state.actionType} message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
          }
        </div>
      }
      </MuiThemeProvider>
    );
  }
}

DraweeBankEditNationalityRestrictionModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DraweeBankEditNationalityRestrictionModalPopup = withStyles(styles)(DraweeBankEditNationalityRestrictionModal);

export default DraweeBankEditNationalityRestrictionModalPopup;
