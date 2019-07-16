import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DraweeBankBranchProfileView from '../DraweeBankBranch/DraweeBankBranchProfileView';
import Breadcrumps from '../component/Breadcrumps';
import DraweeBankRulesView from './EnhancedTabs';
import axios from 'axios';
import * as Exceptionhandler from './../ExceptionHandling';
import EmptyListComponent from './../component/EmptylistComponent';
import Loader from '../component/Loader';
import * as BranchApiService from './../DraweeBank/ApiService';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import * as config from './../config/config';

const queryString = require('query-string');
var parsed = null;
const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    divider:{
      margin:'3% 0',
      height:3
    }, 
    fab: {
      margin: theme.spacing.unit,
      backgroundColor: "#2f2e2e",
      color:'white'
    },
  });

class DraweeBankBranchRules extends React.Component {
  constructor(props){
    super(props);
    parsed = queryString.parse(props.location.search);
    this.state = {
      breadcrumps:[],
      draweeBankView:'',
      draweeBankBranchProfileView:{},
      serverStatus:null,
      serverError:false,
      serverErrMessage:'',
      loading:true,
      loaderMessage:'Retrieving Data',
      activityTab:true
    };
  }
    
  componentDidMount(){
    console.log('1st page');
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({loading:true},()=>{
        let draweebankid = this.props.match.params.draweeId;
        let draweebankbranchid = this.props.match.params.pId;
        DraweeeBankBranchApiService.getdraweebranchprofile(draweebankid,draweebankbranchid,headers)
        .then(response=>{
            if(response.status == 200){
              var responseObj = {};
              responseObj = response.data;
              responseObj.bankId = draweebankid;
              responseObj.branchId = draweebankbranchid;
            this.setState({loading:false,serverError:false,draweeBankBranchProfileView:responseObj,draweeBankView:response.data.bankName},()=>{
              BranchApiService.fetchBankDetails(this.props.match.params.draweeId,headers)
                .then((response)=>{
                    if(response.status == 200){
                      this.setState({loading:false},()=>{
                        let breadcrumpData = [{link:'/draweebanklist/',text:'Drawee Banks'},{link:'/draweeBankProfile/'+draweebankid,text:response.data.bankName+' ('+draweebankid+')'},{link:'#',text:draweebankbranchid}];
                        this.setState({breadcrumps:breadcrumpData})
                      })
                    }
                })
                .catch(error=>{
                  if(Exceptionhandler.throwErrorType(error).status == 401){
                    window.location.replace(config.PAAS_LOGIN_URL);
                    return (<h1>401 - Unauthorized Request</h1>)
                  }
                  else if(Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400){
                      this.setState({loading:false,serverError:true,serverStatus:Exceptionhandler.throwErrorType(error).status,serverErrMessage:Exceptionhandler.throwErrorType(error).message})
                  }
                  else{
                      this.setState({loading:false,serverError:false,confirmStatus:true,apiErrMsg:error.response.data.error,actionType:'OK'})
                  }
                });
            }) 
          }
        })
        .catch(error=>{
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
            this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          }
          else {
            this.setState({loading:false,serverError:true,serverStatus:Exceptionhandler.throwErrorType(error).status,serverErrMessage:Exceptionhandler.throwErrorType(error).message})
          }      
        })
      })
    }
  }

  handleTab = (data) => {
    if(data){
      this.setState({activityTab:true})
    }
    else{
      this.setState({activityTab:false})
    }
  }

  render(){
    const value = this.state.draweeBankBranchProfileView;
    if(Object.keys(value).length == 0){
      return (
        <div>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors"/> : null
        }
        </div>
      );
    }
    else{
      return(
        <div>
          {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors"/> :
            [
              this.state.loading ? <Loader action={this.state.loaderMessage}/> :
              <Grid container spacing={24}>              
                  <Grid item xs={12}>              
                      <Breadcrumps links={this.state.breadcrumps}/>                         
                  </Grid>
                  {/* <Grid item xs={12}>              
                      <h2>{this.state.draweeBankView}</h2>            
                  </Grid> */}
                  <Grid item xs={12}>
                  <DraweeBankBranchProfileView draweeBankBranchProfileView={this.state.draweeBankBranchProfileView} {...this.props} handleTab={this.handleTab}/>
                  </Grid>
                  {
                    this.state.activityTab ?
                    <Grid item xs={12}>
                      <DraweeBankRulesView props={this.props} draweeId={this.props.match.params.draweeId} draweeProductId={this.props.match.params.pId} tabIndex={parseInt(parsed.tabId)} draweeBankBranchProfileView={this.state.draweeBankBranchProfileView}/>
                    </Grid>
                    :null
                  }
                  
              </Grid> 
            ] 
          }
        </div>
      );
    }   
  }
}
DraweeBankBranchRules.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles) (DraweeBankBranchRules);