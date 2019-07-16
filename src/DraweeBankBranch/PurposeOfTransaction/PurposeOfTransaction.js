import React, { Component } from 'react';
import EnhancedTable from './EnhancedTable';
import Search from '../../container/Search';
import Select from '../../container/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import '../../vendor/common.css';
import rows from './EnhancedTableHeader';
import Loader from '../../component/Loader';
import EmptyListComponent from '../../component/EmptylistComponent';
import Pagination from '../../container/Pagination';
import '../../theme/theme';
import Noresult from '../../component/NoResults';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import * as Exceptionhandler from '../../ExceptionHandling';
import * as ApiService from './ApiService';
import ErrorModal from './../../component/ErrorModalbox';
import ViewActivity from './ViewActivity';
import Card from '@material-ui/core/Card';
import { Selectable, Button, Notifications } from 'finablr-ui';
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

const selectLabels = [{ 'id': 1, 'label': 'Category', 'value': 'CATEGORY_NAME' }, { 'id': 2, 'label': 'Purpose', 'value': 'PURPOSE_NAME' }, { 'id': 3, 'label': 'Codes', 'value': 'PURPOSE_CODE' }, { 'id': 4, 'label': 'Max Payout Amount', 'value': 'MAX_AMOUNT' }, { 'id': 5, 'label': 'Value to be Passed', 'value': 'VALUE_TO_BE_PASSED' }];
const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

class PurposeOfTransaction extends Component {
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
      suggestedFields: [],
      apiErrMsg: '',
      shownogeneralrules: false,
      isViewActivityClicked: false,
      categoryDisabled: false,
      categoryList: [],
      category: '',
      categoryData: {},
      categoryCheck: false,
      categoryerrMsg: '',
      purpose: '',
      custTypeCountryArr: [],
      purposeTypeDisabled: true,
      purposeError: false,
      purposeerrMsg: "",
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
              this.fetchPurposeList(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchPurposeList(this.state.pageNum);
        })
      }
    })
    this.props.handleCompValueChange(false);
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

  fetchPurposeTypes = () => {
    // let params = {
    //   pagenumber:0
    // };
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, loaderMessage: 'Retrieving Data' }, () => {
        ApiService.buildFetchCategoryTypes(headers)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              let categoryList = [];
              if (response.data.purposeCodeCategory.length > 0) {
                response.data.purposeCodeCategory.map((obj) => {
                  let purposeType = {};
                  purposeType.id = obj.id;
                  purposeType.value = obj.category;
                  purposeType.label = obj.category;
                  categoryList.push(purposeType);
                })
                this.setState({ categoryList, loading: false, loaderMessage: '' }, () => {
                  console.log(this.state.categoryList);
                });
              }
              else if (response.data.purposeCodeCategory.length == 0) {
                this.setState({ loading: false, loaderMessage: '', snackbar: true, notificationType: 'warning', snackbarMessage: 'No categories found', categoryDisabled: true, purposeTypeDisabled: true });
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

  fetchPurposeTypesList = (id) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, loaderMessage: 'Retrieving Data' }, () => {
        ApiService.buildFetchPurposeTypes(id,headers)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.fetchPurposeTypes();
              let suggestedFields = [];
              if (response.data.purposeCodeListResponse.length > 0) {
                response.data.purposeCodeListResponse.map((obj) => {
                  let purposeType = {};
                  purposeType.id = obj.id;
                  purposeType.label = obj.name;
                  purposeType.field = obj.purposeId;
                  suggestedFields.push(purposeType);
                })
                this.setState({ suggestedFields, loading: false, loaderMessage: '', purposeTypeDisabled: false }, () => {
                  console.log(this.state.suggestedFields);
                });
              }
              else if (response.data.purposeCodeListResponse.length == 0) {
                this.setState({ loading: false, loaderMessage: '', snackbar: true, notificationType: 'warning', snackbarMessage: 'No purpose types found', purposeTypeDisabled: true });
              }
            }
          }).catch(error => {
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

  fetchPurposeList = (pgno) => {
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
    ApiService.buildFetchPurposeList(params, this.props.props.draweeProductId,headers)
      .then((response) => {
        console.log(response)
        if (response.status == 200) {
          let data = {};
          data.data = [];
          if (response.data.total > 0) {
            response.data.data.map((obj) => {
              let purposeObj = {};
              purposeObj.categoryName = obj.categoryName;
              purposeObj.id = obj.id;
              purposeObj.purposeName = obj.purposeName;
              purposeObj.purposeCode = obj.purposeCode;
              purposeObj.status = obj.status;
              purposeObj.maxAmount = (obj.maxAmount == 0) ? '' : obj.maxAmount;
              purposeObj.maxAmountisEmpty = (obj.maxAmount == 0) ? true : false;
              purposeObj.maxAmountisEditClick = false;
              purposeObj.maxAmounteditClicked = false;
              purposeObj.valueToBePassed = (obj.valueToBePassed == null) ? '' : obj.valueToBePassed;
              purposeObj.valueToBePassedisEmpty = (obj.valueToBePassed == null) ? true : false;
              purposeObj.valueToBePassedisEditClick = false;
              purposeObj.valueToBePassededitClicked = false;
              data.data.push(purposeObj);
            })
          }
          this.setState({ serverError: false, bankList: data, bankListLen: response.data['data'].length, totalRecords: response.data.total, loaderMessage: '' }, () => {
            this.fetchPurposeTypes();
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
    }
  }

  handleChange = (e, id) => {
    console.log(e, id);
    switch (id) {
      case 'category':
        this.setState({ category: e, categoryCheck: false }, () => {
          if (this.state.category == undefined) {
            this.setState({ categoryCheck: true, categoryerrMsg: 'Category cannot be empty', categoryData: {}, purpose: '', purposeTypeDisabled: true, custTypeCountryArr: [] }, () => {
              // this.handleSaveEnable();
            })
          }
          else if (this.state.category.length == 0) {
            this.setState({ categoryCheck: true, categoryerrMsg: 'Category cannot be empty', categoryData: {}, purpose: '', purposeTypeDisabled: true, custTypeCountryArr: [] }, () => {
              // this.handleSaveEnable();
            })
          }
          else if(this.state.category.length > 0){
            this.state.categoryList.map((obj)=>{
              if(this.state.category == obj.value){
                this.props.handleCompValueChange(true);
                this.setState({ categoryData: obj, category: obj.value, purpose: '', purposeTypeDisabled: true, custTypeCountryArr: [] }, () => {
                  this.fetchPurposeTypesList(this.state.categoryData.id);
                })
              }
            })
          }
          else {
            // this.handleSaveEnable();
          }
        });
        break;
    }
  }

  handleValueClick = (e, id) => {
    console.log(e, id);
    switch (id) {
      case 'category':
        this.setState({ categoryData: {} }, () => {
          this.props.handleCompValueChange(true);
          let value = e.value;
          this.setState({ categoryData: e, category: value, purpose: '', purposeTypeDisabled: true, custTypeCountryArr: [] }, () => {
            this.fetchPurposeTypesList(this.state.categoryData.id);
          })
        })
        break;
    }
  }

  handleBlur = (e) => {
    // console.log(e.target.id);
    switch (e.target.id) {
      case 'category':
        this.setState({ categoryCheck: false }, () => {
          if (this.state.category == undefined) {
            this.setState({ categoryCheck: true, categoryerrMsg: 'Category cannot be empty', categoryData: {}, purpose: '', purposeTypeDisabled: true, custTypeCountryArr: [] }, () => {
              // this.handleSaveEnable();
            })
          }
          else if (this.state.category.length == 0) {
            this.setState({ categoryCheck: true, categoryerrMsg: 'Category cannot be empty', categoryData: {}, purpose: '', purposeTypeDisabled: true, custTypeCountryArr: [] }, () => {
              // this.handleSaveEnable();
            })
          }
          else {
            // this.handleSaveEnable();
          }
        })
        break;
    }
  }

  createPurposeOfTransaction = () => {
    if ((Object.keys(this.state.categoryData).length == 0) || (this.state.categoryCheck == true) || (this.state.category.length == 0)) {
      this.setState({ categoryCheck: true, categoryerrMsg: 'Select valid category' })
    }
    else if (this.state.custTypeCountryArr.length == 0) {
      this.setState({ purposeError: true, purposeerrMsg: 'Select valid purpose types' })
    }
    else {
      // api logic
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        this.setState({ shownogeneralrules: false, loading: true, loaderMessage: 'Posting Data', categoryCheck: false, purposeError: false }, () => {
          let data = {};
          data.categoryId = this.state.categoryData.id;
          data.purposeCodeId = [];
          this.state.custTypeCountryArr.map((obj) => {
            data.purposeCodeId.push(obj.id);
          })
          ApiService.buildCreatePurposeList(data, this.props.props.draweeProductId,headers)
            .then((response) => {
              console.log(response)
              if (response.status == 200) {
                this.setState({ snackbar: false, notificationType: 'success', snackbarMessage: response.data.message, loader: false, category: '', categoryData: {}, custTypeCountryArr: [], purposeTypeDisabled: true, shownogeneralrules: true, apiErrMsg: response.data.message + '. Add Payout Amount and Value to be passed for each bank' }, () => {
                  this.props.handleCompValueChange(false);
                  this.props.getNewBadge();
                  this.fetchPurposeList(0);
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
        })
      }
    }
  }

  handleChangeCustAgentBranch = (data) => {
    this.setState({ custTypeCountryArr: data }, () => {
      if (this.state.custTypeCountryArr.length == 0) {
        this.setState({ purposeError: true, purposeerrMsg: 'Select valid purpose types' })
      }
      else {
        this.setState({ purposeError: false, purposeerrMsg: '' })
      }
    })
  }

  handleViewCustAgentBranchValues = (data) => {
    this.setState({ custTypeCountryArr: data }, () => {
      if (this.state.custTypeCountryArr.length == 0) {
        this.setState({ purposeError: true, purposeerrMsg: 'Select valid purpose types' })
      }
      else {
        this.setState({ purposeError: false, purposeerrMsg: '' })
      }
    })
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
          search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchPurposeList(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchPurposeList(this.state.pageNum);
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
      case ('PurposeRow', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.props.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
            search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchPurposeList(0);
        });
        break;
      case ('Purpose', 'columnFilter'):
        //sessionStorage.setItem('draweebanksFilter',JSON.stringify(data));
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            // sessionStorage.setItem('draweebankquery',JSON.stringify(this.state.query));
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(this.state.columnFilter));
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchPurposeList(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(''));
            // sessionStorage.setItem('draweebankquery',JSON.stringify(''));
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchPurposeList(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              //sessionStorage.setItem('draweebankquery',JSON.stringify(''));
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchPurposeList(this.state.pageNum);
            })
          }
        });
        break;
    }
  }

  getChangedRoutingValue = (data, index, type) => {
    this.props.handleCompValueChange(true);
    console.log(data, index, type);
    switch (type) {
      case 'allowedMaxAmount':
        var regexpDecimal = /^\d+\.\d{0,2}$/;
        var regNumbers = new RegExp('^[0-9]+$');
        //console.log(regexpDecimal.test(data),regNumbers.test(data));
        if (data.length == 0) {
          this.setState({ snackbar: false, notificationType: 'warning', snackbarMessage: 'Max amount cannot be empty' }, () => {
            let bankList = this.state.bankList;
            bankList.data[index].maxAmountisEditClick = false;
            bankList.data[index].maxAmount = data;
            this.setState({
              bankList
            })
          })
        }
        else if ((regNumbers.test(data) == true) || ((regNumbers.test(data) == false) && (regexpDecimal.test(data) == true))) {
          this.setState({ snackbar: false }, () => {
            let bankList = this.state.bankList;
            bankList.data[index].maxAmountisEditClick = false;
            bankList.data[index].maxAmount = data;
            this.setState({
              bankList
            })
          })
        }
        else {
          this.setState({ snackbar: true }, () => {
            this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'Enter only numeric values upto two decimals' })
          })
        }
        break;
      case 'valuePassed':
        if (data.length == 0) {
          this.setState({ snackbar: false, notificationType: 'warning', snackbarMessage: 'Value to be passed cannot be empty' }, () => {
            let bankList = this.state.bankList;
            bankList.data[index].valueToBePassedisEmpty = false;
            bankList.data[index].valueToBePassed = data;
            this.setState({
              bankList
            })
          })
        }
        else {
          this.setState({ snackbar: false, snackbarMessage: '' }, () => {
            let bankList = this.state.bankList;
            bankList.data[index].valueToBePassedisEditClick = false;
            bankList.data[index].valueToBePassed = data;
            this.setState({
              bankList
            })
          })
        }
        break;
    }
  }

  handleToggleAction = (field, index) => {
    let data = {};
    if ((field == 'Disable') || (field == 'Enable')) {
      let bankObj = this.state.bankList.data[index];
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
          ApiService.buildUpdatePurposeFieldsStatus(data, this.props.props.draweeProductId, bankObj.id,headers)
            .then((response) => {
              console.log(response);
              if (response.status == 200) {
                this.props.handleCompValueChange(false);
                this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Purpose Type updated successfully', loading: false, loaderMessage: '', bankSelectError: false, custTypeCountryArr: [] }, () => {
                  this.fetchPurposeList(0);
                });
              }
            })
            .catch(error => {
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
        })
      }
    }
    else if (field == 'edit') {
      let bankList = this.state.bankList;
      let bankObj = bankList.data[index];
      if (bankObj.maxAmount > 0 || bankObj.valueToBePassed.length > 0 || bankObj.maxAmount == 0 || bankObj.valueToBePassed.length == 0) {
        let bankObj1 = bankList.data[index];
        bankObj1.maxAmounteditClicked = true;
        bankObj1.maxAmountisEditClick = false;
        bankObj1.valueToBePassededitClicked = true;
        bankObj1.valueToBePassedisEditClick = false;
        bankList.data[index] = bankObj1;
        this.setState({ bankList: bankList },()=>{
          // document.getElementById("standard-name"+index).focus();
        });
      }
    }
    else {
      this.getActivity(index);
    }
  }

  handleRoutingValueCheck = (index, check, ruleId, type) => {
    this.setState({ snackbar: false });
    let bankList = this.state.bankList;
    console.log(bankList.data[index].maxAmount);
    console.log(bankList.data[index].valueToBePassed.length);
    switch (type) {
      case 'allowedMaxAmount':
        var regexpDecimal = /^\d+\.\d{0,2}$/;
        var regNumbers = new RegExp('^[0-9]+$');
        if (bankList.data[index].maxAmount.length == 0) {
          this.setState({ snackbar: false }, () => {
            this.setState({ snackbar: false, notificationType: 'warning', snackbarMessage: 'Max Amount cannot be empty' });
          })
        }
        else if (bankList.data[index].maxAmount == 0 || bankList.data[index].maxAmount == null) {
          this.setState({ snackbar: false }, () => {
            this.setState({ snackbar: false, notificationType: 'warning', snackbarMessage: 'Max Amount cannot be 0' });
          })
        }
        else {
          // api logic
          this.setState({ snackbar: false, snackbarMessage: '' }, () => {
            let data = {};
            data.maxPayableAmount = bankList.data[index].maxAmount;
            if(sessionStorage.getItem('token') == undefined){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else{
              let headers = {
                Authorization:sessionStorage.getItem('token')
              }
              ApiService.buildUpdatePurposeFieldsMaxAmount(data, this.props.props.draweeProductId, ruleId, headers)
                .then((response) => {
                  console.log(response)
                  if (response.status == 200) {
                    this.props.handleCompValueChange(false);
                    this.setState({ snackbar: true, notificationType: 'success', snackbarMessage: response.data.message, loader: false }, () => {
                      this.fetchPurposeList(0);
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
        break;
      case 'valuePassed':
        if (bankList.data[index].valueToBePassed.length == 0) {
          this.setState({ snackbar: false }, () => {
            this.setState({ snackbar: false, notificationType: 'warning', snackbarMessage: 'Value to be passed cannot be empty' });
          })
        }
        else {
          // api logic
          this.setState({ snackbar: false, snackbarMessage: '' }, () => {
            let data = {};
            data.purposeCodevalue = bankList.data[index].valueToBePassed;
            if(sessionStorage.getItem('token') == undefined){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else{
              let headers = {
                Authorization:sessionStorage.getItem('token')
              }
            ApiService.buildUpdatePurposeFieldsCodeValue(data, this.props.props.draweeProductId, ruleId, headers)
              .then((response) => {
                console.log(response);
                if (response.status == 200) {
                  this.props.handleCompValueChange(false);
                  this.setState({ snackbar: true, notificationType: 'success', snackbarMessage: response.data.message, loader: false }, () => {
                    this.fetchPurposeList(0);
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

  handlePagingListing = (pgno) => {
    console.log(pgno);
    this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => {
      if ((this.state.columnFilter.length > 0) && (this.state.query.length > 0)) {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchPurposeList(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${6}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchPurposeList(this.state.pageNum);
      }
    })
  }

  getBlurRoutingValue = (value,type,index) => {
    console.log(value,type,index);
    let bankList = this.state.bankList;
    let ruleId = this.state.bankList.data[index].id;
    this.props.handleCompValueChange(true);
    switch (type) {
      case 'allowedMaxAmount':
      let data = {};
      data.maxPayableAmount = bankList.data[index].maxAmount;
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        ApiService.buildUpdatePurposeFieldsMaxAmount(data, this.props.props.draweeProductId, ruleId, headers)
        .then((response) => {
          console.log(response)
          if (response.status == 200) {
            this.props.handleCompValueChange(false);
            this.setState({ snackbar: true, notificationType: 'success', snackbarMessage: response.data.message, loader: false }, () => {
              this.fetchPurposeList(0);
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
      break;
      case 'valuePassed':
        data = {};
        data.purposeCodevalue = bankList.data[index].valueToBePassed;
        if(sessionStorage.getItem('token') == undefined){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else{
          let headers = {
            Authorization:sessionStorage.getItem('token')
          }
        ApiService.buildUpdatePurposeFieldsCodeValue(data, this.props.props.draweeProductId, ruleId, headers)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.props.handleCompValueChange(false);
              this.setState({ snackbar: true, notificationType: 'success', snackbarMessage: response.data.message, loader: false }, () => {
                this.fetchPurposeList(0);
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
                <p className="bank-profile global-font">Purpose of Transaction</p>
                {
                  this.state.loading ?
                    <Loader action={this.state.loaderMessage} />
                    :
                    <div>
                      <div className="beneficiary-bank-multiselect-container">
                        <Grid container spacing={24}>
                          <Grid item xs={6} className="grid-error">
                            <Selectable
                              id="category"
                              isRequired
                              searchable={true}
                              label='Select Category'
                              value={this.state.category}
                              options={this.state.categoryList}
                              noResultsText="No Category Found"
                              searchBy={'label'}
                              placeholder="Select Category"
                              onChange={(e) => this.handleChange(e, 'category')}
                              onValueClick={(e) => this.handleValueClick(e, 'category')}
                              onBlur={this.handleBlur}
                            />
                            {this.state.categoryCheck ? <span className="errorMessage">{this.state.categoryerrMsg} </span> : ''}
                          </Grid>
                          <Grid item xs={12} className="beneficiary-bank-multiselect">
                            <MultiSelectTextField disabled={this.state.purposeTypeDisabled}
                              value={this.state.custTypeCountryArr} label='Purpose' type='purpose'
                              MultiSelectText='Purpose of Transaction'
                              suggestionFields={this.state.suggestedFields} placeholder={'Select Multiple Purpose' + 's'} getAutoSelectValue={this.handleChangeCustAgentBranch} getViewValues={this.handleViewCustAgentBranchValues} />
                            <div className="purpose-bank-multiselect-addbutton">
                              <Button style={{ width: 100 }} umStyle="primary" onClick={this.createPurposeOfTransaction}>Add</Button>
                            </div>
                            {this.state.purposeError ? <span className="errorMessage">{this.state.purposeerrMsg} </span> : ''}
                          </Grid>
                        </Grid>
                      </div>
                      <Card>
                      {
                        (((this.state.bankListLen == 0) && (this.state.fromSearch == true)) || (this.state.bankListLen != 0)) ?
                          // logic
                          <div>
                            <Grid container spacing={24} className="page-element-grid" justify="space-between">
                              <Grid item xs={1}>
                                <Select fromPage="PurposeRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                              </Grid>
                              <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                              <Grid item xs={5}>
                                <Grid direction="row" container spacing={24} justify="flex-end" >
                                  <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                    <Select fromPage="Purpose" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                  </Grid>
                                  <Grid item xs={5} className="grid-error">
                                    <Search fromPage="Purpose" value={this.state.query} getSearchText={this.handleSearch} />
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
                                <EmptyListComponent text="Purpose of Transactions" fromPage="PurposeOfTransactions" /> : null
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

export default withStyles(styles)(PurposeOfTransaction);
