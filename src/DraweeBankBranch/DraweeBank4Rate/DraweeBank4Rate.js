import React, { Component } from 'react';
import { Button, Notifications } from 'finablr-ui';
import EnhancedTable4Rate from './EnhancedTable4Rate';
import Search from '../../container/Search';
import Select from '../../container/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import '../../vendor/common.css';
import rows from './EnhancedTableHeader4RateList';
import Loader from '../../component/Loader';
import EmptyListComponent from '../../component/EmptylistComponent';
import Pagination from '../../container/Pagination';
import '../../theme/theme';
import Noresult from '../../component/NoResults';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import * as Exceptionhandler from '../../ExceptionHandling';
import * as APIDrawee4RateService from './APIDrawee4RateService';
import Card from '@material-ui/core/Card';
import ViewActivity4Rate from './ViewActivity4Rate';
import ErrorModal from './../../component/ErrorModalbox';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import * as config from './../../config/config';
import moment from 'moment';

const selectLabels = [{ 'id': 1, 'label': 'Source Country', 'value': 'COUNTRY' }];
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

class DraweeBank4Rate extends Component {
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
      draweeBank4RateList: '',
      draweeBank4RateLen: 0,
      shownogeneralrules: false,
      isViewActivityClicked: false,
      draweeBank4RateArr: [],
      incomeSelectError: false,
      incomeSelectErrorMsg: '',
      draweeBank4RateDisabled: false,
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
    console.log(this.props);
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
              this.fetchDraweeBank4Rate(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchDraweeBank4Rate(this.state.pageNum);
        })
      }
    })
    this.props.handleCompValueChange(false);
    this.getSourceCountry();
  }

  getActivity = (index) => {
    let bankObj = this.state.draweeBank4RateList.data[index]; 
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else {
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        APIDrawee4RateService.getActivity(this.props.props.props.match.params.pId, bankObj.id)
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

  getSourceCountry = () => {
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
        APIDrawee4RateService.fetchCountrys(headers)
          .then((response) => {
            //   console.log(countryObject)
            console.log(response);
            if (response.status == 200) {
              let suggestedFields = [];
              if (response.data.length > 0) {
                response.data.map((obj) => {
                  let countryObject = {};
                  countryObject.id = obj.id;
                  countryObject.field = obj.name;
                  countryObject.label = obj.name+ ' - '+ obj.countryCode;
                  suggestedFields.push(countryObject);
                  // console.log(countryObject);
                })

                this.setState({ suggestedFields, loading: false, loaderMessage: '' }, () => {
                  console.log(this.state.suggestedFields);
                });
              }
              else {
                this.setState({ loading: false, loaderMessage: '', snackbar: true, notificationType: 'warning', snackbarMessage: 'No Drawee 4 Rate records found', draweeBank4RateDisabled: true });
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

  fetchDraweeBank4Rate = (pgno) => {
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
        APIDrawee4RateService.getDraweeBank4RateList(params, this.props.props.draweeProductId,headers)
          .then((response) => {
            console.log(response.data)
            if (response.status == 200) {
              this.setState({ serverError: false, draweeBank4RateList: response.data, draweeBank4RateLen: response.data['data'].length, totalRecords: response.data.total, loading: false, loaderMessage: '' });
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
          search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchDraweeBank4Rate(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchDraweeBank4Rate(this.state.pageNum);
      }
    })
    // this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => this.fetchDraweeBank4Rate(this.state.pageNum))
  }

  handleChangeDraweeBank4Rate = (data) => {
    console.log(data);
    this.props.handleCompValueChange(true);
    this.setState({ draweeBank4RateArr: data, incomeSelectError: false })
  }

  handleViewDraweeBank4RateValues = (data) => {
    console.log(data);
    this.props.handleCompValueChange(true);
    this.setState({ draweeBank4RateArr: data, incomeSelectError: false })
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
          search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchDraweeBank4Rate(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchDraweeBank4Rate(this.state.pageNum);
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
      case ('DraweeBank4RateRow', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.props.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
            search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchDraweeBank4Rate(0);
        });
        break;
      case ('DraweeBank4RateSelect', 'columnFilter'):
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchDraweeBank4Rate(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchDraweeBank4Rate(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${8}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchDraweeBank4Rate(this.state.pageNum);
            })
          }
        });
        break;
    }
  }

  createDraweeBank4Rate = () => {
    if (this.state.draweeBank4RateArr.length == 0) {
      this.setState({ incomeSelectError: true, incomeSelectErrorMsg: 'Please Select a Country' })
    }
    else {
      let data = {};
      data.countriesList = [];
      data.draweeBankProductProfileId = parseInt(this.props.props.draweeProductId);
      this.state.draweeBank4RateArr.map((obj) => {
        let object = {};
        object.id = obj.id;
        object.name = obj.field;
        data.countriesList.push(object);
      });
      if (data.countriesList.length > 0) {
        if(sessionStorage.getItem('token') == undefined){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else{
          let headers = {
            Authorization:sessionStorage.getItem('token')
          }
          this.setState({ shownogeneralrules: false, loading: true, loaderMessage: 'Posting Data' }, () => {
            APIDrawee4RateService.createFetchDraweeBank4Rate(data, this.props.props.draweeProductId,headers)
              .then((response) => {
                console.log(response)
                if (response.status == 200) {
                  this.setState({ serverError: false, snackbar: false, snackbarMessage: response.data.message, loading: false, loaderMessage: '', incomeSelectError: false, draweeBank4RateArr: [], shownogeneralrules: true, apiErrMsg: response.data.message + '' }, () => {
                  });
                  this.props.getNewBadge();
                  this.props.handleCompValueChange(false);
                  this.fetchDraweeBank4Rate(0);
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
    console.log(data, index, type);
    switch (type) {
      case 'profilesourcefundcode':
        if (data.length == 0) {
          this.setState({
            snackbar: false
          }, () => {
            this.setState({ snackbar: true, notificationType: 'warning', snackbarMessage: 'Value to be passed cannot be empty' }, () => {
              let draweeBank4RateList = this.state.draweeBank4RateList;
              draweeBank4RateList.data[index].draweeBankProductProfileSourceOfFundsCodeisEmpty = false;
              draweeBank4RateList.data[index].draweeBankProductProfileSourceOfFundsCode = data;
              this.setState({
                draweeBank4RateList
              })
            })
          })

        }
        else {
          this.setState({ snackbar: false, snackbarMessage: '' }, () => {
            let draweeBank4RateList = this.state.draweeBank4RateList;
            draweeBank4RateList.data[index].valueToBePassedisEditClick = false;
            draweeBank4RateList.data[index].draweeBankProductProfileSourceOfFundsCode = data;
            this.setState({
              draweeBank4RateList
            })
          })
        }
        break;
    }
  }

  handleToggleAction = (field, index) => {
    console.log(field, index)
    let data = {};
    if ((field == 'Disable') || (field == 'Enable')) {
      let bankObj = this.state.draweeBank4RateList.data[index];
      console.log(bankObj)
      data.status = (field == 'Disable') ? 'DISABLED' : 'ENABLED';
      console.log(data);
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        this.setState({ snackbar: false, loading: true, loaderMessage: 'Posting Data' }, () => {
          APIDrawee4RateService.EditDraweeBank4RateStatus(data, this.props.props.draweeProductId, bankObj.id,headers)
            .then((response) => {
              console.log(response);
              if (response.status == 200) {
                this.props.handleCompValueChange(false);
                this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Drawee Bank For Rate Updated Successfully', loading: false, loaderMessage: '', incomeSelectError: false, draweeBank4RateArr: [] }, () => {
                  this.fetchDraweeBank4Rate(0);
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
      let draweeBank4RateList = this.state.draweeBank4RateList;
      let bankObj = draweeBank4RateList.data[index];
      if (bankObj.draweeBankProductProfileSourceOfFundsCode.length > 0) {
        let bankObj1 = draweeBank4RateList.data[index];
        bankObj1.valueToBePassededitClicked = true;
        bankObj1.valueToBePassedisEditClick = false;
        draweeBank4RateList.data[index] = bankObj1;
        this.setState({ draweeBank4RateList: draweeBank4RateList });
      }
    }
    else {
      this.getActivity(index);
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

  render() {
    const { classes } = this.props;
    return (
      <TabContainer>
        <div className={classes.root}>
          {
            this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
              <div className="grid">
                <p className="bank-profile global-font">Drawee Bank for Rate</p>

                {
                  this.state.loading ?
                    <Loader action={this.state.loaderMessage} />
                    :
                    <div>
                      <Grid container spacing={24}>
                        <Grid item xs={12} className="grid-error">
                          <div className="beneficiary-bank-multiselect-container">
                            <div className="beneficiary-bank-multiselect beneficiary-bank-multiselect-fullwidth">
                              <MultiSelectTextField value={this.state.draweeBank4RateArr} label='Source Country' type='agentbranches' MultiSelectText='Source Country List' suggestionFields={this.state.suggestedFields} placeholder={'Select Multiple Countries'}
                                getAutoSelectValue={this.handleChangeDraweeBank4Rate} getViewValues={this.handleViewDraweeBank4RateValues} />
                              <div className="beneficiary-bank-multiselect-addbutton">
                                <Button variant="contained" umStyle="primary" style={{ width: 100 }} onClick={this.createDraweeBank4Rate}>
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
                          (((this.state.draweeBank4RateLen == 0) && (this.state.fromSearch == true)) || (this.state.draweeBank4RateLen != 0)) ?
                            // logic
                            <div>
                              <Grid container spacing={24} className="page-element-grid" justify="space-between">
                                <Grid item xs={1}>
                                  <Select fromPage="DraweeBank4RateRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                                </Grid>
                                <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                                <Grid item xs={5}>
                                  <Grid direction="row" container spacing={24} justify="flex-end" >
                                    <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                      <Select fromPage="DraweeBank4RateSelect" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                    </Grid>
                                    <Grid item xs={5} className="grid-error">
                                      <Search fromPage="DraweeBank4RateSearch" value={this.state.query} getSearchText={this.handleSearch} />
                                      <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </div> : null
                        }
                        {
                          ((this.state.fromSearch == true) && (this.state.draweeBank4RateLen == 0)) ? <Noresult text="Drawee Bank for Rate" /> :
                            [
                              ((this.state.fromSearch == false) && (this.state.draweeBank4RateLen == 0)) ?
                                <EmptyListComponent text="Drawee Bank for Rate" fromPage="draweebankforrate" /> : null
                            ]
                        }
                        {
                          (this.state.draweeBank4RateLen != 0) ?
                            <div>
                              <EnhancedTable4Rate draweeBank4RateList={this.state.draweeBank4RateList} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} getChangedRoutingValue={this.getChangedRoutingValue} handleRoutingValueCheck={this.handleRoutingValueCheck} handleToggleAction={this.handleToggleAction} />
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
            this.state.isViewActivityClicked ? <ViewActivity4Rate isOpen={this.state.isViewActivityClicked} viewActivity={this.handleViewActivity} activityDetails={this.state.activityDetails}/> : null
          }


        </div>
      </TabContainer>
    )
  }
}
export default withStyles(styles)(DraweeBank4Rate);