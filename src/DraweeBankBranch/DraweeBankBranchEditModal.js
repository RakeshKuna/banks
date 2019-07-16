import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import ModalBox from './../component/Modalbox';
import ErrorModalBox from '../component/ErrorModalbox';
import { Input, OutLineButton, FloatButton, IconButton, TextButton, Toggle, Notifications } from 'finablr-ui';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import { MuiThemeProvider } from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme";
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as Exceptionhandler from './../ExceptionHandling';
import EmptyListComponent from '../component/EmptylistComponent';
import * as config from './../config/config';
import { Z_DEFAULT_STRATEGY } from 'zlib';

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

class DraweeBankBranchEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      setSpecificRate: true,
      prevStatus: false,
      deleted: false,
      bankDetails: {},
      confirmDelete: false,
      actionType: '',
      modalMessage: 'Are you sure you want to delete permanently?',
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      confirmStatus: false,
      apiErrMsg: '',
      permanentDelete: '',
      statusc: false,
      loaderMessage: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      status: true,
      confirmDelete: false,
      accountNumber: '',
      accountNumberCheck: false,
      accountNumberErrMsg: '',
      accountNumberDisabled: true,
      swiftCode: '',
      swiftCodeCheck: false,
      swiftCodeErrMsg: '',
      swiftcodeDisabled: true,
      status: true,
      isChanged:false
    }
  }

  handleStatusResponse = (data) => {
    if (data == true) {
      this.setState({ confirmStatus: false }, () => {
        // this.props.getOpenValue(false)
      });
    }
  }

  componentDidMount() {
    console.log(this.props);
    this.handleEscape();
    this.setState({ setSpecificRate: this.props.draweeProductDetails.uaexBankWiseRateCcy, status: (this.props.draweeProductDetails.status == 'ENABLED') ? true : false, swiftCode: this.props.draweeProductDetails.swiftCode, accountNumber: this.props.draweeProductDetails.accountNumber })
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

  handleClose = () => {
    console.log('exec');
    this.setState({ actionType: 'Yes', confirmDelete: false, modalMessage: '' }, () => {
      let accountNumberLen = (this.state.accountNumber == undefined || this.state.accountNumber == null || this.state.accountNumber == '') ? 0 : this.state.accountNumber.length;
      let swiftCodeLen = (this.state.swiftCode == undefined || this.state.swiftCode == null || this.state.swiftCode == '') ? 0 : this.state.swiftCode.length;
      setTimeout= () =>{
        if(this.state.isChanged == false){
          this.setState({ confirmDelete: false }, () => {
            this.props.modalEditAction(false);
          })
        }
        else if ((accountNumberLen > 0) || (swiftCodeLen > 0)) {
          this.setState({ confirmDelete: true, actionType: 'close', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
        }
        else {
          this.setState({ confirmDelete: false }, () => {
            this.props.modalEditAction(false);
          })
        }
      }
      if(this.state.isChanged == false){
        this.setState({ confirmDelete: false }, () => {
          this.props.modalEditAction(false);
        })
      }
      else if ((accountNumberLen > 0) || (swiftCodeLen > 0)) {
        this.setState({ confirmDelete: true, actionType: 'close', modalMessage: 'All changes will be lost. Are you sure you want to cancel?' })
      }
      else {
        this.setState({ confirmDelete: false }, () => {
          this.props.modalEditAction(false);
        })
      }
      })
  };

  handleModalResponse = (data) => {
    console.log(data);
    if (data == true && this.state.actionType == 'close') {
      this.setState({ confirmDelete: true }, () => {
        // this.handleSaveEnable();
        this.props.modalEditAction(false);
      })
    }
    else if (data == true && this.state.actionType == 'Delete') {
      console.log('delete success');
      this.setState({ confirmDelete: false }, () => {
      this.deleteProductProfile();
      })
    }
    else {
      this.setState({ confirmDelete: true }, () => {
      });
    }
  }


  handleChange = (e, value) => {
    // this.setState({ dataFieldsError: false });
    console.log(e.target.id, value);
    this.setState({isChanged:true});
    switch (e.target.id) {
      case ('accountnumber'):
        this.setState({ accountNumber: value, accountNumberCheck: false });
        break;
      case ('swiftcode'):
        this.setState({ swiftCode: value, swiftCodeCheck: false }, () => {
          // if (this.state.swiftCode.length === 0) {
          //   this.setState({
          //     swiftCodeCheck: true,
          //     swiftCodeErrMsg: 'BIC Code cannot be Empty.'
          //   }, () => {
          //   })
          // } else
            // if ((this.state.swiftCode.length > 11) || (this.state.swiftCode.length < 8)) {
            //   this.setState({
            //     swiftCodeCheck: true,
            //     swiftCodeErrMsg: 'BIC Code Should be 8 to 11 characters'
            //   }, () => {
            //   })
            // }
            // else {
            //   this.setState({
            //     swiftCodeCheck: false,
            //     swiftCodeErrMsg: ''
            //   }, () => {
            //     // this.handleSaveEnable();
            //   })
            // }
        });
        break;
      case ('status'):
        this.setState({ status: e.target.checked }, () => {
          console.log(this.state.status);
        });
        break;
    }
  };


  handleAccountNumberError = (e) => {
    switch (e) {
      case 'regex':
        this.setState({ accountNumberCheck: true, accountNumberErrMsg: 'Only Alphanumeric Allowed.' }, () => {
          // this.handleSaveEnable();
        })
        break;
      // case 'required':
      //   this.setState({
      //     accountNumberCheck: true,
      //     accountNumberErrMsg: 'Account Number cannot be Empty.'
      //   }, () => {
      //     // this.handleSaveEnable();
      //   })
      //   break;
    }
  }

  handleSwiftCodeError = (e) => {
    let bicCodeLen = (this.state.swiftCode == undefined) ? 0 : this.state.swiftCode.length;
    if(bicCodeLen > 0){
      switch (e) {
        case 'regex':
          this.setState({ swiftCodeCheck: true, swiftCodeErrMsg: 'Only Uppercase with AlphaNumeric Allowed.' }, () => {
            // this.handleSaveEnable();
          })
          break;
          case 'minLength':
          this.setState({
            swiftCodeCheck: true,
            swiftCodeErrMsg: 'BIC Code Should be 8 to 11 characters'
          }, () => {
            // this.handleSaveEnable();
          })
          break;
          case 'maxLength':
          this.setState({
            swiftCodeCheck: true,
            swiftCodeErrMsg: 'BIC Code Should be 8 to 11 characters'
          }, () => {
            // this.handleSaveEnable();
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
              this.setState({snackbar:true, notificationType:'warning',snackbarMessage:'draweebank profile will be disabled'})
              }
            })
          }); 
        break;
    }
  }

  handleData = () => {
    if (this.state.swiftCodeCheck || this.state.accountNumberCheck) {
      return null;
    }
    else {
      var data = {};
      if (this.state.accountNumber != undefined || this.state.accountNumber != null) {
        data.accountNumber = this.state.accountNumber;
      }
      if (this.state.swiftCode != undefined || this.state.swiftCode != null) {
        data.bicCode = this.state.swiftCode;
      }
      data.uaexBankWiseExchangeMarkUpCcy = this.state.setSpecificRate;
      data.status = this.state.status ? 'ENABLED' : 'DISABLED';
      data.deleted = false;
      this.updateProductProfile(data);
    }
  }

  updateProductProfile(data) {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ snackbar: false, confirmStatus: false, actionType: '' }, () => {
        DraweeeBankBranchApiService.updatedraweeBankproductprofile(data, this.props.draweeProductDetails.draweeBankId, this.props.draweeProductDetails.id,headers)
          .then((response) => {
            if (response.status == 200) {
              console.log(response);
              this.setState({snackbar:false},()=>{
                this.setState({snackbar:true, notificationType:'success',snackbarMessage:'draweebank profile details updated successfully'},()=>{
                  this.props.modalEditAction(false,"success");
                })
              })              
            }
          })
          .catch((error) => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ confirmStatus: true, apiErrMsg:  error.response.data.error , actionType: 'Try Again' })
            } 
          })
      })
    }
  }

  deleteProductProfile() {
    let data = {};
    data.status = (this.state.status) ? 'ENABLED' : 'DISABLED';
    data.uaexBankWiseExchangeMarkUpCcy = this.state.setSpecificRate;
    data.deleted = true;
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ snackbar: false, actionType: '' }, () => {
        DraweeeBankBranchApiService.updatedraweeBankproductprofile(data, this.props.draweeProductDetails.draweeBankId, this.props.draweeProductDetails.id,headers)
          .then((response) => {
            if (response.status == 200) {
              console.log(response);
              this.setState({snackbar:false},()=>{
                this.setState({snackbar:true, notificationType:'success',snackbarMessage:'draweebank profile deleted successfully'},()=>{
                  this.props.modalEditAction(false, "delete");
                })
              }) 
            }
          })
          .catch((error) => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ confirmStatus: true, apiErrMsg: "error", actionType: 'Try Again' })
            } 
          })
      })
    }
  }

  handleDelete = () => {
    this.setState({ confirmDelete: false }, () => {
      this.setState({ confirmDelete: true, modalMessage: "This will delete the product profile permanently. Are you sure you want to delete?", actionType: 'Delete' })
    })
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
    const { classes, openval } = this.props;
    const { open } = this.state;
    // let nstatus = (editField.status === 'ENABLED') ? true : false;

    return (
      <MuiThemeProvider theme={getMuiTheme}>
       {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={openval}
           // onClose={open}
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
                          {/* <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} /> */}
                          <IconButton style={{ height: 36, width: 36 }} umClass={classes.fab} icon="close" onClick={() => this.handleClose(null, 'close')} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <Grid item xs={12}>
                  <h3 className="global-font title-margin title-padding">Drawee Bank Profile Details</h3>
                </Grid>
                <Grid container direction="row" spacing={24}>
                  <Grid item xs={4}>
                    <p className="editField">Display Name</p>
                    <p className="editData">{this.props.draweeProductDetails.displayName}</p>
                  </Grid>
                  <Grid item xs={4}>
                    <p className="editField">Service Provider</p>
                    <p className="editData">{this.props.draweeProductDetails.serviceProviderCode}</p>
                  </Grid>
                  <Grid item xs={4}>
                    <p className="editField"> Product SubType</p>
                    <p className="editData">{this.props.draweeProductDetails.productSubType}</p>
                  </Grid>
                </Grid>
                <Grid className="global-font" container direction="row" justify="space-between" spacing={24}>
                  <Grid item xs={4}>
                    <p className="editField"> Service Type</p>
                    <p className="editData">{this.props.draweeProductDetails.serviceType}</p>
                  </Grid>
                  <Grid item xs={4} className="grid-error">
                    <p className="editField"> Account Number</p>
                    <Input id='accountnumber' autocomplete="off"  value={this.state.accountNumber} placeholder="Account Number" regex={/^[a-zA-Z0-9]+$/} type="freeText" onChange={(e, value) => this.handleChange(e, value)} onError={e => this.handleAccountNumberError(e)} />
                    {this.state.accountNumberCheck ? <span className='errorMessage-add'>{this.state.accountNumberErrMsg} </span> : ''}
                  </Grid>
                  <Grid item xs={4} className="grid-error">
                    <p className="editField"> BIC Code</p>
                    <Input id='swiftcode' autocomplete="off"  value={this.state.swiftCode} minLength={8} maxLength={11} placeholder="BIC Code" regex={/^([A-Z0-9 _-]+)$/} type="freeText" isRequired onChange={(e, value) => this.handleChange(e, value)} onError={e => this.handleSwiftCodeError(e)} />
                    {this.state.swiftCodeCheck ? <span className='errorMessage-add'>{this.state.swiftCodeErrMsg} </span> : ''}
                  </Grid>
                  <Grid item xs={4}>
                    <p className="editField"> Currency</p>
                    <p className="editData">{this.props.draweeProductDetails.currencyCode}</p>
                  </Grid>
                  <Grid item xs={4}>
                  </Grid>
                </Grid>
                <Grid className="global-font" container direction="row" justify="space-between" spacing={24}>
                  <Grid item xs={12}>
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
                <Grid container direction="row" justify="space-between" >
                  <Grid item xs={4}>
                    <OutLineButton className={classes.button} onClick={this.handleDelete}>Permanently Delete</OutLineButton>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                      <Grid item xs={3}>
                      <TextButton style={{ color: "#19ace3" }} onClick={this.handleData} >
                      <span className="saveBtn">Save</span>
                      </TextButton>
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
            this.state.confirmDelete ? <ModalBox isOpen={this.state.confirmDelete} permanentDelete={this.state.permanentDelete} actionType={this.state.actionType} message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
          }
          
          {
            this.state.confirmStatus ? <ErrorModalBox isOpen={this.state.confirmStatus} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleStatusResponse} /> : null
          }
        </div>
      }
      </MuiThemeProvider>
    );
  }
}

DraweeBankBranchEditModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DraweeBankBranchEditModal);

