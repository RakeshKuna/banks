import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
// import Toggleswitch from '../container/Toggleswitch';
import { Toggle, OutLineButton, Notifications, Selectable, IconButton, TextButton } from 'finablr-ui';
import Close from '@material-ui/icons/Close';
import ModalBox from './../component/Modalbox';
import Snackbarcomp from './../component/snackbar';
import Loader from '../component/Loader';
import getMuiTheme from "../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as ApiService from './ApiService';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from './../config/config';
import * as Exceptionhandler from '../ExceptionHandling';

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

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    overflowY: 'scroll',
    overflowX: 'hidden'
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
    margin: '3% 5%',
    padding: '10px 20px',
    fontSize: 16,
    border: '1px solid #19ace3 !important',
    color: "#19ace3",
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

class DraweeBankEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      status: true,
      prevStatus: false,
      fromAction: '',
      deleted: false,
      bankDetails: {},
      confirmDelete: false,
      actionType: '',
      modalMessage: '',
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      loading: false
    }
    // this.handleClose = this.handleClose.bind(this);
    // this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.handleOpen();
      this.fetchBankDetails(this.props.editDraweeBankcode);
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
      if(this.state.confirmDelete){
        this.setState({confirmDelete:false})
      }
      else{
        this.handleCloseModal();
      }
     }
   };
 }

  fetchBankDetails = (bankcode) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true },()=>{
        ApiService.fetchBankDetails(bankcode,headers)
        .then(response => {
          this.setState({ bankDetails: response.data, deleted: response.data.deleted, loading: false }, () => {
            if (response.data.status == 'ENABLED') {
              this.setState({ status: true, prevStatus: true })
            }
            else {
              this.setState({ status: false, prevStatus: false })
            }
          })
        })
        .catch(error => {
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
      });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ actionType: 'Yes', confirmDelete: false, modalMessage: '' }, () => {
      setTimeout=()=>{
      if (this.state.status == this.state.prevStatus) {
        this.handleModalResponse(true);
      }
      else {
        this.setState({ confirmDelete: true, actionType: 'Yes', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
      }
    }
    if (this.state.status == this.state.prevStatus) {
      this.handleModalResponse(true);
    }
    else {
      this.setState({ confirmDelete: true, actionType: 'Yes', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
    }
    })
  };

  handleData = (type) => {
    this.setState({ confirmDelete: false, actionType: '', modalMessage: '' }, () => {
      switch (type) {
        case 'submit':
          this.setState({ confirmDelete: false, actionType: '', modalMessage: '' }, () => {
            var bankData = {};
            bankData.id = this.props.editDraweeBankcode;
            bankData.status = this.state.status;
            bankData.deleted = this.state.deleted;
            this.props.modalEditAction(bankData, 'close','submit');
          })
          break;
        case 'delete':
          this.setState({ confirmDelete: true, actionType: 'Delete', modalMessage: ' Are you sure you want to permanently delete this bank? All Profiles created under it will be removed...' });
          break;
      }
    })
  }

  handleModalResponse = (data) => {
    console.log(data);
    if (data == true) {
      if (this.state.actionType == 'Yes') {
        var prevStatus = this.state.prevStatus;
        this.setState({ status: prevStatus, confirmDelete: false, actionType: '' }, () => {
          this.props.modalEditAction(null, 'close','close');
        })
      }
      else if (this.state.actionType == 'Delete') {
        this.setState({ confirmDelete: true, actionType: 'Delete' }, () => {
          var bankData = {};
          bankData.id = this.props.editDraweeBankcode;
          bankData.status = 'DISABLED';
          bankData.deleted = true;
          this.props.modalEditAction(bankData, 'close','delete');
        })
      }
    }
    else {
      this.setState({ confirmDelete: false, actionType: '' });
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
        //     this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'This bank will be disabled' })
        //   }
        // })
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

  handleCloseModal = () => {
    if(this.state.confirmDelete){
      this.setState({confirmDelete:false})
    }
    else{
      this.handleClose(null, 'close');
    }
  };
  
  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={getMuiTheme}>
        <div>
          {
            this.state.loading ? <Loader /> :

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
                   
                     <Grid item xs={12}>
                      <h3 className="global-font title-margin title-padding">Drawee Bank Details</h3>
                      </Grid>
                      <Grid container direction="row" justify="space-between" xs={12}>
                        <Grid item xs={4}>
                          <p className="bank-profile-detail-view">Bank Name</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.bankName}</p>
                        </Grid>
                        <Grid item xs={4}>
                          <p className="bank-profile-detail-view">Service Provider</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.serviceProviderCode}</p>
                        </Grid>
                        <Grid  item xs={4}>
                          <p className="bank-profile-detail-view">Country</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.country}</p>
                        </Grid>
                      </Grid>
                      <Grid container direction="row" justify="space-between">
                        <Grid className="global-font" item xs={6}>
                          <p className="toggle-alignment"><b>Status :</b> Disable </p>
                          <div className="toggle-alignment">
                            <Toggle isChecked={this.state.status} id={'status'} isEnabled={true} onChange={this.onChange} />
                          </div>
                          <p className="toggle-alignment">Enable</p>
                        </Grid>
                      </Grid>
                      <Grid container direction="row" justify="space-between" >
                        <Grid item xs={4}>
                          <OutLineButton color="#000" className={classes.button} onClick={() => this.handleData('delete')}>Permanently Delete</OutLineButton>
                        </Grid>
                        <Grid item xs={4}>
                          <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                            <Grid item xs={3}>
                              <TextButton
                                style={{ color: '#19ace3' }}
                                onClick={() => this.handleData('submit')}>
                                <span className="saveBtn">Save</span>
                              </TextButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    
                    <DraweeBankEditModalPopup />
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
          }
          {
            this.state.confirmDelete ? <ModalBox isOpen={this.state.confirmDelete} actionType={this.state.actionType} message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

DraweeBankEditModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DraweeBankEditModalPopup = withStyles(styles)(DraweeBankEditModal);

export default DraweeBankEditModalPopup;