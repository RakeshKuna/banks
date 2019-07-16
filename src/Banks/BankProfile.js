import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import '../vendor/common.css';
import {MuiThemeProvider} from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme";
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Loader from '../component/Loader';
import AuditingComponent from '../component/AuditingComponent';
import Breadcrumps from './../component/Breadcrumps';
import * as ApiService from './BanksApiService';
import * as Exceptionhandler from './../ExceptionHandling';
import EmptyListComponent from '../component/EmptylistComponent';
import * as config from './../config/config';

const drawerWidth = 240;

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
      flexGrow: 1,
    },
    table: {
      minWidth: 700,
    },
    button: {
        margin: theme.spacing.unit,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 73,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 240,
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
 
const mapStateToProps=state=>{
  return{
    bankId:state.bankId
  }
}

class BankProfilec extends React.Component{
    constructor(props){
        super(props)
        this.state={
            bankDetails:{},  
            bankId:'',
            loading:true,
            breadcrumps:[],
            loaderMessage:'Retrieving Data',
            serverStatus:null,
            serverError:false,
            serverErrMessage:''
        }
    }

    componentDidMount(){
      // if(this.props.bankId['bankid'] === undefined){
      //   sessionStorage.getItem('bankId');
      //   this.setState({bankId:JSON.parse(sessionStorage.getItem('bankId'))},()=> this.getBankDetails())
      // }
      // else{
      //   this.setState({bankId:this.props.bankId['bankid']},()=> this.getBankDetails())
      // }
      this.getBankDetails()
    }

    getBankDetails = () =>{
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        ApiService.getBankDetails(this.props.match.params.bankId,headers)
        .then((res)=>{
          this.setState({bankDetails:res.data,loading:false},()=>{
            var breadcrumpData = [{link:'/banklist',text:'Bank Profiles'},{link:'#',text:this.state.bankDetails.bankName+' ('+this.state.bankDetails.bankId+')'}];
            this.setState({breadcrumps:breadcrumpData})
          });
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
        })
      }
    }

    render(){
        const {classes,theme1}=this.props;
        const { open } = this.props;
      
        return(
            <div className="global-font">
            {
              this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors"/> :
              [
                this.state.loading ? <Loader action={this.state.loaderMessage}/> : 
              <div>
                <Breadcrumps links={this.state.breadcrumps}/>
                <h3 className="bank-name-section"><Link className="back-button" to="/banklist">&lt;</Link>&nbsp;&nbsp;&nbsp;{this.state.bankDetails.bankName}</h3>
                <MuiThemeProvider theme={getMuiTheme}>
                  <Card className={classes.card}>
                    <AuditingComponent createDate="12/1/2019 10:45 am" createBy="Yeshwanth" modifiedBy="Shravan Kumar" modifiedDate ="12/1/2019 10:45 am"/>
                    <div className="card-content">
                    <p className="bank-profile-view">BANK PROFILE DETAILS VIEW</p>
                      <Grid container spacing={24} className="bank_details">
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Bank Name</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.bankName}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Bank Code</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.bankCode}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Country</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.country}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Phone</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.phone}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Phone 2</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.phone2}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Mobile</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.mobile}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">FAX</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.fax}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Email</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.email}</p>
                        </Grid>
                        <Grid item xs={4} className="bank_details_section">
                          <p className="bank-profile-detail-view">Website</p>
                          <p className="bank-profile-detail">{this.state.bankDetails.website}</p>
                        </Grid>
                      </Grid>
                    </div>
                  </Card>
                </MuiThemeProvider>
              </div> 
              ]
            }  
          </div>
        )
    }
}

BankProfilec.propTypes = {
  classes: PropTypes.object.isRequired,
};

const BankProfile = connect(mapStateToProps)(BankProfilec);
export default withRouter(withStyles(styles)(BankProfile));