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
import EmptyListComponent from '../../component/EmptylistComponent';
import Pagination from '../../container/Pagination';
import '../../theme/theme';
import Noresult from '../../component/NoResults';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import * as Exceptionhandler from '../../ExceptionHandling';
import * as BanksApiService from '../../Banks/BanksApiService';
import * as ApiService from './ApiService';
import ErrorModal from './../../component/ErrorModalbox';
import ViewActivity from './viewActivity';
import Card from '@material-ui/core/Card';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import * as config from './../../config/config';
import moment from 'moment';

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

const selectLabels = [{ 'id': 1, 'label': 'Bank Name', 'value': 'bankName' }, { 'id': 2, 'label': 'Bank Code', 'value': 'bankCode' }, { 'id': 3, 'label': 'Routing Id', 'value': 'routingId' }];
const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

class BeneficiaryMapping extends Component {
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
      viewActivity: false,
      mockData: [],
      suggestedFields: [],
      agentBranchesDisabled: false,
      custTypeCountryArr: [],
      bankSelectError: false,
      bankSelectErrorMsg: '',
      apiErrMsg: '',
      shownogeneralrules: false,
      isViewActivityClicked: false,
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
              //this.fetchCountryRestrictions(this.state.pageNum);
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
              //this.fetchCountryRestrictions(this.state.pageNum);
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
              this.fetchBankBeneficiary(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchBankBeneficiary(this.state.pageNum);
        })
      }
    })
    this.props.handleCompValueChange(false);
    this.fetchAllBanks();
  }

  getActivity = (index) => {
    let bankObj = this.state.bankList.data[index]; 
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

  fetchAllBanks = () => {
    let params = {
      // pagenumber: null
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
        BanksApiService.getAllBanks(params,headers)
          .then((response) => {
            //console.log(response);
            if (response.status == 200) {
              let suggestedFields = [];
              if (response.data.total > 0) {
                response.data.data.map((obj) => {
                  let bankObj = {};
                  bankObj.id = obj.bankId;
                  bankObj.field = obj.bankName;
                  bankObj.label = obj.bankCode + '-' + obj.bankName;
                  suggestedFields.push(bankObj);
                })
                this.setState({ suggestedFields, loading: false, loaderMessage: '' });
              }
              else {
                this.setState({ loading: false, loaderMessage: '', snackbar: true, notificationType: 'warning', snackbarMessage: 'No bank records found', agentBranchesDisabled: true });
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

  fetchBankBeneficiary = (pgno) => {
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
        ApiService.buildFetchBeneficiaryBanks(params, this.props.props.draweeProductId,headers)
          .then((response) => {
            console.log(response)
            if (response.status == 200) {
              let data = {};
              data.data = [];
              if (response.data.total > 0) {
                response.data.data.map((obj) => {
                  let bankObj = {};
                  bankObj.bankCode = obj.bankCode;
                  bankObj.id = obj.id;
                  bankObj.bankName = obj.bankName;
                  bankObj.status = obj.status;
                  bankObj.routingId = (obj.routingId == null) ? '' : obj.routingId;
                  bankObj.isEmpty = (obj.routingId == null) ? true : false;
                  bankObj.isEditClick = false;
                  bankObj.editClicked = false;
                  data.data.push(bankObj);
                })
              }
              this.setState({ serverError: false, bankList: data, bankListLen: response.data['data'].length, totalRecords: response.data.total, loading: false, loaderMessage: '' });
            }
          })
          .catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 400) {
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
          search: `?tabId=${5}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchBankBeneficiary(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${5}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchBankBeneficiary(this.state.pageNum);
      }
    })
    // this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => this.fetchBankBeneficiary(this.state.pageNum))
  }

  handleChangeCustAgentBranch = (data) => {
    this.setState({ custTypeCountryArr: data, bankSelectError: false })
  }

  handleViewCustAgentBranchValues = (data) => {
    this.setState({ custTypeCountryArr: data, bankSelectError: false })
  }

  createBankBeneficiary = () => {
    if (this.state.custTypeCountryArr.length == 0) {
      this.setState({ bankSelectError: true, bankSelectErrorMsg: 'Select valid Bank' })
    }
    else {
      let data = {};
      data.bankId = [];
      this.state.custTypeCountryArr.map((obj) => {
        data.bankId.push(obj.id);
      });
      if (data.bankId.length > 0) {
        if(sessionStorage.getItem('token') == undefined){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else{
          let headers = {
            Authorization:sessionStorage.getItem('token')
          }
          this.setState({ loading: true, loaderMessage: 'Posting Data' }, () => {
            ApiService.buildCreateBeneficiaryBanks(data, this.props.props.draweeProductId,headers)
              .then((response) => {
                console.log(response)
                if (response.status == 200) {
                  this.props.getNewBadge();
                  this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Beneficiary Banks added successfully', loading: false, loaderMessage: '', bankSelectError: false, custTypeCountryArr: [], shownogeneralrules: true, apiErrMsg: response.data.message +'. Add the Routing Ids against each banks' }, () => {
                    this.fetchBankBeneficiary(0);
                  });
                }
              })
              .catch(error => {
                console.log(error.response);
                if(Exceptionhandler.throwErrorType(error).status == 401){
                  window.location.replace(config.PAAS_LOGIN_URL);
                  return (<h1>401 - Unauthorized Request</h1>)
                }
                else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 400) {
                  this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message, bankSelectError: false })
                }
                else {
                  this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error || error.response.data.message, actionType: 'OK', bankSelectError: false })
                }
              });
          })
        }
      }
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

  handleSearchData = (data) => {
    this.setState({ query: data, loaderMessage: 'Retrieving Data',pageNum:0 }, () => {
      this.props.props.props.history.push({
        pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
        search: `?tabId=${5}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
      })
      this.fetchBankBeneficiary(this.state.pageNum);
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

  handleSelect = (data, fromPage, type) => {
    switch (fromPage, type) {
      case ('BeneficiaryBank', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.props.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
            search: `?tabId=${5}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchBankBeneficiary(0);
        });
        break;
      case ('BeneficiaryBank', 'columnFilter'):
        //sessionStorage.setItem('draweebanksFilter',JSON.stringify(data));
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            // sessionStorage.setItem('draweebankquery',JSON.stringify(this.state.query));
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(this.state.columnFilter));
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${5}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchBankBeneficiary(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(''));
            // sessionStorage.setItem('draweebankquery',JSON.stringify(''));
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${5}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchBankBeneficiary(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              //sessionStorage.setItem('draweebankquery',JSON.stringify(''));
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${5}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchBankBeneficiary(this.state.pageNum);
            })
          }
        });
        break;
    }
  }

  getChangedRoutingValue = (data, index) => {
    console.log(data);
    this.props.handleCompValueChange(true);
    let regex = /^[a-zA-Z0-9 ]*$/gm;
    if(regex.test(data)){
      let bankList = this.state.bankList;
      bankList.data[index].isEditClick = false;
      bankList.data[index].routingId = data;
      this.setState({
        bankList
      })
    }
    else {
      this.setState({snackbar:false},()=>{
        this.setState({snackbar:true,notificationType:'warning',snackbarMessage:'Only Alphanumerics are allowed'})
      })
    }
    
  }

  handleToggleAction = (field, index) => {
    let data = {};
    if ((field == 'Disable') || (field == 'Enable')) {
      let bankObj = this.state.bankList.data[index];
      data.status = (field == 'Disable') ? 'DISABLED' : 'ENABLED';
      data.routingId = bankObj.routingId;
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        this.setState({ snackbar: false, loading: true, loaderMessage: 'Posting Data' }, () => {
          ApiService.buildEditBeneficiaryBanks(data, this.props.props.draweeProductId, bankObj.id,headers)
            .then((response) => {
              console.log(response);
              if (response.status == 200) {
                this.props.handleCompValueChange(false);
                this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Beneficiary Bank updated successfully', loading: false, loaderMessage: '', bankSelectError: false, custTypeCountryArr: [] }, () => {
                  this.fetchBankBeneficiary(0);
                });
              }
            })
            .catch(error => {
              console.log(error.response);
              if(Exceptionhandler.throwErrorType(error).status == 401){
                window.location.replace(config.PAAS_LOGIN_URL);
                return (<h1>401 - Unauthorized Request</h1>)
              }
              else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 400) {
                this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message, bankSelectError: false })
              }
              else {
                this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK', bankSelectError: false })
              }
            });
        })
      }
    }
    else if (field == 'edit') {
      //console.log(field);
      let bankList = this.state.bankList;
      let bankObj = bankList.data[index];
      if (bankObj.routingId.length > 0 || bankObj.routingId.length == 0) {
        let bankObj1 = bankList.data[index];
        bankObj1.editClicked = true;
        bankObj1.isEditClick = false;
        bankList.data[index] = bankObj1;
        this.setState({ bankList: bankList },()=>{
          document.getElementById("standard-name"+index).focus();
        });
      }
    }
    else {
      this.getActivity(index);
    }
  }

  handleRoutingValueCheck = (index, check, ruleId) => {
    let bankList = this.state.bankList;
    this.setState({ snackbar: false }, () => {
      if (bankList.data[index].routingId.length == 0) {
        this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'Routing Id cannot be empty' });
      }
      else {
        let data = {};
        data.status = bankList.data[index].status;
        data.routingId = bankList.data[index].routingId;
        if(sessionStorage.getItem('token') == undefined){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else{
          let headers = {
            Authorization:sessionStorage.getItem('token')
          }
        ApiService.buildEditBeneficiaryBanks(data, this.props.props.draweeProductId, ruleId, headers)
          .then((response) => {
            //console.log(response);
            if (response.status == 200) {
              this.props.handleCompValueChange(false);
              this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Beneficiary Bank updated successfully', loading: false, loaderMessage: '', bankSelectError: false, custTypeCountryArr: [] }, () => {
                this.fetchBankBeneficiary(0);
              });
            }
          })
          .catch(error => {
            //console.log(error.response);
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message, bankSelectError: false })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK', bankSelectError: false })
            }
          });
        }
      }
    })
    // bankList.data[index].isEditClick = check;
    // this.setState({
    //   bankList 
    // }) 
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
    this.props.handleCompValueChange(true);
    let bankList = this.state.bankList;
    let data = {};
        data.status = bankList.data[index].status;
        data.routingId = bankList.data[index].routingId;
        if(sessionStorage.getItem('token') == undefined){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else{
          let headers = {
            Authorization:sessionStorage.getItem('token')
          }
          let ruleId = bankList.data[index].id;
        ApiService.buildEditBeneficiaryBanks(data, this.props.props.draweeProductId, ruleId, headers)
          .then((response) => {
            //console.log(response);
            if (response.status == 200) {
              this.props.handleCompValueChange(false);
              this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Beneficiary Bank Routing Id updated successfully', loading: false, loaderMessage: '', bankSelectError: false, custTypeCountryArr: [] }, () => {
                this.fetchBankBeneficiary(0);
              });
            }
          })
          .catch(error => {
            //console.log(error.response);
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message, bankSelectError: false })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK', bankSelectError: false })
            }
          });
        }
  }

  render() {
    const { classes } = this.props;
    return (
      <TabContainer >
        <div className={classes.root}>
          {
            this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
              <div className="grid">
                <p className="bank-profile global-font">Beneficiary Bank Mapping</p>
                {
                  this.state.loading ?
                    <Loader action={this.state.loaderMessage} />
                    :
                    <div>
                      <Grid container spacing={24}>
                        <Grid item xs={12} className="grid-error">
                          <div className="beneficiary-bank-multiselect-container">
                            <div className="beneficiary-bank-multiselect beneficiary-bank-multiselect-fullwidth">
                              <MultiSelectTextField disabled={this.state.agentBranchesDisabled} value={this.state.custTypeCountryArr} label='Bank Code' MultiSelectText='Beneficiary Bank Mapping' type='agentbranches' suggestionFields={this.state.suggestedFields} placeholder={'Select Multiple Banks'} getAutoSelectValue={this.handleChangeCustAgentBranch} getViewValues={this.handleViewCustAgentBranchValues} />
                              <div className="beneficiary-bank-multiselect-addbutton">
                                <Button variant="contained" umStyle="primary" style={{ width: 100 }} onClick={this.createBankBeneficiary}>
                                  Add
                                </Button>
                              </div>
                            </div>
                            {this.state.bankSelectError ? <span className="errorMessage-add">{this.state.bankSelectErrorMsg} </span> : ''}
                          </div>
                        </Grid>
                      </Grid>
                      <Card>
                        {
                          (((this.state.bankListLen == 0) && (this.state.fromSearch == true)) || (this.state.bankListLen != 0)) ?
                            // logic
                            <div>
                              <Grid container spacing={24} className="page-element-grid" justify="space-between">
                                <Grid item xs={1}>
                                  <Select fromPage="BeneficiaryBankRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                                </Grid>
                                <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                                <Grid item xs={5}>
                                  <Grid direction="row" container spacing={24} justify="flex-end" >
                                    <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                      <Select fromPage="BeneficiaryBank" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                    </Grid>
                                    <Grid item xs={5} className="grid-error">
                                      <Search fromPage="BeneficiaryBank" value={this.state.query} getSearchText={this.handleSearch} />
                                      <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </div> : null
                        }
                        {
                          ((this.state.fromSearch == true) && (this.state.bankListLen == 0)) ? <Noresult text="Beneficiary Banks" /> :
                            [
                              ((this.state.fromSearch == false) && (this.state.bankListLen == 0)) ?
                                <EmptyListComponent text="Beneficiary Banks" fromPage="BeneficiaryBanks" /> : null
                            ]
                        }
                        {
                          (this.state.bankListLen != 0) ?
                            <div>
                              <EnhancedTable bankList={this.state.bankList} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} getChangedRoutingValue={this.getChangedRoutingValue} handleRoutingValueCheck={this.handleRoutingValueCheck} handleToggleAction={this.handleToggleAction} getBlurRoutingValue={this.getBlurRoutingValue}/>
                              <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                            </div>
                            : null
                        }
                      </Card>
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
          }
        </div>
      </TabContainer>
    )
  }
}

export default withStyles(styles)(BeneficiaryMapping);