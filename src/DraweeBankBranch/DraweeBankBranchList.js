import React, { Component } from 'react';
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
import * as Exceptionhandler from './../ExceptionHandling';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import Card from '@material-ui/core/Card';
import { FloatButton, Notifications, Button, IconButton } from 'finablr-ui';
import ModalBox from '../component/Modalbox';
import ErrorModalBox from '../component/ErrorModalbox';
import CreateEditBankBranch from './CreateEditBankBranch';
import DraweeBankBranchEditModal from './DraweeBankBranchEditModal';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from './../config/config';
import './../vendor/common.css';
import Icon from '@material-ui/core/Icon';
import {MuiThemeProvider} from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme.js";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  fab: {
    margin: theme.spacing.unit,
    // backgroundColor: "#2f2e2e",
    color: 'white'
  },
  fntMsg: {
    fontSize: 16,
    color: '#888888'
  }
});

const selectLabels = [
  { 'id': 1, 'label': 'Display Name', 'value': 'NAME' },
  { 'id': 2, 'label': 'Product SubType', 'value': 'productSubType' },
  { 'id': 3, 'label': 'Service Type', 'value': 'serviceType' },
  { 'id': 4, 'label': 'Currency Code', 'value': 'currencyCode' },
  { 'id': 5, 'label': 'BIC Code', 'value': 'swiftCode' },
  { 'id': 6, 'label': 'Account Number', 'value': 'accountNumber' }
];

const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

const queryString = require('query-string');
var parsed = null;

class DraweeBankBranchList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      snackbarMessage: '',
      snackbar: false,
      notificationType: 'success',
      tableHeader: rows,
      bankList: '',
      pageNum: 0,
      pageelements: '5',
      bankListLen: '',
      totalRecords: '',
      loading: true,
      buttonText: '',
      errMessage: 'Text must contain atleast 1',
      errCheck: false,
      query: '',
      fromSearch: false,
      columnFilter: '',
      editButn: '',
      callTableData: '',
      loaderMessage: 'Retrieving Data',
      confirmStatus: false,
      apiErrMsg: '',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      createDraweeBranch: false,
      editDraweeBank: false,
      draweeProductDetails: {},
      shownogeneralrules: false,
    }
  }

  componentDidMount() {
    // console.log('calling bank list');
    console.log(this.props);
    parsed = queryString.parse(this.props.location.search);
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
    if(this.props.openCreateModal == true){
      this.setState({createDraweeBranch:true});
    }
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
        DraweeeBankBranchApiService.getDraweeBankBranchList(params, this.props.draweeId,headers)
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
              this.setState({ loading: false, serverError: false,shownogeneralrules:true, apiErrMsg: error.response.data.error, actionType: 'OK' })
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
            pathname: `/draweeBankProfile/${this.props.draweeId}`,
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
                pathname: `/draweeBankProfile/${this.props.draweeId}`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchBankList(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.history.push({
                pathname: `/draweeBankProfile/${this.props.draweeId}`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchBankList(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              this.props.history.push({
                pathname: `/draweeBankProfile/${this.props.draweeId}`,
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

  handleGetEditTbl = (editopenval, editId) => {
    // this.props.getEdit(editopenval, editId)
    console.log(editopenval, editId);
    this.fetchDraweeProductProfileDetails(editId);
  }

  fetchDraweeProductProfileDetails = (id) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      DraweeeBankBranchApiService.getdraweebranchprofile(this.props.match.params.draweeId, id, headers)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.setState({ draweeProductDetails: response.data, editDraweeBank: true }, () => {
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
            this.setState({ loading: false, confirmStatus: true,shownogeneralrules:true, apiErrMsg: "erroe", actionType: 'Try Again' })
          }
        })
    }
  }

  handleSearchData = (data) => {
    console.log(data);
    this.setState({ query: data, loaderMessage: 'Retrieving Data',pageNum:0 }, () => {
      if (this.state.query.length == 0) {
        this.props.history.push({
          pathname: `/draweeBankProfile/${this.props.draweeId}`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchBankList(this.state.pageNum);
      }
      else {
        this.props.history.push({
          pathname: `/draweeBankProfile/${this.props.draweeId}`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchBankList(this.state.pageNum);
      }
    })
  }

  handleCreateDraweeBranch = () => {
    this.setState({ createDraweeBranch: false, shownogeneralrules: false }, () => {
      this.setState({ createDraweeBranch: true })
    })
  }

  handleEditDraweeBranch = () => {
    this.setState({ editDraweeBank: false }, () => {
      this.setState({ editDraweeBank: true })
    })
  }

  handleModalCreateResponse = (data, action) => {
    console.log(data);
    if (data == null && action == 'close') {
      this.setState({ createDraweeBranch: false, createProfile: false });
    }
    else if (data !== null && action == 'save') {
      this.CreateDraweeBankBranch(data);
    }
  }

  handleModalEditResponse = (data, action) => {
    console.log(data,action);
    if(action == "success"){
      this.setState({snackbar:false},()=>{
        this.setState({editDraweeBank: data,snackbar: true, notificationType: 'success', snackbarMessage: 'Drawee Bank Profile updated Successfully'},()=>{
          this.fetchBankList(0);
        })
      })
    }
    else if (action == "delete"){
      this.setState({ snackbar:false },() => {
        this.setState({ editDraweeBank: data, snackbar: true, notificationType: 'success', snackbarMessage: 'Drawee Bank Profile deleted Successfully' },()=>{
          this.fetchBankList(0);
        })
      })
    }
    else {
      this.setState({ editDraweeBank: data }, () => {
        this.fetchBankList(0);
      });
    }
  }

  handleStatusResponse = (data) => {
    if (data == true) {
      this.setState({ shownogeneralrules: false }, () => {
      });
    }
  }

  CreateDraweeBankBranch = (data) => {
    console.log(data);
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, createDraweeBranch: false }, () => {
        DraweeeBankBranchApiService.createdraweebankproductprofile(data, this.props.draweeId, headers)
          .then((response) => {
            if (response.status == 200) {
              this.setState({ serverError: false, loading: false, loaderMessage: '', snackbar: true, notificationType: 'success', snackbarMessage: 'Drawee Bank Branch Created Sucessfully', createDraweeBranch: false, pageelements: 5, query: '', columnFilter: '' }, () => {
                this.fetchBankList(0);
              });
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error || error.response.data.message, actionType: 'OK' })
            }
          });
      })
    }
  }

  handlePagingListing = (pgno) => {
    console.log(pgno);
    // console.log(this.props);
    this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => {
      if ((this.state.columnFilter.length > 0) && (this.state.query.length > 0)) {
        this.props.history.push({
          pathname: `/draweeBankProfile/${this.props.draweeId}`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchBankList(this.state.pageNum);
      }
      else {
        this.props.history.push({
          pathname: `/draweeBankProfile/${this.props.draweeId}`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchBankList(this.state.pageNum);
      }
    })
  }

  sbar = (val) => {
    this.setState({ open: val })
  }

  render() {
    const { classes } = this.props;
    const { editval } = this.props;
    const draweeBank = this.props.draweeBankView;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
      <div className={classes.root}>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
            <div className="grid">
              <div className="title-create-button">
                <p className="bank-profile global-font">Drawee Bank Profiles <span className={classes.fntMsg}>{this.state.bankListLen != 0 ? "(*Please click on any Drawee profile to apply rules)" : ""}</span></p>
                {/* {
                  // (this.state.bankListLen == 0) ? 
                    <Button className="create-button" onClick={this.handleCreateDraweeBranch}>
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
                              <Select fromPage="draweebanksbranchRows" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                            </Grid>
                            <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                            <Grid item xs={5}>
                              <Grid direction="row" container spacing={24} justify="flex-end" >
                                <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                  <Select fromPage="draweebanksbranch" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                </Grid>
                                <Grid item xs={5} style={{ paddingRight: '0px' }} className="grid-error">
                                  <Search fromPage="draweebanksbranch" value={this.state.query} getSearchText={this.handleSearch} />
                                  <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                </Grid>
                                <Grid item xs={2} >
                                  <div className="plus-icon-div">
                                    <Icon  className="plus-icon" color="" onClick={this.handleCreateDraweeBranch}>
                                      +
                                    </Icon>
                                  </div>
                              </Grid>
                            </Grid>
                            </Grid>
                          </Grid> : null
                      }
                      {
                        ((this.state.fromSearch == true) && (this.state.bankListLen == 0)) ? <Noresult text="Drawee Bank Profiles" />
                          :
                          [
                            ((this.state.fromSearch == false) && (this.state.bankListLen == 0)) ?
                              <div style={{position:'relative'}}>
                                <EmptyListComponent text="Drawee Bank Profiles" fromPage="DraweeBanks" />
                                {
                                  <div className="plus-icon-div plus-icon-position">
                                    <Icon  className="plus-icon" color="" onClick={this.handleCreateDraweeBranch}>
                                      +
                                    </Icon>
                                  </div>
                                }
                              </div>
                              : null
                          ]
                      }
                      {
                        (this.state.bankListLen != 0) ?
                          <div>
                            <EnhancedTable draweeBank={draweeBank} editBtn={this.props.editval} getEditTbl={this.handleGetEditTbl} bankList={this.state.bankList} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} />
                            <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                          </div> : null
                      }
                    </Card>
                  </div>
              }
              {
              ((this.state.createDraweeBranch == true) && (this.state.shownogeneralrules == false)) ?

                <CreateEditBankBranch openval={this.state.createDraweeBranch} getOpenValue={this.handleGetOpenValue} modalAction={this.handleModalCreateResponse} {...this.props} /> : null
              }
              {
                this.state.editDraweeBank ?
                  <DraweeBankBranchEditModal openval={this.state.editDraweeBank} draweeProductDetails={this.state.draweeProductDetails} modalEditAction={this.handleModalEditResponse} /> : null
              }
               {
                  this.state.shownogeneralrules ? <ErrorModalBox isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleStatusResponse} /> : null
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

DraweeBankBranchList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DraweeBankBranchList);
