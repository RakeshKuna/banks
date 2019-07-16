import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import '../vendor/common.css';
import {MuiThemeProvider} from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme.js";
import EmptyListComponent from '../component/EmptylistComponent';
import axios from 'axios';
import Loader from '../component/Loader';
import AuditingComponent from '../component/AuditingComponent';
import Breadcrumps from './../component/Breadcrumps';
import BranchEnhancedTableView from './BranchEnhancedTableView';
import EmptylistComponent from '../component/EmptylistComponent';
import * as ApiService from './BranchesApiService';
import * as Exceptionhandler from './../ExceptionHandling';
import * as config from './../config/config';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  media: {
    height: 50,
  },
});

class BankBranchProfileView extends Component {
  constructor(props){
    super(props);
    this.state = { 
      bankBranchDetails:{},
      branchId:'',
      loading:true,
      breadcrumps:[],
      backNavigate:'',
      TableData:'',
      TableDataLen:'',
      loaderMessage:'Retrieving Data',
      serverStatus:null,
      serverError:false,
      serverErrMessage:''
    }
  }

  componentDidMount(){
    if(this.props.state !== undefined){
      if((this.props.state.fromPage) == 'individualBankBranch'){
        var breadcrumpData = [{link:'/branchlist/'+JSON.parse(sessionStorage.getItem('branchId')),text:'Bank Branch Profiles'}];
        this.setState({breadcrumps:breadcrumpData,backNavigate:'/branchlist/'+JSON.parse(sessionStorage.getItem('branchId'))})
      }
      else{
        var breadcrumpData = [{link:'/branches',text:'Bank Branch Profiles'}];
        this.setState({breadcrumps:breadcrumpData,backNavigate:'/branches'})
      }
    }
    else{
      if(JSON.parse(sessionStorage.getItem('fromPage')) == 'individualBankBranch'){
        var breadcrumpData = [{link:'/branchlist/'+JSON.parse(sessionStorage.getItem('branchId')),text:' Bank Branch Profiles'}];
        this.setState({breadcrumps:breadcrumpData,backNavigate:'/branchlist/'+JSON.parse(sessionStorage.getItem('branchId'))})
      }
      else{
        var breadcrumpData = [{link:'/branches',text:'Bank Branch Profiles'}];
        this.setState({breadcrumps:breadcrumpData,backNavigate:'/branches'})
      }
    }
    this.setState({branchId:JSON.parse(sessionStorage.getItem('branchId'))},()=> this.getBankBranchDetails(),this.getBranchIdentificationDetails())  
  }

  getBankBranchDetails =() =>{
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiService.getBankDetails(this.props.match.params.branchId,headers)
      .then((res)=>{
        console.log(res);
        this.setState({bankBranchDetails:res.data,loading:false},()=>{
          var breadcrumpData = this.state.breadcrumps;
          breadcrumpData.push({link:'#',text:this.state.bankBranchDetails.branchName + ' (' + this.state.bankBranchDetails.branchId+')'})
          this.setState({breadcrumps:breadcrumpData})
        });
      }).catch(error=>{
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if(Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400){
          this.setState({loading:false,serverError:true,serverStatus:Exceptionhandler.throwErrorType(error).status,serverErrMessage:Exceptionhandler.throwErrorType(error).message})
        }
        else{
          this.setState({loading:false,serverError:false})
        }
      })
    }
  }

  getBranchIdentificationDetails =() =>{
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiService.getBankBranchIdentification(this.props.match.params.branchId,headers)
      .then(response=>{         
        const TableData=response.data;
        this.setState({TableData,TableDataLen:TableData['data'].length,loading:false},()=>{
          
        })                
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
          this.setState({loading:false,serverError:false})
        }
      }); 
    } 
  }
  
  render() {

    const { classes } = this.props;
    const{TableData,TableDataLen} = this.state;
    
    return (
      <div className="global-font">
      {
        this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors"/> :
        [
          this.state.loading ? <Loader action={this.state.loaderMessage}/> : 
        <div>
              <MuiThemeProvider theme={getMuiTheme}>
          <Breadcrumps links={this.state.breadcrumps}/>
          <h3 className="bank-name-section"><Link className="back-button" to={this.state.backNavigate}>&lt;</Link>&nbsp;&nbsp;&nbsp;{this.state.bankBranchDetails.branchName}, {this.state.bankBranchDetails.city}</h3>
            <Card className={classes.card}>
            <AuditingComponent createDate="12/1/2019 10:45 am" createBy="Yeshwanth" modifiedBy="Shravan Kumar" modifiedDate ="12/1/2019 10:45 am"/>
              <div className="card-content">
             <p className="bank-profile-view">Bank Branch Profile Details View</p>
                <Grid container spacing={24} className="bank_details">
                  <Grid item xs={4} className="bank_details_section">
                  <p className="bank-profile-detail-view">Bank Name</p>
                  <p className="bank-profile-detail">{this.state.bankBranchDetails.bankName}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                  <p className="bank-profile-detail-view">Branch Name</p>
                  <p className="bank-profile-detail">{this.state.bankBranchDetails.branchName}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                  <p className="bank-profile-detail-view">Branch Code</p>
                  <p className="bank-profile-detail">{this.state.bankBranchDetails.branchCode}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                  <p className="bank-profile-detail-view">Country Code</p>
                  <p className="bank-profile-detail">{this.state.bankBranchDetails.countryCode}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                  <p className="bank-profile-detail-view">Zip Code</p>
                  <p className="bank-profile-detail">{this.state.bankBranchDetails.zipcode}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                    <p className="bank-profile-detail-view">Bank PO Box</p>
                    <p className="bank-profile-detail">{this.state.bankBranchDetails.poBox}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                   <p className="bank-profile-detail-view">Phone</p>
                   <p className="bank-profile-detail">{this.state.bankBranchDetails.phone}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                    <p className="bank-profile-detail-view">Email</p>
                    <p className="bank-profile-detail">{this.state.bankBranchDetails.email}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                  <p className="bank-profile-detail-view">Fax</p>
                  <p className="bank-profile-detail">{this.state.bankBranchDetails.fax}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                   <p className="bank-profile-detail-view">Bank Address1</p>
                   <p className="bank-profile-detail">{this.state.bankBranchDetails.address1}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                    <p className="bank-profile-detail-view">Bank Address2</p>
                    <p className="bank-profile-detail">{this.state.bankBranchDetails.address2}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                    <p className="bank-profile-detail-view">City</p>
                    <p className="bank-profile-detail">{this.state.bankBranchDetails.city}</p>
                  </Grid>
                  <Grid item xs={4} className="bank_details_section">
                   <p className="bank-profile-detail-view">State</p>
                   <p className="bank-profile-detail">{this.state.bankBranchDetails.state}</p>
                  </Grid>
                </Grid>
              </div>
            </Card>
            <hr/>
            <Grid container spacing={24} className="bank_details">
                <Grid item xs={12}>
            {
           TableDataLen!=0?
          <div><BranchEnhancedTableView fromPage="BranchProfileView" TableData={this.state.TableData}/></div> 
              :
              <EmptylistComponent fromPage="BranchTableProfileView"/> 
             }
          </Grid>
           </Grid>
          </MuiThemeProvider>
        </div>
        ]
        }
      </div>
    )
  }
}
BankBranchProfileView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BankBranchProfileView);