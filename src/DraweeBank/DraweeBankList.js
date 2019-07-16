import React, { Component } from 'react';
import { FloatButton, Notifications, IconButton, Button } from 'finablr-ui';
import EnhancedTable from './EnhancedTable';
import Pagination from '../container/Pagination';
import Search from '../container/Search';
import Select from '../container/Select';
import '../vendor/common.css';
import '../theme/theme';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import EmptyListComponent from '../component/EmptylistComponent';
import Loader from '../component/Loader';
import Noresult from '../component/NoResults';
import rows from '../component/DraweeBankListTableHeader';
import DraweeBankCreateModal from './DraweeBankCreateModal';
import DraweeBankEditModal from './DraweeBankEditModal';
import ModalBox from './../component/Modalbox';
import * as ApiService from './ApiService';
import * as Exceptionhandler from './../ExceptionHandling';
import Card from '@material-ui/core/Card';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from './../config/config';
import './../vendor/common.css';
import Icon from '@material-ui/core/Icon';
import {MuiThemeProvider} from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme.js";

const queryString = require('query-string');
var parsed = null;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  fab: {
    margin: theme.spacing.unit,
    backgroundColor: "#19ace3",
    color: 'white'
  },
});

const selectLabels = [{ 'id': 1, 'label': 'Bank Name', 'value': 'bankName' }, { 'id': 2, 'label': 'Service Provider', 'value': 'serviceProvider' }, { 'id': 3, 'label': 'Country', 'value': 'country' }];
const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

class BankList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      tableHeader: rows,
      bankList: '',
      pageNum: 0,
      pageelements: 5,
      bankListLen: '',
      totalRecords: '',
      loading: true,
      buttonText: '',
      errMessage: 'Enter atleast 1 character',
      errCheck: false,
      query: '',
      fromSearch: false,
      columnFilter: '',
      fromAction: '',
      createDraweeBank: false,
      editDraweeBank: false,
      editDraweeBankcode: '',
      bankValueObject: {},
      bankEditStatus: false,
      bankEditDeleted: false,
      modalMessage: '',
      createProfile: false,
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      actionType: '',
      loaderMessage: 'Retrieving Data',
      confirmStatus: false,
      apiErrMsg: '',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      createdServiceProvider: ''
    }
  }

  componentDidMount() {
    console.log('calling bank list');
    console.log(this.props);
    parsed = queryString.parse(this.props.location.search);
    // console.log(this.props.location.search);
    // console.log(parsed);
    let totalMatch = 0;
    let colCountMatch = 0;
    this.setState({ loading: true }, () => {
      if ("pageelements" in parsed) {
        let count = 0;
        rowsPerpage.map((obj) => {
          if (obj.id == parseInt(parsed.pageelements)) {
            count = count + 1;
            this.setState({ pageelements: parseInt(parsed.pageelements) })
          }
          if (count == 0) {
            this.setState({ serverError: true, serverErrMessage: "Web URL you entered is not a functioning page on our site." });
          }
          else {
            this.setState({ serverError: false, serverErrMessage: '' });
          }
        })
      }
      if ("pagenum" in parsed) {
        this.setState({ pageNum: parsed.pagenum });
      }
      if ("columnType" in parsed) {
        selectLabels.map((obj) => {
          if (obj.value == parsed.columnType) {
            colCountMatch = colCountMatch + 1;
            this.setState({ columnFilter: parsed.columnType, fromSearch: true }, () => {

            })
          }
        })
        if (colCountMatch == 0) {
          this.setState({ serverError: true, serverErrMessage: "Web URL you entered is not a functioning page on our site." });
        }
        else {
          this.setState({ serverError: false, serverErrMessage: '' });
        }
      }
      if (colCountMatch > 0) {
        if ("search" in parsed) {
          if (parsed.search.length > 0) {
            totalMatch = totalMatch + 1;
            this.setState({ query: parsed.search, fromSearch: true }, () => {
              this.fetchBankList(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchBankList(this.state.pageNum);
        })
      }
      // this.props.handleCompValueChange(false); 
      // this.getGeneralrules();
    })
  }

  fetchBankList = (pgno) => {
    let params = {};
    if(this.state.query.trim().length == 0){
      params = {
        pagenumber: pgno,
        pageelements: this.state.pageelements
      }
    }
    else {
      params = {
        pagenumber: pgno,
        pageelements: this.state.pageelements,
        query: (this.state.query == '') ? null : this.state.query,
        type: (this.state.columnFilter == '') ? null : this.state.columnFilter
      }
    }
    // let params = {
    //   pagenumber: pgno,
    //   pageelements: this.state.pageelements,
    //   query: (this.state.query == '') ? null : this.state.query,
    //   type: (this.state.columnFilter == '') ? null : this.state.columnFilter
    // }
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiService.getAllBanks(params,headers)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.setState({ serverError: false, bankList: response.data, bankListLen: response.data['data'].length, totalRecords: response.data.total, loading: false, loaderMessage: '' });
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      })
    }
  }

  handleSelect = (data, fromPage, type) => {
    switch (fromPage, type) {
      case ('draweebanksRows', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.history.push({
            pathname: `/draweebanklist`,
            search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchBankList(0);
        });
        break;
      case ('draweebanks', 'columnFilter'):
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.history.push({
                pathname: `/draweebanklist`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchBankList(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.history.push({
                pathname: `/draweebanklist`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchBankList(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              this.props.history.push({
                pathname: `/draweebanklist`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchBankList(this.state.pageNum);
            })
          }
        });
        break;
    }
  }

  handleSearch = (dataEvent, value) => {
    if (dataEvent.keyCode == 13) {
      this.setState({ query: value }, () => {
        this.handleSearchCheck(this.state.query, true);
      })
    }
    else if(dataEvent.keyCode == 9){
      this.setState({ query: value });
    }
    else {
      this.setState({ query: value }, () => {
        this.handleSearchCheck(this.state.query, false);
      })
    }
  }

  handleSearchCheck(data, enter) {
    let dataLen = null;
    if (data == undefined) {
      dataLen = 0;
    }
    else {
      dataLen = data.length;
    }
    switch (enter) {
      case (true):
        if ((dataLen == 0) && (this.state.columnFilter.length == 0)) {
          this.setState({ query: '', errCheck: false }, () => {
            this.handleSearchData(data);
          });
        }
        else if ((dataLen == 0) && (this.state.columnFilter.length > 0)) {
          this.setState({ query: '', errCheck: true, errMessage: 'Enter atleast 1 char' });
        }
        else if ((dataLen >= 1) && (this.state.columnFilter.length == 0)) {
          this.setState({ query: data, errMessage: 'Please select column type', errCheck: true });
        }
        else if ((dataLen >= 1) && (this.state.columnFilter.length > 0)) {
          this.setState({ query: data, errCheck: false, fromSearch: true }, () => {
            this.handleSearchData(data);
          });
        }
        break;
      case (false):
        if (dataLen == 0 && this.state.columnFilter.length == 0) {
          this.setState({ query: '', errCheck: false, columnFilter: "" }, () => {
            this.handleSearchData(this.state.query);
          })
        }
        else if (dataLen >= 1) {
          this.setState({ query: data, errCheck: false })
        }
        break;
    }
  }

  handleSearchData = (data) => {
    console.log(data);
    this.setState({ query: data, loaderMessage: 'Retrieving Data',pageNum:0 }, () => {
      if (this.state.query.length == 0) {
        this.props.history.push({
          pathname: `/draweebanklist`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchBankList(this.state.pageNum);
      }
      else {
        this.props.history.push({
          pathname: `/draweebanklist`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchBankList(this.state.pageNum);
      }

    })
  }

  handlePagingListing = (pgno) => {
    console.log(pgno);
    // console.log(this.props);
    this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => {
      if ((this.state.columnFilter.length > 0) && (this.state.query.length > 0)) {
        this.props.history.push({
          pathname: `/draweebanklist`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchBankList(this.state.pageNum);
      }
      else {
        this.props.history.push({
          pathname: `/draweebanklist`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchBankList(this.state.pageNum);
      }
    })
  }

  sbar(val) {
    this.setState({ open: val })
  }

  handleModalCreateResponse = (data, action) => {
    console.log("Harr", data, action);
    if (data == null && action == 'close') {
      this.setState({ createDraweeBank: false, createProfile: false });
    }
    else if (data == null && action == 'open') {
      this.setState({ createProfile: false, modalMessage: '' });
    }
    else if (data == null && action == 'Try Again') {
      this.setState({ createProfile: true, modalMessage: '' });
    }
    else if (data == null && action == 'Try Again closed') {
      this.setState({ createProfile: false, modalMessage: '', createDraweeBank: false });
    }
    else {
      this.setState({ createDraweeBank: false }, () => {
        // api call
        let bankData = {};
        bankData.bankId = data.bank.id;
        bankData.deleted = false;
        bankData.country = data.country.name;
        bankData.countryCode = data.country.value;
        bankData.serviceProviderCode = data.serviceProvider.value;
        bankData.status = data.status ? 'ENABLED' : 'DISABLED';
        this.createDraweeDetails(bankData);
      });
    }
  }

  handleModalEditResponse = (data, action, actionType) => {
    if (data == null && action == 'close') {
      this.setState({ editDraweeBank: false });
    }
    else {
      this.setState({ editDraweeBank: false }, () => {
        // api call
        this.editDraweeDetails(data,actionType);
      });
    }
  }

  createDraweeDetails = (bankdata) => {
    this.setState({ createProfile: false, modalMessage: '', loading: true, loaderMessage: 'Posting Data', snackbar: false, snackbarMessage: '' });
    console.log(bankdata);
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiService.createBankDetails(bankdata,headers).then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false, createProfile: true, modalMessage: 'Drawee bank created. Do you want to create a profile now?', actionType: 'Yes', createdDraweeId: response.data.id, createdServiceProvider: bankdata.serviceProviderCode }, () => {
            this.fetchBankList(0);
          });
        }
        else {
          this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: response.error }, () => {
            this.fetchBankList(0);
          });
        }
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 ) {
          this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })

        }
        else {
          this.setState({ loading: false, createProfile: true, modalMessage: error.response.data.error || error.response.data.message, actionType: 'Try Again' }, () => {
            this.fetchBankList(0);
          });
        }
      });
    }
  }

  editDraweeDetails = (data,action) => {
    console.log(action);
    this.setState({ editDraweeBank: false, snackbar: false, snackbarMessage: '' });
    let bankValueObject = {};
    bankValueObject.status = (data.status ? 'ENABLED' : 'DISABLED');
    bankValueObject.deleted = data.deleted;
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ bankValueObject: bankValueObject, loading: true, loaderMessage: 'Posting Data' }, () => {
        let bankValueObject = this.state.bankValueObject;
        ApiService.editBankDetails(bankValueObject, data.id,headers).then((response) => {
          if(action == 'delete'){
            this.setState({ loading: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Drawee bank deleted successfully' }, () => {
              if (response.status == 200) {
                this.fetchBankList(0);
              }
            })
          }
          else{
            this.setState({ loading: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Drawee bank updated successfully' }, () => {
              if (response.status == 200) {
                this.fetchBankList(0);
              }
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
            this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: error.response.data.error }, () => {
              this.fetchBankList(0);
            });
          }
        })
      })
    }
  }

  handleCreateDraweeBank = () => {
    this.setState({ createDraweeBank: true, actionType: 'Yes', snackbar: false, snackbarMessage: '' })
  }

  handleModalResponse = (data) => {
    if (data == true && this.state.actionType == 'Try Again') {
      this.setState({ createDraweeBank: true, actionType: '', createProfile: false, modalMessage: '' })
    }
    else if (data == true && this.state.actionType == 'Yes') {
      this.setState({ createDraweeBank: false, actionType: '' }, () => {
        this.props.history.push({
          pathname: '/draweeBankProfile/' + this.state.createdDraweeId,
          state: { onModalCreateProfile: true, serviceProvider: this.state.createdServiceProvider }
        })
      })
    }
    else if (data == true && this.state.actionType == 'OK') {
      this.fetchBankList(0);
    }
    else {
      this.setState({ createDraweeBank: false });
    }
  }

  handleEditDraweeBank = (bankcode) => {
    this.setState({ editDraweeBankcode: bankcode, editDraweeBank: true })
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
      <div className={classes.root}>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
            <div className="grid">
              <div className="title-create-button">
                <p className="bank-profile global-font">Drawee Banks</p>
                {/* {
                  // (this.state.bankListLen == 0) ?
                    <Button className="create-button" onClick={this.handleCreateDraweeBank}>
                      <Icon style={{ padding: "1px 5px 0 0" }} color="">
                        +
                      </Icon>
                      CREATE
                    </Button>
                    // : null
                } */}
              </div>
              {
                this.state.loading ?
                  <Loader action={this.state.loaderMessage} />
                  :
                  <div>
                    <Card>
                      {
                        (((this.state.bankListLen == 0) && (this.state.fromSearch == true)) || (this.state.bankListLen != 0)) ?
                          <Grid container spacing={24} className="page-element-grid" justify="space-between">
                            <Grid item xs={1}>
                              <Select fromPage="draweebanksRows" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                            </Grid>
                            <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                            <Grid item xs={5}>
                              <Grid direction="row" container spacing={24} justify="flex-end" >
                                <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                  <Select fromPage="draweebanks" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                </Grid>
                                <Grid item xs={5} style={{ paddingRight: '0px' }} className="grid-error">
                                  <Search fromPage="draweebanks" value={this.state.query} getSearchText={this.handleSearch} />
                                  <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                </Grid>
                                <Grid item xs={2}>
                                  <div className="plus-icon-div">
                                    <Icon className="plus-icon" color="" onClick={this.handleCreateDraweeBank}>
                                      +
                                    </Icon>
                                  </div>
                              </Grid>
                            </Grid>
                            </Grid>
                          </Grid> : null
                      }
                      {
                        ((this.state.fromSearch == true) && (this.state.bankListLen == 0)) ? <Noresult text="Drawee Bank" />
                          :
                          [
                            ((this.state.fromSearch == false) && (this.state.bankListLen == 0)) ? 
                            <div style={{position:'relative'}}>
                              <EmptyListComponent text="Drawee Banks" fromPage="DraweeBanks" />
                              {
                                <div className="plus-icon-div plus-icon-position">
                                  <Icon  className="plus-icon" color="" onClick={this.handleCreateDraweeBank}>
                                    +
                                  </Icon>
                                </div>
                              }
                            </div>
                            : null
                          ]
                      }
                      {/* { 
                        ((this.state.fromSearch == false) && (this.state.bankListLen == 0)) ?
                          <div className="plus-icon-div">
                            <Icon  className="plus-icon" color="" onClick={this.handleCreateDraweeBank}>
                              +
                            </Icon>
                          </div>
                          : null
                      } */}
                      {
                        (this.state.bankListLen != 0) ?
                          <div>
                            <EnhancedTable bankList={this.state.bankList} editDraweeBankfn={this.handleEditDraweeBank} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} />
                            <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                          </div> : null
                      }
                    </Card>
                  </div>
              }
              {
                this.state.createDraweeBank ?
                  <DraweeBankCreateModal isOpen={this.state.createDraweeBank} modalAction={this.handleModalCreateResponse} /> : null
              }
              {
                this.state.editDraweeBank ?
                  <DraweeBankEditModal isOpen={this.state.editDraweeBank} editDraweeBankcode={this.state.editDraweeBankcode} modalEditAction={this.handleModalEditResponse} /> : null
              }
              {
                this.state.createProfile ? <ModalBox isOpen={this.state.createProfile} actionType={this.state.actionType} message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
              }
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
      </div>
      </MuiThemeProvider>
    );
  }
}

BankList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BankList);
