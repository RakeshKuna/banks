import React, { Component } from 'react';
import EnhancedTable from './EnhancedTable';
import Search from '../../container/Search';
import Select from '../../container/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import '../../vendor/common.css';
import rows from './EnhancedTableHeaderList';
import Loader from '../../component/Loader';
import EmptyListComponent from '../../component/EmptylistComponent';
import Pagination from '../../container/Pagination';
import '../../theme/theme';
import Noresult from '../../component/NoResults';
import * as ApiService from './ApiService';
import * as Exceptionhandler from '../../ExceptionHandling';
import CreateCountryRestrictionModal from './CreateCountryRestrictionModal';
import ErrorModalBox from '../../component/ErrorModalbox';
import EditCountryRestrictionModal from './EditCountryRestriction';
import Card from '@material-ui/core/Card';
import { FloatButton, Notifications, IconButton, Button } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import * as config from '../../config/config';
import Icon from '@material-ui/core/Icon';

const queryString = require('query-string');
var parsed = null;
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: '10px 24px 24px' }}>
      {props.children}
    </Typography>
  );
}

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

const selectLabels = [{ 'id': 1, 'label': 'Customer Type', 'value': 'customerType' }, { 'id': 2, 'label': 'Beneficiary Type', 'value': 'beneficiaryType' }, { 'id': 3, 'label': 'Agent', 'value': 'agent' }, { 'id': 4, 'label': 'Destination Country', 'value': 'destination' }, { 'id': 5, 'label': 'Agent Branch', 'value': 'agentBranch' }, { 'id': 6, 'label': 'Agent Source Country', 'value': 'country' }];
const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

class CountryRestrictions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      query: '',
      pageNum: 0,
      pageelements: 5,
      columnFilter: '',
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      loaderMessage: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      fromSearch: false,
      actionType: '',
      tableHeader: rows,
      bankList: '',
      bankListLen: '',
      totalRecords: '',
      buttonText: '',
      errMessage: 'Enter atleast 1 character',
      errCheck: false,
      createCountryRestriction: false,
      showcreatecountryrestriction: false,
      customerType: '',
      beneficiaryType: '',
      shownogeneralrules: false,
      ruledefaultvalue: {},
      editCountryrestrictions: false,
      countryRestrictionValueObject: {},
      editCountryRestriction: '',
      showeditcountryrestriction: false,
      editingAgentId: null,
      apiErrMsg:''
    }
  }

  componentDidMount() {
    console.log(this.props);
    parsed = queryString.parse(this.props.props.props.location.search);
    console.log(parsed);
    let totalMatch = 0;
    let colCountMatch = 0;
    // console.log("columnType" in parsed);
    this.setState({ loading: true }, () => {
      if ("pageelements" in parsed) {
        let count = 0;
        rowsPerpage.map((obj) => {
          if (obj.id == parseInt(parsed.pageelements)) {
            count = count + 1;
            this.setState({ pageelements: parseInt(parsed.pageelements) }, () => {
              //this.fetchCountryRestrictions(this.state.pageNum);
            })
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
              this.fetchCountryRestrictions(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchCountryRestrictions(this.state.pageNum);
        })
      }
      this.props.handleCompValueChange(false);
      this.getGeneralrules();
    })
  }


  getGeneralrules = () => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
    ApiService.getGeneralBankrules(this.props.draweeBankBranchProfileView.branchId,headers)
      .then((response) => {
        if (response.status == 200) {
          if (response.data.hasOwnProperty("message")) {
            this.setState({
              customerType: '',
              beneficiaryType: '',
            }, () => {
              let ruledefaultvalue = {};
              ruledefaultvalue.customerType = this.state.customerType;
              ruledefaultvalue.isCustomerTypeDisabled = false;
              ruledefaultvalue.beneficiaryType = this.state.beneficiaryType;
              ruledefaultvalue.isBeneficiaryTypeDisabled = false;
              this.setState({ ruledefaultvalue });
            })
          }
          else {
            this.setState({
              customerType: response.data.generalDraweeRules.customerType,
              beneficiaryType: response.data.generalDraweeRules.beneficiaryType,
            }, () => {
              let ruledefaultvalue = {};
              ruledefaultvalue.customerType = this.state.customerType;
              ruledefaultvalue.isCustomerTypeDisabled = (this.state.customerType == "BOTH") ? false : true;
              ruledefaultvalue.beneficiaryType = this.state.beneficiaryType;
              ruledefaultvalue.isBeneficiaryTypeDisabled = (this.state.beneficiaryType == "BOTH") ? false : true;
              this.setState({ ruledefaultvalue });
            })

          }
        }
      }).catch(error => {
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
    }
  }

  fetchCountryRestrictions = (pgno) => {
    let params = {};
    if(this.state.query.trim().length == 0){
      params = {
        pageNumber: pgno,
        pageElements: this.state.pageelements
      }
    }
    else {
      params = {
        pageNumber: pgno,
        pageElements: this.state.pageelements,
        query: (this.state.query == '') ? null : this.state.query,
        queryParameter: (this.state.columnFilter == '') ? null : this.state.columnFilter
      }
    }
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      // let params = {
      //   pageNumber: pgno,
      //   pageelements: this.state.pageelements,
      //   query: (this.state.query == '') ? null : this.state.query,
      //   queryParameter: (this.state.columnFilter == '') ? null : this.state.columnFilter
      // }
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiService.getCountryRestrictions(params, this.props.draweeBankBranchProfileView.id,headers)
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
      case ('CountryRestriction', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.props.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
            search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchCountryRestrictions(0);
        });
        break;
      case ('CountryRestriction', 'columnFilter'):
        //sessionStorage.setItem('draweebanksFilter',JSON.stringify(data));
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            // sessionStorage.setItem('draweebankquery',JSON.stringify(this.state.query));
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(this.state.columnFilter));
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchCountryRestrictions(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(''));
            // sessionStorage.setItem('draweebankquery',JSON.stringify(''));
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchCountryRestrictions(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              //sessionStorage.setItem('draweebankquery',JSON.stringify(''));
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchCountryRestrictions(this.state.pageNum);
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

  handleStatusResponse = (data) => {
    if (data == true) {
      this.setState({ shownogeneralrules: false }, () => {
      });
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
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(''));
            // sessionStorage.setItem('draweebankquery',JSON.stringify(''));
            this.handleSearchData(this.state.query);
          })
        }
        else if (dataLen >= 1) {
          this.setState({ query: data, errCheck: false })
        }
        break;
    }
  }

  handleCreateCountryRestriction = () => {
    console.log('exec');
    if (this.state.customerType === "" && this.state.beneficiaryType === "") {
      console.log('exec if');
      this.setState({
        shownogeneralrules: true,
        apiErrMsg: 'No Rules found for Allowed Customer type and Beneficiary type, Navigate to General Rules Tab and create rules before creating Country Restriction'
      })
    }
    else {
      console.log('exec else');
      this.setState({shownogeneralrules: false, createCountryRestriction: true, actionType: 'Yes', snackbar: false, snackbarMessage: '' })
    }
  }

  handleSearchData = (data) => {
    this.setState({ query: data, loaderMessage: 'Retrieving Data',pageNum:0 }, () => {
      this.props.props.props.history.push({
        pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
        search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
      })
      this.fetchCountryRestrictions(this.state.pageNum);
    })
  }

  handlePagingListing(pgno) {
    this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => {
      if ((this.state.columnFilter.length > 0) && (this.state.query.length > 0)) {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchCountryRestrictions(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchCountryRestrictions(this.state.pageNum);
      }
    })
  }

  handleModalCreateResponse = (data, action) => {
    if (data == null && action == 'close') {
      this.setState({ createCountryRestriction: false, createProfile: false });
    }
    else if (data !== null && action == 'save') {
      // api call
      this.createCountryRestriction(data);
    }
  }

  createCountryRestriction = (data) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, createCountryRestriction: false }, () => {
        ApiService.createCountryRestriction(this.props.draweeBankBranchProfileView.branchId, data,headers)
          .then((response) => {
            if (response.status == 200) {
              this.setState({ serverError: false, loading: false, loaderMessage: '', snackbar: true, notificationType: 'success', snackbarMessage: 'Country Restriction created successfully', createCountryRestriction: false, pageelements: 5, query: '', columnFilter: '' }, () => {
                this.props.getNewBadge();
                this.fetchCountryRestrictions(0);
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
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      })
    }
  }

  handleModalEditResponse = (data, action) => {
    if (data == null && action == 'close') {
      this.setState({ editCountryrestrictions: false });
    }
    else {
      this.setState({ editCountryrestrictions: false }, () => {
        // api call
        this.editCountryrestrictions(data);
      });
    }
  }

  editCountryrestrictions = (data) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      let finalData = Object.assign({},data);
      delete finalData['id'];
      console.log(finalData);
      console.log(data);
      this.setState({ loading: true, loaderMessage: 'Posting Data', editCountryrestrictions: false, snackbar: false, snackbarMessage: '' }, () => {
        ApiService.editCountryRestrictions(this.props.props.draweeProductId, finalData, data.id,headers).then((response) => {
          if (response.status == 200) {
            this.setState({ loading: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Country Restriction updated successfully' }, () => {
              this.fetchCountryRestrictions(0);
            })
          }
        })
        .catch((error) => {
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else{
            this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: error.response.data.error }, () => {
              this.fetchCountryRestrictions(0);
            });
          }
        })
      })
    }
  }

  handleEditCountryRestrictions = (countryrestriction, agentId) => {
    //console.log(countryrestriction,agentId);
    this.setState({ editCountryRestriction: countryrestriction, editCountryrestrictions: true, editingAgentId: agentId })
  }

  sbar(val) {
    this.setState({ open: val })
  }

  render() {
    const { classes } = this.props;
    return (
      <TabContainer>
        <div className={classes.root}>
          {
            this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
              <div className="grid">
                <div className="title-create-button">
                  <p className="bank-profile global-font">Country Restrictions</p>
                  {/* {
                    // (this.state.bankListLen == 0) ?
                      <Button className="create-button" onClick={this.handleCreateCountryRestriction}>
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
                                <Select fromPage="CountryRestrictionRows" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                              </Grid>
                              <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                              <Grid item xs={5}>
                                <Grid direction="row" container spacing={24} justify="flex-end" >
                                  <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                    <Select fromPage="CountryRestriction" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                  </Grid>
                                  <Grid item xs={5} style={{ paddingRight: '0px' }} className="grid-error">
                                    <Search fromPage="CountryRestriction" value={this.state.query} getSearchText={this.handleSearch} />
                                    <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                  </Grid>
                                  <Grid item xs={2} >
                                    <div className="plus-icon-div">
                                      <Icon  className="plus-icon" color="" onClick={this.handleCreateCountryRestriction}>
                                        +
                                      </Icon>
                                    </div>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                            :
                            null
                        }
                        {
                          ((this.state.fromSearch == true) && (this.state.bankListLen == 0)) ?
                            <Noresult text="Drawee Bank" />
                            :
                            [
                              ((this.state.fromSearch == false) && (this.state.bankListLen == 0)) ? 
                                <div style={{position:'relative'}}>
                                  <EmptyListComponent text="Country Restrictions" fromPage="DraweeBanks" />
                                  {
                                    <div className="plus-icon-div plus-icon-position">
                                      <Icon  className="plus-icon" color="" onClick={this.handleCreateCountryRestriction}>
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
                              <EnhancedTable bankList={this.state.bankList} editDraweeCountryRestrictionfn={this.handleEditCountryRestrictions} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} />
                              <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                            </div> : null
                        }
                      </Card>
                    </div>
                }
                {
                  (this.state.createCountryRestriction == true) ?
                  <CreateCountryRestrictionModal isOpen={this.state.createCountryRestriction} ruledefaultvalue={this.state.ruledefaultvalue} modalAction={this.handleModalCreateResponse} /> : null
                }
                {
                  this.state.editCountryrestrictions ?
                  <EditCountryRestrictionModal ruledefaultvalue={this.state.ruledefaultvalue} draweebankProfilebranchid={this.props.draweeBankBranchProfileView.branchId} isOpen={this.state.editCountryrestrictions} editCountryRestriction={this.state.editCountryRestriction} editingAgentId={this.state.editingAgentId} modalEditAction={this.handleModalEditResponse} /> : null
                }
                {
                  this.state.shownogeneralrules ? <ErrorModalBox isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleStatusResponse} /> : null
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
      </TabContainer>
    )
  }
}
export default withStyles(styles)(CountryRestrictions);
