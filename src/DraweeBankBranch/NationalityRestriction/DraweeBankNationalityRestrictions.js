import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import EnhanchedNatonalityTable from './EnhanchedNatonalityTable';
import Typography from '@material-ui/core/Typography';
import Loader from '../../component/Loader';
import Pagination from '../../container/Pagination';
import Search from '../../container/Search';
import Select from '../../container/Select';
import '../../vendor/common.css';
import '../../theme/theme';
import Grid from '@material-ui/core/Grid';
import EmptyListComponent from '../../component/EmptylistComponent';
import Noresult from '../../component/NoResults';
import rows from '../../component/DraweeBankListTableHeader';
import ModalBox from '../../component/Modalbox';
import DraweeBankEditNationalityRestrictionModal from './DraweeBankEditNationalityRestrictionModal';
import DraweeBankCreateNationalityModel from './DraweeBankCreateNationalityModel';
import * as ApiService from './ApiService';
import * as Exceptionhandler from '../../ExceptionHandling';
import ErrorModalBox from '../../component/ErrorModalbox';
import Card from '@material-ui/core/Card';
import { FloatButton, Notifications, Button, IconButton } from 'finablr-ui';
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

const selectLabels = [{ 'id': 1, 'label': 'Customer Type', 'value': 'customerType' }, { 'id': 2, 'label': 'Beneficiary Type ', 'value': 'beneficiaryType' }, { 'id': 3, 'label': 'Country', 'value': 'country' }];
const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

class DraweeBankNationalityRestrictions extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      createNationalityRestrictions: false,
      createProfile: false,
      modalMessage: '',
      createNationalityRestrictionModal: false,
      snackbar: false,
      snackbarMessage: '',
      notificationType:'success',
      loaderMessage: 'Retrieving Data',
      actionType: '',
      customerType: '',
      beneficiaryType: '',
      pageNum: 0,
      pageelements: 5,
      open: false,
      tableHeader: rows,
      ruledefaultvalue: {},
      editingAgentId: null,
      nationalityRestrictionList: '',
      nationalitylistLen: '',
      totalRecords: '',
      loading: true,
      errMessage: 'Enter atleast 1 character',
      errCheck: false,
      query: '',
      fromSearch: false,
      columnFilter: '',
      shownogeneralrules: false,
      editNationalityRestriction: false,
      editNationalityRestrictioncode: '',
      nationalityValueObject: {},
      modalMessage: '',
      confirmStatus: false,
      apiErrMsg: ''
    }
  }

  componentWillMount() {
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
              this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum)
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum)
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
      ApiService.getGeneralBankrules(this.props.draweeBankBranchProfileView.branchId,headers).then((response) => {
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

  handlenationalityrestrictions = () => {
    if (this.state.customerType === "" && this.state.beneficiaryType === "") {
      this.setState({
        shownogeneralrules: true,
        apiErrMsg: 'No Rules found for Allowed Customer type and Beneficiary type, Navigate to General Rules Tab and create rules before creating Nationality Restriction'
      })
    } else {
      this.setState({ shownogeneralrules: false })
      this.setState({ createNationalityRestrictions: true, actionType: 'Yes', snackbar: false, snackbarMessage: '' })

    }
  }

  fetchDrawrrBankNationalityrestrictions = (pgno) => {
    this.props.handleCompValueChange(false);
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
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      // let params = {
      //   pagenumber: pgno,
      //   pageelements: this.state.pageelements,
      //   query: (this.state.query == '') ? null : this.state.query,
      //   type: (this.state.columnFilter == '') ? null : this.state.columnFilter
      // }
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiService.getNationalityRestrictionsList(params, this.props.draweeBankBranchProfileView.id,headers)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.setState({ serverError: false, nationalityRestrictionList: response.data, nationalitylistLen: response.data['data'].length, totalRecords: response.data.total, loading: false, loaderMessage: '' });
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
      case ('nationalityrestriction', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.props.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
            search: `?tabId=${2}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum);
        });
        break;
      case ('nationalityrestriction', 'columnFilter'):
        //sessionStorage.setItem('draweebanksFilter',JSON.stringify(data));
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${3}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${3}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${3}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum);
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
    this.setState({ query: data, loaderMessage: 'Retrieving Data',pageNum:0 }, () => {
      this.props.props.props.history.push({
        pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
        search: `?tabId=${3}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
      })
      this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum);
    })
  }

  handlePagingListing(pgno) {
    this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => {
      if ((this.state.columnFilter.length > 0) && (this.state.query.length > 0)) {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${3}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${3}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum);
      }
    })
    // this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => this.fetchDrawrrBankNationalityrestrictions(this.state.pageNum))
  }

  sbar(val) {
    this.setState({ open: val })
  }

  handleEditNationalityRestriction = (bankcode) => {
    this.setState({ editNationalityRestrictioncode: bankcode, editNationalityRestriction: true }, () => {
    })
  }

  handleModalEditResponse = (data, action) => {
    if (data == null && action == 'close') {
      this.setState({ editNationalityRestriction: false });
    }
    else {
      this.setState({ editNationalityRestriction: false }, () => {
        // api call
        this.editDraweeDetails(data);
      });
    }
  }

  editDraweeDetails = (data) => {
    console.log(data);
    this.setState({ editNationalityRestriction: false, snackbar: false, snackbarMessage: '' });
    let nationalityValueObject = {};
    nationalityValueObject.customerType = data.customerType;
    nationalityValueObject.beneficiaryType = data.beneficiaryType;
    nationalityValueObject.status = (data.status ? 'ENABLED' : 'DISABLED');
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ nationalityValueObject: nationalityValueObject, loading: true, loaderMessage: 'Posting Data' }, () => {
        let nationalityValueObject = this.state.nationalityValueObject;

        ApiService.editNationalityRestrictionsList(this.props.draweeBankBranchProfileView.branchId, nationalityValueObject, this.state.editNationalityRestrictioncode.id,headers).then((response) => {
          this.setState({ loading: false, snackbar: true,notificationType:'success', snackbarMessage: 'Nationality  Restriction  updated successfully' }, () => {
            if (response.status == 200) {
              this.fetchDrawrrBankNationalityrestrictions(0);
            }
          })
        })
        .catch((error) => {
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 404) {
            this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          }
          else {
            this.setState({ loading: false, snackbar: true,notificationType:'warning', snackbarMessage: error.response.data.error }, () => {
              this.fetchDrawrrBankNationalityrestrictions(0);
            });
          }
        })
      })
    }
  }

  handleModalCreateResponse = (data, action) => {
    console.log(data, action);
    if (data == null && action == 'close') {
      this.setState({ createNationalityRestrictions: false, createProfile: false });
    }
    else if (data == null && action == 'open') {
      this.setState({ createProfile: false, modalMessage: '' });
    }
    else if (data == null && action == 'Try Again') {
      this.setState({ createProfile: true, modalMessage: '' });
    }
    else if (data == null && action == 'Try Again closed') {
      this.setState({ createProfile: false, modalMessage: '', createNationalityRestrictions: false });
    }
    else {
      this.setState({ createNationalityRestrictions: false }, () => {
        this.createDraweeDetails(data);
      });

    }
  }

  createDraweeDetails = (nationalitydata) => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ createProfile: false, modalMessage: '', loading: true, loaderMessage: 'Posting Data', snackbar: false, snackbarMessage: '' });
      ApiService.createNationalityRestrictionsList(nationalitydata, this.props.draweeBankBranchProfileView.branchId,headers).then((response) => {
        if (response.status == 200) {
          this.setState({ loading: false, snackbar: true,notificationType:'success', snackbarMessage: 'Nationality Restriction Created' }, () => {
            this.props.getNewBadge();
            this.fetchDrawrrBankNationalityrestrictions(0);
          });
        }
        else {
          this.setState({ loading: false, snackbar: true,notificationType:'error', snackbarMessage: response.error }, () => {
            this.fetchDrawrrBankNationalityrestrictions(0);
          });
        }
      }).catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        // else if (error.response.status == 409 || error.response.status == 400) {
        //   this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' });
        // }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 404) {
          this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
        }
        else {
          this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        }
      });
    }
  }

  handleStatusResponse = (data) => {
    if (data == true) {
      this.setState({ shownogeneralrules: false }, () => {
      });
    }
  }

  handleModalResponse = (data) => {
    if (data == true && this.state.actionType == 'Try Again') {
      this.setState({ createNationalityRestrictions: true, actionType: '', createProfile: false, modalMessage: '' })
    }
    else if (data == true && this.state.actionType == 'OK') {
      this.fetchDrawrrBankNationalityrestrictions(0);
    }
    else {
      this.setState({ createNationalityRestrictionModal: false });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <TabContainer natinalityrestrictioncount={this.state.totalRecords}>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
            <div className="grid">
              <div className="title-create-button">
              <p className="bank-profile global-font">Nationality Restriction</p>
                {/* {
                  // (this.state.nationalitylistLen == 0) ?
                    <Button className="create-button" onClick={this.handlenationalityrestrictions}>
                      <Icon style={{ padding: "1px 5px 0 0" }} color="">
                        +
                      </Icon>
                      CREATE
                    </Button>
                    // : null
                } */}
              </div>
              <div>
                <Card>
                  {
                    (((this.state.nationalitylistLen == 0) && (this.state.fromSearch == true)) || (this.state.nationalitylistLen != 0)) ?
                      <Grid container spacing={24} className="page-element-grid" justify="space-between">
                        <Grid item xs={1}>
                          <Select fromPage="nationalityrestrictionRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                        </Grid>
                        <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                        <Grid item xs={5}>
                          <Grid direction="row" container spacing={24} justify="flex-end" >
                            <Grid item xs={5} style={{ paddingRight: '0px' }}>
                              <Select fromPage="nationalityrestriction" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                            </Grid>
                            <Grid item xs={5} style={{ paddingRight: '0px' }} className="grid-error">
                              <Search fromPage="nationalityrestriction" value={this.state.query} getSearchText={this.handleSearch} />
                              <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                            </Grid>
                            <Grid item xs={2} >
                              <div className="plus-icon-div">
                                <Icon  className="plus-icon" color="" onClick={this.handlenationalityrestrictions}>
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
                    this.state.loading ?
                      <Loader action={this.state.loaderMessage} />
                      :

                      this.state.nationalitylistLen != 0 ?
                        <div>
                          <div>
                            <EnhanchedNatonalityTable breadcrumpData={this.props.breadcrumpData} bankList={this.state.nationalityRestrictionList} editDraweeBankfn={this.handleEditNationalityRestriction} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} />
                            <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                          </div>
                        </div>
                        : [(
                          this.state.fromSearch ? <Noresult text="Nationality Restriction" /> : 
                            <div style={{position:'relative'}}>
                              <EmptyListComponent text="Nationality Restrictions" fromPage="DraweeBanks" />
                              {
                                <div className="plus-icon-div plus-icon-position">
                                  <Icon  className="plus-icon" color="" onClick={this.handlenationalityrestrictions}>
                                    +
                                  </Icon>
                                </div>
                              }
                            </div>
                        )]
                  }
                </Card>
              </div>

              {
                ((this.state.createNationalityRestrictions == true) && (this.state.shownogeneralrules == false)) ?
                  <DraweeBankCreateNationalityModel ruledefaultvalue={this.state.ruledefaultvalue} isOpen={this.state.createNationalityRestrictions} modalAction={this.handleModalCreateResponse} /> : null
              }

              {
                this.state.editNationalityRestriction ?
                  <DraweeBankEditNationalityRestrictionModal drweebankidd={this.props.draweeBankBranchProfileView.branchId} editingAgentId={this.state.editNationalityRestrictioncode.id} ruledefaultvalue={this.state.ruledefaultvalue} isOpen={this.state.editNationalityRestriction} editDraweeBankcode={this.state.editNationalityRestrictioncode} modalEditAction={this.handleModalEditResponse} /> : null
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
              {
                this.state.shownogeneralrules ? <ErrorModalBox isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleStatusResponse} /> : null
              }
            </div>
        }
      </TabContainer>
    )
  }

}

export default withStyles(styles)(DraweeBankNationalityRestrictions);


