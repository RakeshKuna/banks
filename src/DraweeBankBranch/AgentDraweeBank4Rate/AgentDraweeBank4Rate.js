import React, { Component } from 'react';
import EnhancedTableAgent4Rate from './EnhancedTableAgent4Rate';
import Search from '../../container/Search';
import Select from '../../container/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import '../../vendor/common.css';
import rows from './EnhancedHeaderAgent4RateList';
import Loader from '../../component/Loader';
import Snackbarcomp from '../../component/snackbar';
import EmptyListComponent from '../../component/EmptylistComponent';
import Pagination from '../../container/Pagination';
import getMuiTheme from "../../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import Noresult from '../../component/NoResults';
import MultiSelectTextField from '../../container/MultiSelectTextField';
import * as Exceptionhandler from '../../ExceptionHandling';
import * as APIAgentDrawee4RateService from './APIAgentDrawee4RateService';
import Card from '@material-ui/core/Card';
import ViewActivityAgent4Rate from './ViewActivityAgent4Rate';
import ErrorModal from './../../component/ErrorModalbox';
import { Selectable, Button, Notifications } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../../constants/action-types';
import { HIDE_NOTIFICATION } from '../../constants/action-types';
import * as config from './../../config/config';
import moment from 'moment';

const selectLabels = [{ 'id': 1, 'label': 'Agents', 'value': 'AGENT_NAME' },{ 'id': 2, 'label': 'Agent Branches', 'value': 'AGENT_BRANCH_NAME' }];
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

class AgentDraweeBank4Rate extends Component {
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
      draweeBank4RateList: '',
      draweeBank4RateLen: 0,
      shownogeneralrules: false,
      isViewActivityClicked: false,
      draweeBank4RateArr: [],
      incomeSelectError: false,
      incomeSelectErrorMsg: '',
      draweeBank4RateDisabled: false,
      agentsList: [],
      agentName: '',
      agentData: {},
      agentNameCheck: false,
      agentNameerrMsg: '',
      agentBranchesList: [],
      agentBranchesArr: [],
      agentBranchesCheck: false,
      agentBrancheserrMsg: '',
      agentBranchesDisabled: true,
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
              this.fetchAgentDraweeBank4RateList(this.state.pageNum);
            })
          }
          else {
            this.setState({ query: '' })
          }
        }
      }
      if (totalMatch == 0) {
        this.setState({ loading: true }, () => {
          this.fetchAgentDraweeBank4RateList(this.state.pageNum);
        })
      }
    })
    this.props.handleCompValueChange(false);

    // this.fetchAgents();
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
        APIAgentDrawee4RateService.getActivity(this.props.props.props.match.params.pId, bankObj.id)
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

  fetchAgents = () => {
    let params = {
      pagenumber: 0
    };
    let agentsList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, loaderMessage: 'Retrieving Agents', snackbar: false }, () => {
        APIAgentDrawee4RateService.getAllAgents(params,headers)
          .then((response) => {
            // console.log(response);
            // console.log("Agents List");
            if (response.status == 200) {
              if (response.data.data.length > 0) {
                response.data.data.map((obj) => {
                  let agentobject = {};
                  agentobject.id = obj.id;
                  agentobject.label = obj.name;
                  agentobject.value = obj.code;
                  agentsList.push(agentobject);
                  console.log(agentobject);
                })
                this.setState({ agentsList, agentsDisabled: false, snackbar: false, loading: false }, () => {
                  console.log(this.state.agentsList);
                });
              }
              else {
                this.setState({ serviceProviderDisabled: true, loading: false, snackbar: true, notificationType: 'warning', snackbarMessage: 'No agent branches records found' })
                alert('no agent branches records found');
              }
            }
          }).catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      })
    }
  }

  fetchAgentDraweeBank4RateList = (pgno) => {
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
        APIAgentDrawee4RateService.getAgentDraweeBank4RateList(params, this.props.props.draweeProductId,headers)
          .then((response) => {
            console.log("Agent Table List")
            console.log(response.data)
            if (response.status == 200) {
              this.fetchAgents();
              this.setState({ serverError: false, draweeBank4RateList: response.data, draweeBank4RateLen: response.data['data'].length, totalRecords: response.data.total, loaderMessage: '' });
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
          search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchAgentDraweeBank4RateList(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchAgentDraweeBank4RateList(this.state.pageNum);
      }
    })
    // this.setState({ pageNum: pgno, loaderMessage: 'Retrieving Data' }, () => this.fetchAgentDraweeBank4RateList(this.state.pageNum))
  }

  handleReplicaAgentChange = (e, id) => {
    this.setState({ agentName: e, agentNameCheck: false }, () => {
      if (this.state.agentName == undefined) {
        this.setState({ agentNameCheck: true, agentNameerrMsg: "Select an Agent", agentData: {},agentBranchesList: [], agentBranchesArr: [] })
      } else if (this.state.agentName.length == 0) {
        this.setState({ agentNameCheck: true, agentNameerrMsg: "Select an Agent", agentData: {},agentBranchesList: [], agentBranchesArr: [] })
      }
      else if(this.state.agentName.length > 0){
        this.state.agentsList.map((obj)=>{
          if(obj.value == this.state.agentName){
            this.setState({ agentName:obj.value, agentData: obj, agentBranchesList: [], agentBranchesArr: [] }, () => {
              this.fetchAgentBranches(this.state.agentData.id)
            })
          }
        })
      }
      else {
        this.setState({ agentNameCheck: false, agentNameerrMsg: "" })
      }
    })
  }

  handleReplicaAgentValueClick = (e, id) => {
    console.log(e, id);
    let value = e.value;
    this.setState({ agentData: e,agentName:value, agentBranchesList: [], agentBranchesArr: [] }, () => {
      this.fetchAgentBranches(this.state.agentData.id)
    })
  }

  fetchAgentBranches = (agentId) => {
    let params = {};
    let agentBranchesList = [];
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true, loaderMessage: 'Retrieving Agent Branches', snackbar: false }, () => {
        APIAgentDrawee4RateService.getAllAgentBranchProfiles(params, agentId,headers)
          .then((response) => {
            let agentBranchCount = response.data.data.length;
            if (response.status == 200) {
              if (response.data.data.length > 0) {
                response.data.data.map((obj) => {
                  let agentBranch = {};
                  agentBranch.id = obj.id;
                  agentBranch.label = obj.branchName;
                  agentBranch.value = obj.branchDisplayName;
                  agentBranchesList.push(agentBranch);
                })
                this.setState({ agentBranchesList, agentBranchesDisabled: (agentBranchCount > 0) ? false : true, snackbar: (agentBranchCount > 0) ? false : true, notificationType: 'warning', snackbarMessage: 'No agent branches records found', loading: false }, () => {
                  //console.log(this.state.agentBranchesList);
                });
              }
              else {
                this.setState({ agentBranchesDisabled: true, loading: false, snackbar: true, notificationType: 'warning', snackbarMessage: 'No agent branches records found' })
              }
            }
          }).catch(error => {
            if(Exceptionhandler.throwErrorType(error).status == 401){
              window.location.replace(config.PAAS_LOGIN_URL);
              return (<h1>401 - Unauthorized Request</h1>)
            }
            else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      })
    }
  }

  handleReplicaAgentBlur = (e, id) => {
    console.log('2')
    if (this.state.agentName == undefined || Object.keys(this.state.agentData).length == 0) {
      this.setState({ agentNameCheck: true, agentNameerrMsg: "Select an Agent" })
    } else if (this.state.agentName.length == 0) {
      this.setState({ agentNameCheck: true, agentNameerrMsg: "Select an Agent" })
    }
    else {
      this.setState({ agentNameCheck: false, agentNameerrMsg: "" })
    }
  }

  handleChangeAgentBranches = (data, id) => {
    this.setState({ agentBranchesArr: data,agentBranchesCheck:false }, () => {
      // this.handleSaveEnable();
    });
  }

  handleViewAgentBranches = (data, id) => {
    this.setState({ agentBranchesArr: data }, () => {
      // this.handleSaveEnable();
    });
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
          search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
        })
        this.fetchAgentDraweeBank4RateList(this.state.pageNum);
      }
      else {
        this.props.props.props.history.push({
          pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
          search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
        })
        this.fetchAgentDraweeBank4RateList(this.state.pageNum);
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
      case ('AgentDraweeBank4RateRow', 'rowsPerpage'):
        this.setState({ pageelements: data, pageNum: 0, loaderMessage: 'Retrieving Data', loading: true }, () => {
          this.props.props.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
            search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
          })
          this.fetchAgentDraweeBank4RateList(0);
        });
        break;
      case ('AgentDraweeBank4RateSelect', 'columnFilter'):
        this.setState({ columnFilter: data }, () => {
          if ((this.state.query.length > 0) && (this.state.columnFilter.length > 0)) {
            this.setState({ fromSearch: true, loaderMessage: 'Retrieving Data', errCheck: false,pageNum:0 }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}&columnType=${this.state.columnFilter}&search=${this.state.query}`
              })
              this.fetchAgentDraweeBank4RateList(this.state.pageNum);
            })
          }
          else if ((this.state.query.length == 0) && (this.state.columnFilter.length == 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data', columnFilter: '', errCheck: false }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchAgentDraweeBank4RateList(this.state.pageNum);
            })
          }
          else if ((this.state.columnFilter.length == 0) && (this.state.query.length > 0)) {
            this.setState({ fromSearch: false, pageNum: 0, query: '', loaderMessage: 'Retrieving Data' }, () => {
              this.props.props.props.history.push({
                pathname: `/draweebranchprofilerules/${this.props.props.draweeId}/products/profile/${this.props.props.draweeProductId}`,
                search: `?tabId=${9}&pageelements=${this.state.pageelements}&pagenum=${this.state.pageNum}`
              })
              this.fetchAgentDraweeBank4RateList(this.state.pageNum);
            })
          }
        });
        break;
    }
  }

  createAgentDraweeBank4Rate = () => {
    if (Object.keys(this.state.agentData).length == 0) {
      this.setState({agentNameCheck: true, agentNameerrMsg: "Select an Agent" })
    }
    else if (this.state.agentBranchesArr.length == 0){
      this.setState({agentBranchesCheck: true, agentBrancheserrMsg: "Select an Agent branch" })
    }
    else {
      console.log(this.state.agentBranchesArr);
      let data = {};
      data.agent = {};
      data.agent.agentBranches = [];
      // data.draweeBankProductProfileId = parseInt(this.props.props.draweeProductId);
      data.agent.id = this.state.agentData.id;
      data.agent.name = this.state.agentData.label;
      // console.log(this.state.draweeBank4RateArr);
      if (this.state.agentBranchesArr.length > 0) {
        this.state.agentBranchesArr.map((obj) => {
          let object = {};
          object.id = obj.id;
          object.branchName = obj.label;
          // object.value = obj.displayName;
          data.agent.agentBranches.push(object);
        });
      }
      console.log(data);
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        this.setState({ shownogeneralrules: false, loading: true, loaderMessage: 'Posting Data' }, () => {
          APIAgentDrawee4RateService.createAgentDraweeBank4Rate(data, this.props.props.draweeProductId,headers)
            .then((response) => {
              console.log(response)
              if (response.status == 200) {
                this.setState({ serverError: false, agentName: undefined, agentBranchesArr: [], agentBranchesDisabled:true, agentBranchesList:[], snackbar: false, notificationType: 'warning', snackbarMessage: response.data.message, loading: false, loaderMessage: '', incomeSelectError: false, draweeBank4RateArr: [], shownogeneralrules: true, apiErrMsg: response.data.message + '.' }, () => {
                });
                this.props.getNewBadge();
                this.props.handleCompValueChange(false);
                this.fetchAgentDraweeBank4RateList(0);
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
      this.setState({ snackbar: false, loading: true, loaderMessage: 'Posting Data' }, () => {
        APIAgentDrawee4RateService.editAgentDraweeBank4Rate(data, this.props.props.draweeProductId, bankObj.id)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              this.props.handleCompValueChange(false);
              this.setState({ serverError: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Agent Drawee Bank For Rate Updated Successfully', loading: false, loaderMessage: '', incomeSelectError: false, draweeBank4RateArr: [] }, () => {
                this.fetchAgentDraweeBank4RateList(0);
              });
            }
          })
          .catch(error => {
            console.log(error.response);
            if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
              this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message, incomeSelectError: false })
            }
            else {
              this.setState({ loading: false, serverError: false, shownogeneralrules: true, apiErrMsg: error.response.data.error, actionType: 'OK', incomeSelectError: false })
            }
          });
      })
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
      <MuiThemeProvider theme={getMuiTheme}>
      <TabContainer>
        <div className={classes.root}>
          {

            this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
              <div className="grid">
                <p className="bank-profile global-font">Agent Drawee Bank For Rate</p>

                {
                  this.state.loading ?
                    <Loader action={this.state.loaderMessage} />
                    :
                    <div>
                      <div className="beneficiary-bank-multiselect-container">
                        <Grid container spacing={24}>
                          <Grid item xs={6} className="grid-error">
                            <Selectable
                              id={'agentname'}
                              isRequired
                              ref="Selectable"
                              label="Agent"
                              style={{padding:0}}
                              searchable={true}
                              isCreatable={false}
                              isClearable={true}
                              value={this.state.agentName}
                              options={this.state.agentsList}
                              noResultsText="No Agents List Found"
                              searchBy={'any'}
                              placeholder={'Agent'}
                              onChange={(e) => this.handleReplicaAgentChange(e, 'agentname')}
                              onValueClick={(e) => this.handleReplicaAgentValueClick(e, 'agentname')}
                              onBlur={(e) => this.handleReplicaAgentBlur(e, 'agentname')}
                            />
                            {this.state.agentNameCheck ? <span className="errorMessage-add">{this.state.agentNameerrMsg} </span> : ''}
                          </Grid>
                          <Grid item xs={6} className="beneficiary-bank-multiselect grid-error">
                            <MultiSelectTextField disabled={this.state.agentBranchesDisabled} value={this.state.agentBranchesArr} label='Agent Branches' type={'agentbranches'} suggestionFields={this.state.agentBranchesList} placeholder={'Agent Branches'} MultiSelectText='Agent Branches' getAutoSelectValue={this.handleChangeAgentBranches} getViewValues={this.handleViewAgentBranches} />
                            {this.state.agentBranchesCheck ? <span className="errorMessage">{this.state.agentBrancheserrMsg} </span> : ''}
                            <div className="purpose-bank-multiselect-addbutton">
                              <Button variant="contained" umStyle="primary" style={{ width: 100 }} onClick={this.createAgentDraweeBank4Rate}>
                                Add
                                </Button>
                            </div>
                          </Grid>
                          {this.state.incomeSelectError ? <span className="errorMessage-bank">{this.state.incomeSelectErrorMsg} </span> : ''}
                        </Grid>
                      </div>


                      <Card>
                        {
                          (((this.state.draweeBank4RateLen == 0) && (this.state.fromSearch == true)) || (this.state.draweeBank4RateLen != 0)) ?
                            // logic
                            <div>
                              <Grid container spacing={24} className="page-element-grid" justify="space-between">
                                <Grid item xs={1}>
                                  <Select fromPage="AgentDraweeBank4RateRow" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect} />
                                </Grid>
                                <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                                <Grid item xs={5}>
                                  <Grid direction="row" container spacing={24} justify="flex-end" >
                                    <Grid item xs={5} style={{ paddingRight: '0px' }}>
                                      <Select fromPage="AgentDraweeBank4RateSelect" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect} />
                                    </Grid>
                                    <Grid item xs={5} className="grid-error">
                                      <Search fromPage="AgentDraweeBank4RateSearch" value={this.state.query} getSearchText={this.handleSearch} />
                                      <span className="errorMessage-list">{this.state.errCheck ? this.state.errMessage : ''}</span>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </div> : null
                        }
                        {
                          ((this.state.fromSearch == true) && (this.state.draweeBank4RateLen == 0)) ? <Noresult text="Agent Drawee Bank for Rate" /> :
                            [
                              ((this.state.fromSearch == false) && (this.state.draweeBank4RateLen == 0)) ?
                                <EmptyListComponent text="Agent Drawee Bank for Rate" fromPage="agentdraweebank4rate" /> : null
                            ]
                        }
                        {
                          (this.state.draweeBank4RateLen != 0) ?
                            <div>
                              <EnhancedTableAgent4Rate draweeBank4RateList={this.state.draweeBank4RateList} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props} getChangedRoutingValue={this.getChangedRoutingValue} handleRoutingValueCheck={this.handleRoutingValueCheck} handleToggleAction={this.handleToggleAction} />
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
            this.state.isViewActivityClicked ? <ViewActivityAgent4Rate isOpen={this.state.isViewActivityClicked} viewActivity={this.handleViewActivity} activityDetails={this.state.activityDetails}/> : null
          }


        </div>
      </TabContainer>
      </MuiThemeProvider>

    )
  }
}
export default withStyles(styles)(AgentDraweeBank4Rate);