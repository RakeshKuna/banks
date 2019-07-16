import React, { Component } from 'react';
import { Button, Notifications } from 'finablr-ui';
import EnhancedTable from './EnhancedTable';
import Search from '../../container/Search';
import Select from '../../container/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import '../../vendor/common.css';
import rows from './EnhancedTableHeaderList';
import Loader from '../../component/Loader';
import Snackbarcomp from '../../component/snackbar';
import EmptyListComponent from '../../component/EmptylistComponent';
import Pagination from '../../container/Pagination';
import '../../theme/theme';
import Noresult from '../../component/NoResults';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import * as Exceptionhandler from '../../ExceptionHandling';
import * as ApiService from './SourceOfFundsApiService';
// import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import ViewActivity from './ViewActivity';
import ErrorModal from './../../component/ErrorModalbox';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import * as config from './../../config/config';
import moment from 'moment';

const selectLabels = [{ 'id': 1, 'label': 'Codes', 'value': 'SOURCE_OF_FUNDS_CODE' }, { 'id': 2, 'label': 'Source Of Income', 'value': 'SOURCE_OF_FUNDS_NAME' }, { 'id': 3, 'label': 'Value To Be Passed', 'value': 'DRAWEE_BANK_PRODUCT_PROFILE_SOURCE_OF_FUNDS_CODE' }];
const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

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

class SourceOfFunds extends Component {
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
      totalRecords: '',
      viewActivity: false,
      suggestedFields: [],
      sourceOfIncomelist: '',
      sourceOfIncomeLen: '',
      shownogeneralrules: false,
      isViewActivityClicked: false,
      sourceTypeIncomeArr: [],
      incomeSelectError: false,
      incomeSelectErrorMsg: '',
      sourceofFundsDisabled: false,
      apiErrMsg:'',
      activityDetails: {},
    }
  }

  dateFormater = (data) => {
    let activityDetails = {
      createBy: data.createdBy,
      modifiedBy: data.updatedBy,
      createDate: moment(data.createdDate).format("DD/MM/YYYY hh:mm a"),
      modifiedDate: moment(data.modifiedDate).format("DD/MM/YYYY hh:mm a"),
    }
    this.setState({ activityDetails }, () => {
      console.log(activityDetails);
    })
  }

  componentDidMount() {
    parsed = queryString.parse(this.props.props.props.location.search);
    console.log(parsed);
    let totalMatch = 0;
    let colCountMatch = 0;
    this.setState({ loading: true, loaderMessage: 'Retrieving Data' }, () => {
      if ("pageelements" in parsed) {
        let count = 0;
        rowsPerpage.map((obj) => {
          if (obj.id == parseInt(parsed.pageelements)) {
            count = count + 1;
            this.setState({ pageelements: parseInt(parsed.pageelements) }, () => {
            })
          }
          else {
            return null;
          }
        })
        if (count == 0) {
          this.setState({ serverError: true, serverErrMessage: "Web URL you entered is not a functioning page on our site." });
        }
        else {
          this.setState({ serverError: false, serverErrMessage: '' });
        }
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
          else {
            return null;
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
              this.fetchSourceOfFunds(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchSourceOfFunds(this.state.pageNum);
        })
      }
    })
    this.props.handleCompValueChange(false);
    this.getincomesources();
  }

  getActivity = (index) => {
    let bankObj = this.state.sourceOfIncomelist.data[index]; 
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else {
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiService.getActivity(this.props.props.props.match.params.pId, bankObj.id)
          .then((response) => {
            if (response.status == 200) {
              console.log(response);
              this.setState({ loading: false, isViewActivityClicked: true, serverError: false, activityDetails: response.data }, () => {
                console.log(this.state.activityDetails);
                this.dateFormater(this.state.activityDetails)
              })
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 ) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      })
    }
  }

  getincomesources = () => {
    let params = {
      pagenumber: 0
    };
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, loaderMessage: 'Retrieving Data' }, () => {
        ApiService.fetchSourceOfIncome(headers)
          .then((response) => {
            console.log(response.data);
            if (response.status == 200) {
              let suggestedFields = [];
              if (response.data.length > 0) {
                response.data.map((obj) => {
                  let incomeobject = {};
                  incomeobject.id = obj.id;
                  incomeobject.field = obj.code;
                  incomeobject.label = obj.description;
                  suggestedFields.push(incomeobject); 
                })
                this.setState({ suggestedFields, loading: false, loaderMessage: '' }, () => { 
                });
              }
              else {
                this.setState({ loading: false, loaderMessage: '', snackbar: true, notificationType: 'warning', snackbarMessage: 'No source of Fund records found', sourceofFundsDisabled: true });
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
      })
    }
  }

  fetchSourceOfFunds = (pgno) => {
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
      //   pageElements: this.state.pageelements,
      //   query: (this.state.query == '') ? null : this.state.query,
      //   queryParameter: (this.state.columnFilter == '') ? null : this.state.columnFilter
      // }
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiService.buildFetchSourceOfIncome(params, this.props.props.draweeProductId,headers)
          .then((response) => {
            if (response.status == 200) {
              let data = {};
              data.data = [];
              if (response.data.total > 0) {
                response.data.data.map((obj) => {
                  let bankObj = {};
                  bankObj.id = obj.id;
                  bankObj.sourceOfFundsName = obj.sourceOfFundsName;
                  bankObj.sourceOfFundsId = obj.sourceOfFundsId;
                  bankObj.sourceOfFundscode = obj.sourceOfFundscode;
                  bankObj.status = obj.status;
                  bankObj.allowedMaximumAmount = (obj.allowedMaximumAmount == 0) ? '' : obj.allowedMaximumAmount;
                  bankObj.maxAmountisEmpty = (obj.allowedMaximumAmount == 0) ? true : false;
                  bankObj.maxAmountisEditClick = true;
                  bankObj.maxAmounteditClicked = false;
                  bankObj.draweeBankProductProfileSourceOfFundsCode = (obj.draweeBankProductProfileSourceOfFundsCode == null) ? '' : obj.draweeBankProductProfileSourceOfFundsCode;
                  bankObj.draweeBankProductProfileSourceOfFundsCodeisEmpty = (obj.draweeBankProductProfileSourceOfFundsCode == null) ? true : false;
                  bankObj.valueToBePassedisEditClick = false;
                  bankObj.valueToBePassededitClicked = false;
                  data.data.push(bankObj);
                })
              }
              this.setState({ serverError: false, sourceOfIncomelist: data, sourceOfIncomeLen: response.data['data'].length, totalRecords: response.data.total, loading: false, loaderMessage: '' });
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

  handlePagingListing(pgno) {
    this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => {
      if ((this.state.columnFilter.length > 0) && (this.state.query.length > 0)) {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchSourceOfFunds(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchSourceOfFunds(this.state.pageNum);
      }
    })
    // this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => this.fetchSourceOfFunds(this.state.pageNum))
  }

  handleChangeSourceOfIncome = (data) => {
    console.log(data);
    this.props.handleCompValueChange(true);
    this.setState({ sourceTypeIncomeArr: data, incomeSelectError: false })
  }

  handleViewSourceOfIncomeValues = (data) => {
    console.log(data);
    this.props.handleCompValueChange(true);
    this.setState({ sourceTypeIncomeArr: data, incomeSelectError: false })
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

  handleSearchData = (data) => {
    this.setState({ query: data, loaderMessage: 'Retrieving Data',pageNum:0 }, () => {
      if (this.state.query.length == 0) {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchSourceOfFunds(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchSourceOfFunds(this.state.pageNum);
      }
    })
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

  handleSelect = (data, fromPage, type) => {
    switch (fromPage, type) {
      case ('SourceOfFunds', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.props.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
            search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchSourceOfFunds(0);
        });
      break;
      case ('SourceOfFunds', 'columnFilter'):
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchSourceOfFunds(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false}, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchSourceOfFunds(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${7}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchSourceOfFunds(this.state.pageNum);
            })
          }
        });
      break;
    }
  }

  createSourceOfFunds = () => {
    if (this.state.sourceTypeIncomeArr.length == 0) {
      this.setState({ incomeSelectError: true, incomeSelectErrorMsg: 'Select valid Source Of Income.' })
    }
    else {
      let data = {};
      data.sourceOfFundsIds = [];
      this.state.sourceTypeIncomeArr.map((obj) => {
        data.sourceOfFundsIds.push(obj.id);
      });

      if (data.sourceOfFundsIds.length > 0) {
        if(sessionStorage.getItem('token') == undefined){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else{
          let headers = {
            Authorization:sessionStorage.getItem('token')
          }
          this.setState({ shownogeneralrules: false, loading: true, loaderMessage: 'Posting Data' }, () => {
            ApiService.buildSourceOfFunds(data, this.props.props.draweeProductId,headers)
              .then((response) => {
                if (response.status == 200) {
                  this.setState({ serverError: false, snackbar: false, notificationType: 'warning', snackbarMessage: response.data.message, loading: false, loaderMessage: '', incomeSelectError: false, sourceTypeIncomeArr: [], shownogeneralrules: true, apiErrMsg: response.data.message + '. Add Value to be passed for each bank' }, () => {
                  });
                  this.props.getNewBadge();
                  this.props.handleCompValueChange(false);
                  this.fetchSourceOfFunds(0);
                }
              })
              .catch(error => {
                console.log(error.response);
                if(Exceptionhandler.throwErrorType(error).status == 401){
                  window.location.replace(config.PAAS_LOGIN_URL);
                  return (<h1>401 - Unauthorized Request</h1>)
                }
                else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
                  this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message, incomeSelectError: false })
                }
                else {
                  this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error || error.response.data.message, actionType: 'OK', incomeSelectError: false })
                }
              });
          })
        }
      }
    }
  }

  getChangedRoutingValue = (data, index, type) => {
    this.props.handleCompValueChange(true);
    switch (type) {
      case 'profilesourcefundcode':
        if (data.length == 0) {
          this.setState({
            snackbar: false
          }, () => {
            this.setState({ snackbar: false, notificationType: 'warning', snackbarMessage: 'Value to be passed cannot be empty' }, () => {
              let sourceOfIncomelist = this.state.sourceOfIncomelist;
              sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCodeisEmpty = false;
              sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCode = data;
              this.setState({
                sourceOfIncomelist
              })
            })
          })
        }
        else {
          this.setState({ snackbar: false, snackbarMessage: '' }, () => {
            let sourceOfIncomelist = this.state.sourceOfIncomelist;
            sourceOfIncomelist.data[index].valueToBePassedisEditClick = false;
            sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCode = data;
            this.setState({
              sourceOfIncomelist
            })
          })
        }
      break;
    }
  }

  handleToggleAction = (field, index) => {
    let data = {};
    if ((field == 'Disable') || (field == 'Enable')) {
      let bankObj = this.state.sourceOfIncomelist.data[index];
      data.status = (field == 'Disable') ? 'DISABLED' : 'ENABLED';
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        this.setState({ snackbar: false, loading: true, loaderMessage: 'Posting Data' }, () => {
          ApiService.buildUpdateSourceOfFundsStatus(data, this.props.props.draweeProductId, bankObj.id, headers)
            .then((response) => {
              console.log(response);
              if (response.status == 200) {
                this.props.handleCompValueChange(false);
                this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Source Of Funds updated successfully', loading: false, loaderMessage: '', incomeSelectError: false, sourceTypeIncomeArr: [] }, () => {
                  this.fetchSourceOfFunds(0);
                });
              }
            })
            .catch(error => {
              console.log(error.response);
              if(Exceptionhandler.throwErrorType(error).status == 401){
                window.location.replace(config.PAAS_LOGIN_URL);
                return (<h1>401 - Unauthorized Request</h1>)
              }
              else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
                this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message, incomeSelectError: false })
              }
              else {
                this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK', incomeSelectError: false })
              }
            });
        })
      }
    }
    else if (field == 'edit') {
      console.log(field);
      let sourceOfIncomelist = this.state.sourceOfIncomelist;
      let bankObj = sourceOfIncomelist.data[index];
      if (bankObj.draweeBankProductProfileSourceOfFundsCode.length > 0 || bankObj.draweeBankProductProfileSourceOfFundsCode.length == 0) {
        let bankObj1 = sourceOfIncomelist.data[index];
        bankObj1.valueToBePassededitClicked = true;
        bankObj1.valueToBePassedisEditClick = false;
        sourceOfIncomelist.data[index] = bankObj1;
        this.setState({ sourceOfIncomelist: sourceOfIncomelist },()=>{
          document.getElementById("standard-name"+index).focus();
        });
      }
    }
    else {
      this.getActivity(index);
    }
  }

  handleRoutingValueCheck = (index, check, ruleId, type) => {
    console.log(index, check, ruleId, type);
    let sourceOfIncomelist = this.state.sourceOfIncomelist;
    switch (type) {
      case 'profilesourcefundcode':
        if (sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCode.length == 0) {
          this.setState({
            snackbar: false
          }, () => {
            this.setState({ snackbar: false, notificationType: 'warning', snackbarMessage: 'Value to be passed cannot be empty' });
          })
        }
        else {
          // api logic
          this.setState({ snackbar: false, snackbarMessage: '' }, () => {
            let data = {};
            data.draweeBankProductProfileSourceOfFundsCode = sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCode;
            if(sessionStorage.getItem('token') == undefined){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else{
              let headers = {
                Authorization:sessionStorage.getItem('token')
              }
              ApiService.buildUpdateSourceOfFundsFieldsCodeValue(data, this.props.props.draweeProductId, ruleId, headers)
                .then((response) => {
                  console.log(response);
                  if (response.status == 200) {
                    this.props.handleCompValueChange(false);
                    this.setState({ snackbar: true, notificationType: 'success', snackbarMessage: response.data.message, loader: false }, () => {
                      this.fetchSourceOfFunds(0);
                    })
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
            }
          })
        }
    }
  }

  handleModalResponse = (data) => {
    if (data == true) {
      this.setState({ shownogeneralrules: false });
    }
  }

  handleViewActivity = (data) => {
    this.setState({ isViewActivityClicked: data });
  }

  getBlurRoutingValue = (value,type,index) => {
    console.log(value,type,index);
    let sourceOfIncomelist = this.state.sourceOfIncomelist;
    this.props.handleCompValueChange(true);
    switch (type) {
      case 'profilesourcefundcode':
        // if (sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCode.length == 0) {
        //   this.setState({ snackbar: false, snackbarMessage: '' }, () => {
        //     let sourceOfIncomelist = this.state.sourceOfIncomelist;
        //     sourceOfIncomelist.data[index].valueToBePassedisEditClick = false;
        //     sourceOfIncomelist.data[index].valueToBePassededitClicked = false;
        //     sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCode = '';
        //     this.setState({
        //       sourceOfIncomelist
        //     })
        //   })
        // }
        // else {
          this.setState({ snackbar: false, snackbarMessage: '' }, () => {
            let data = {};
            data.draweeBankProductProfileSourceOfFundsCode = sourceOfIncomelist.data[index].draweeBankProductProfileSourceOfFundsCode;
            if(sessionStorage.getItem('token') == undefined){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else{
              let headers = {
                Authorization:sessionStorage.getItem('token')
              }
              let ruleId = sourceOfIncomelist.data[index].id;
              ApiService.buildUpdateSourceOfFundsFieldsCodeValue(data, this.props.props.draweeProductId, ruleId, headers)
                .then((response) => {
                  console.log(response);
                  if (response.status == 200) {
                    this.props.handleCompValueChange(false);
                    this.setState({ snackbar: true, notificationType: 'success', snackbarMessage: 'value for the source of income updated successfully', loader: false }, () => {
                      this.fetchSourceOfFunds(0);
                    })
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
            }
          })
        // }
      break;
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <TabContainer>
        <div className={classes.root}>
          {

            this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
              <div className="grid">
                <p className="bank-profile global-font">Source Of Funds</p>

                {
                  this.state.loading ?
                    <Loader action={this.state.loaderMessage} />
                    :
                    <div>
                      <Grid container spacing={24}>
                        <Grid item xs={12} className="grid-error">
                          <div className="beneficiary-bank-multiselect-container">
                            <div className="beneficiary-bank-multiselect beneficiary-bank-multiselect-fullwidth">
                              <MultiSelectTextField value={this.state.sourceTypeIncomeArr} label='Select Income Description' type='agentbranches' MultiSelectText='Source of Funds' suggestionFields={this.state.suggestedFields} placeholder={'Select Multiple Sources of Incomes'}
                                getAutoSelectValue={this.handleChangeSourceOfIncome} getViewValues={this.handleViewSourceOfIncomeValues} />
                              <div className="beneficiary-bank-multiselect-addbutton">
                                <Button variant="contained" umStyle="primary" style={{ width: 100 }} onClick={this.createSourceOfFunds}>
                                  Add
                                </Button>
                              </div>
                            </div>
                            {this.state.incomeSelectError ? <span className="errorMessage-add">{this.state.incomeSelectErrorMsg} </span> : ''}
                          </div>
                        </Grid>
                      </Grid>
                      <Card>
                        {
                          (((this.state.sourceOfIncomeLen == 0) && (this.state.fromSearch == true)) || (this.state.sourceOfIncomeLen != 0)) ?
                            // logic
                            <div>
                              <Grid container spacing={24} className="page-element-grid" justify="space-between">
                                <Grid item xs={1}>
                                  <Select fromPage="SourceOfFundsRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                                </Grid>
                                <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                                <Grid item xs={5}>
                                  <Grid direction="row" container spacing={24} justify="flex-end" >
                                    <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                      <Select fromPage="SourceOfFunds" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                    </Grid>
                                    <Grid item xs={5} className="grid-error">
                                      <Search fromPage="SourceOfFunds" value={this.state.query} getSearchText={this.handleSearch} />
                                      <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </div> : null
                        }
                        {
                          ((this.state.fromSearch == true) && (this.state.sourceOfIncomeLen == 0)) ? <Noresult text="Source Of Funds" /> :
                            [
                              ((this.state.fromSearch == false) && (this.state.sourceOfIncomeLen == 0)) ?
                                <EmptyListComponent text="Source Of Funds" fromPage="SourceOfFunds" /> : null
                            ]
                        }
                        {
                          (this.state.sourceOfIncomeLen != 0) ?
                            <div>
                              <EnhancedTable sourceOfIncomelist={this.state.sourceOfIncomelist} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} getChangedRoutingValue={this.getChangedRoutingValue} handleRoutingValueCheck={this.handleRoutingValueCheck} handleToggleAction={this.handleToggleAction} getBlurRoutingValue={this.getBlurRoutingValue}/>
                              <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                            </div>
                            : null
                        }
                      </Card>
                    </div>
                }

              </div>
          }
          {
            this.state.shownogeneralrules ? <ErrorModal isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleModalResponse} /> : null
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
          {
            this.state.isViewActivityClicked ? <ViewActivity isOpen={this.state.isViewActivityClicked} viewActivity={this.handleViewActivity} activityDetails={this.state.activityDetails}/> : null
          }


        </div>
      </TabContainer>
    )
  }
}
export default withStyles(styles)(SourceOfFunds);