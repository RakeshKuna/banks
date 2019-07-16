import React, { Component } from 'react';
import EnhancedTable from './EnhancedTable';
import Pagination from '../container/Pagination';
import rows from './BranchListTableHeader';
import axios from 'axios';
import Search from '../container/Search';
import '../vendor/common.css';
import '../theme/theme';
import Grid from '@material-ui/core/Grid';
import Import from '../container/Import';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import EmptyListComponent from '../component/EmptylistComponent';
import { withRouter } from 'react-router';
import Loader from '../component/Loader';
import Noresult from '../component/NoResults';
import Modal from './../component/Modalbox';
import Progressbar from './../component/progressbar';
import * as BranchesApiService from './BranchesApiService';
import * as Exceptionhandler from './../ExceptionHandling';
import Select from '../container/Select';
import Card from '@material-ui/core/Card';
import ErrorModal from './../component/ErrorModalbox';
import * as config from './../config/config';
import {MuiThemeProvider} from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme.js";

const queryString = require('query-string');
var parsed = null;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

const selectLabels = [{ 'id': 1, 'label': 'Branch Code', 'value': 'CODE' }, { 'id': 2, 'label': 'Branch Name', 'value': 'NAME' }, { 'id': 3, 'label': 'City', 'value': 'CITY' }];
const rowsPerpage = [{ 'id': 5, 'label': '5', 'value': '5' }, { 'id': 10, 'label': '10', 'value': '10' }, { 'id': 15, 'label': '15', 'value': '15' }, { 'id': 20, 'label': '20', 'value': '20' }]

class AllBranchListc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      tableHeader: rows,
      bankList: '',
      pageNum: 0,
      pageelements: 5,
      columnFilter: '',
      bankListLen: '',
      totalRecords: '',
      loading: true,
      buttonText: '',
      errMessage: 'Text should contain atleast 1',
      errCheck: false,
      query: '',
      fromSearch: false,
      importingFile: false,
      importedData: false,
      modalMessage: '',
      importErrors: [],
      downloadFile: false,
      progressText: 'please wait...',
      loaderMessage: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      shownogeneralrules: false,
      apiErrMsg: '',
    }
  }

  componentDidMount() {
    console.log('calling bank list');
    console.log(this.props);
    parsed = queryString.parse(this.props.location.search);
    // console.log(this.props.location.search);
    console.log(parsed);
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
      if("pagenum" in parsed){
        this.setState({pageNum:parsed.pagenum});
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
              this.fetchBranchList(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchBranchList(this.state.pageNum);
        })
      }
      // this.props.handleCompValueChange(false); 
      // this.getGeneralrules();
    })

  }

  fetchBranchList = (pgno) => {
    this.setState({ loading: true });
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
    // };
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      BranchesApiService.getAllBanks(params,headers).then((response) => {
        if (response.status == 200) {
          this.setState({ serverError: false, bankList: response.data, bankListLen: response.data['data'].length, totalRecords: response.data.total, loading: false, loaderMessage: '' }, () => {
            if (this.state.bankListLen > 0) {
              this.setState({ buttonText: ' Import / Update' })
            }
            else if ((this.state.bankListLen == 0) && (this.state.fromSearch == true)) {
              this.setState({ buttonText: ' Import / Update' })
            }
            else {
              this.setState({ buttonText: ' Import' })
            }
          });
        }
      })
      .catch(error => {
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
          console.log(Exceptionhandler.throwErrorType(error));
          this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
        }
        else {
          this.setState({ loading: false, serverError: false })
        }
      });
    }
  }

  handleSelect = (data, fromPage, type) => {
    switch (fromPage, type) {
      case ('BranchListSelect', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.history.push({
            pathname: `/branches`,
            search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchBranchList(0);
        });
        break;
      case ('BranchListSelect', 'columnFilter'):
        //sessionStorage.setItem('draweebanksFilter',JSON.stringify(data));
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            // sessionStorage.setItem('draweebankquery',JSON.stringify(this.state.query));
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(this.state.columnFilter));
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.history.push({
                pathname: `/branches`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchBranchList(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            // sessionStorage.setItem('draweebanksFilter',JSON.stringify(''));
            // sessionStorage.setItem('draweebankquery',JSON.stringify(''));
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.history.push({
                pathname: `/branches`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchBranchList(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              //sessionStorage.setItem('draweebankquery',JSON.stringify(''));
              this.props.history.push({
                pathname: `/branches`,
                search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchBranchList(this.state.pageNum);
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

  handleSearchData = (data) => {
    this.setState({ query: data, loaderMessage: 'Retrieving Data',pageNum:0 }, () => {
      this.props.history.push({
        pathname: `/branches`,
        search: `?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
      })
      this.fetchBranchList(this.state.pageNum);
    })
  }

  // handlePagingListing(pgno) {
  //   this.setState({ pageNum: pgno }, () => this.fetchBranchList(this.state.pageNum))
  // }

  handlePagingListing = (pgno) => {
    console.log(pgno);  
    // console.log(this.props);
    this.setState({pageNum:pgno,loaderMessage:'Retrieving Data'},()=>{
      if((this.state.columnFilter.length > 0) && (this.state.query.length > 0)){
        this.props.history.push({
          pathname:`/branches`,
          search:`?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchBranchList(this.state.pageNum);
      }
      else{
        this.props.history.push({
          pathname:`/branches`,
          search:`?pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchBranchList(this.state.pageNum);
      }
    })
  }

  handleImportData = (data) => {
    console.log( data);
    this.setState({ shownogeneralrules:false,importedData:false });
    if (data.status === 200) {
      if (data.data.errorRecords == null) {
        this.setState({shownogeneralrules:true,apiErrMsg:data.data.message,pageNum: 0},()=>{
          this.fetchBranchList(this.state.pageNum);
        })
      }
      else {
        this.setState({ importErrors: data.data.errorRecords,importedData: true, modalMessage: data.data.message, pageNum: 0 },()=>{
          this.fetchBranchList(this.state.pageNum);
        })
      }
    }
    else {
      if(Exceptionhandler.throwErrorType(data).status == 401){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else if (Exceptionhandler.throwErrorType(data).status == 500 || Exceptionhandler.throwErrorType(data).status == 503 || Exceptionhandler.throwErrorType(data).status == 400) {
        this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(data).status, serverErrMessage: Exceptionhandler.throwErrorType(data).message })
      }
      else {
        this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: data.response.data.error, actionType: 'OK' })
      }
    }
  }

  // handleModalResponse = (data) => {
  //   this.setState({ downloadFile: data }, () => {
      
  //     this.handleFiledownload()
  //   });
  // }

  handleFiledownload() {
    this.setState({ downloadFile: false })
  }

  sbar(val) {
    this.setState({ open: val })
  }

  handleModalResponse = (data) => {
    if (data) {
      this.setState({ shownogeneralrules: false, importedData:false, apiErrMsg: '' })
    }
  }

  render() {
    const { bankList, bankListLen, totalRecords, pageNum } = this.state;
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
      <div className={classes.root}>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
            [
              this.state.importingFile ?
                <Progressbar displayText={this.state.progressText} />
                :
                <div>
                  <div className="grid">
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
                        <p className="bank-profile">Bank Branch Profiles</p>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid direction="row" container spacing={24} justify="flex-end" >
                          <Grid item>
                            <Import buttonText={this.state.buttonText} fromPage="branches" getData={this.handleImportData} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Card>
                      {
                        (((this.state.bankListLen == 0) && (this.state.fromSearch == true)) || (this.state.bankListLen != 0)) ?
                          <Grid container spacing={24}  className="page-element-grid" justify="space-between">
                            <Grid item xs={1}>
                              <Select fromPage="BranchListSelectRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                            </Grid>
                            <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                            <Grid item xs={5}>
                              <Grid direction="row" container spacing={24} justify="flex-end" >
                                <Grid item xs={5} style={{paddingRight:'0px'}}>
                                  <Select fromPage="BranchListSelect" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                </Grid>
                                <Grid item xs={5} className="grid-error">
                                  <Search fromPage="BranchListSelect" value={this.state.query} getSearchText={this.handleSearch} />
                                  <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
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
                          bankListLen != 0 ?
                            <div>
                              <EnhancedTable fromPage="allBranches" bankList={bankList} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} />
                              <Pagination totalNumberOfRows={totalRecords} page={pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state} />
                            </div>
                            :
                            [(
                              this.state.fromSearch ? <Noresult text="Branche" /> : <EmptyListComponent text="Bank branch" fromPage="Banks" />
                            )]
                      }
                    </Card>
                    {/* {
                      this.state.downloadFile ?
                        <CSVDownload data={this.state.importErrors} target="_blank" />
                        : null
                    } */}
                    {
                      this.state.importedData ? 
                    <Modal isOpen={(this.state.importedData)} importErrors={this.state.importErrors} fromPage={"Branches"} actionType="Download" message={(this.state.modalMessage)} modalAction={this.handleModalResponse} />
                  :null
                  }
                    {
                    this.state.shownogeneralrules ? <ErrorModal isOpen={this.state.shownogeneralrules} actionType="OK" message={this.state.apiErrMsg} modalAction={this.handleModalResponse} /> : null
                  }
                  </div>
                </div>
            ]
        }
      </div>
      </MuiThemeProvider>
    );
  }
}

AllBranchListc.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AllBranchListc));