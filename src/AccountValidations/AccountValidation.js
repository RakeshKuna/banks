import React, { Component } from 'react';
import Search from '../container/Search';
import Select from '../container/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import EnhancedAccountTableList from './EnhancedAccountTableList';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import '../vendor/common.css';
import Loader from '../component/Loader';
import Snackbarcomp from '../component/snackbar';
import EmptyListComponent from '../component/EmptylistComponent';
import Pagination from '../container/Pagination';
import Noresult from '../component/NoResults';
import ErrorModalBox from '../component/ErrorModalbox';
import rows from './EnhancedAccountTableHeaderList';
import * as ApiAccountService from './ApiAccountService';
import * as Exceptionhandler from '../ExceptionHandling';
import { Card } from '@material-ui/core';
import { FloatButton, Notifications, Button, IconButton } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from '../config/config';
import Icon from '@material-ui/core/Icon';
import getMuiTheme from "../theme/theme.js";

const queryString = require('query-string');
var parsed = null;
function TabContainer(props) {
  return (
    <Typography component="div">
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

const selectLabels = [
  { 'id': 1, 'label': 'Country', 'value': 'COUNTRY' },
  { 'id': 2, 'label': 'Drawee Bank', 'value': 'DRAWEE_BANK' },
  { 'id': 3, 'label': 'Drawee Bank Profile', 'value': 'DRAWEE_BANK_PRODUCT_PROFILE_NAME' },
  { 'id': 4, 'label': 'Beneficiary Bank', 'value': 'BENEFICIARY_BANK_NAME' },
  // {'id':4,'label':'Min Length','value':'minLength'},
  // {'id':5,'label':'Max Length','value':'maxLength'},
  // {'id':6,'label':'AlphaNumeric','value':'allowAlphaNumeric'}
];

const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

class AccountValidation extends React.Component {
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
      invalidQuery: false,
      editingAgentId: null,
      shownogeneralrules: false,
      apiErrMsg:'',
      actionType:''
    }
  }

  componentDidMount() {
    console.log(this.props)
    parsed = queryString.parse(this.props.location.search);
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
              this.fetchAccountValidations(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchAccountValidations(this.state.pageNum);
        })
      }
      // this.props.handleCompValueChange(false);
    })
  }

  fetchAccountValidations = (pgno) => {
    console.log(pgno);
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
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiAccountService.getAllAccountValidationsList(params,headers)
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data)
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
      case ('AccountValidation', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.history.push({
            pathname: `/accountvalidation`,
            search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchAccountValidations(0);
        });
        break;
      case ('AccountValidation', 'columnFilter'):
        //sessionStorage.setItem('draweebanksFilter',JSON.stringify(data));
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            // sessionStorage.setItem('draweebankquery',JSON.stringify(this.state.query));
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(this.state.columnFilter));
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.history.push({
                pathname: `/accountvalidation`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchAccountValidations(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(''));
            // sessionStorage.setItem('draweebankquery',JSON.stringify(''));
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.history.push({
                pathname: `/accountvalidation`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchAccountValidations(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              //sessionStorage.setItem('draweebankquery',JSON.stringify(''));
              this.props.history.push({
                pathname: `/accountvalidation`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchAccountValidations(this.state.pageNum);
            })
          }
        });
        break;
    }
  }

  handelCreateAccountValidation = () => {
    this.props.history.push('/accountvalidation/createaccountvalidation')
  }

  handleStatusResponse = (data) => {
    if (data = true) {
      this.setState({ shownogeneralrules: false }, () => {
      });
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
      this.props.history.push({
        pathname: `/accountvalidation`,
        search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
      })
      this.fetchAccountValidations(this.state.pageNum);
    })
  }

  handlePagingListing(pgno) {
    // this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => this.fetchAccountValidations(this.state.pageNum))
    console.log(pgno);
    this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => {
      if ((this.state.columnFilter.length > 0) && (this.state.query.length > 0)) {
        this.props.history.push({
          pathname: `/accountvalidation`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchAccountValidations(this.state.pageNum);
      }
      else {
        this.props.history.push({
          pathname: `/accountvalidation`,
          search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchAccountValidations(this.state.pageNum);
      }
    })
  }

  sbar(val) {
    this.setState({ open: val })
  }
  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
      <TabContainer>
        <div className={classes.root}>
          {
            this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
              <div className="grid">
                <div className="title-create-button">
                  <p className="bank-profile global-font">Account Validation</p>
                    {/* {
                      // (this.state.bankListLen == 0) ?
                        <Button className="create-button" onClick={this.handelCreateAccountValidation}>
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
                                <Select fromPage="AccountValidationRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                              </Grid>
                              <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                              <Grid item xs={5}>
                                <Grid direction="row" container spacing={24} justify="flex-end" >
                                  <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                    <Select fromPage="AccountValidation" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                  </Grid>
                                  <Grid item xs={5} style={{ paddingRight: '0px' }} className="grid-error">
                                    <Search fromPage="AccountValidation" value={this.state.query} getSearchText={this.handleSearch} />
                                    <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                  </Grid>
                                  <Grid item xs={2} >
                                    <div className="plus-icon-div">
                                      <Icon  className="plus-icon" color="" onClick={this.handelCreateAccountValidation}>
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
                                  <EmptyListComponent text="Account Validations" fromPage="DraweeBanks" />
                                  {
                                    <div className="plus-icon-div plus-icon-position">
                                      <Icon  className="plus-icon" color="" onClick={this.handelCreateAccountValidation}>
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
                              <EnhancedAccountTableList bankList={this.state.bankList} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} />
                              <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                            </div> : null
                        }
                      </Card>
                    </div>
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
      </MuiThemeProvider>
    )
  }

}

export default withStyles(styles)(AccountValidation);
