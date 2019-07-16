import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import  Divider  from '@material-ui/core/Divider';
import DraweeBankProfileView from '../DraweeBank/DraweeBankProfileView';
import DraweeBankBranchList from './DraweeBankBranchList';
import Breadcrumps from '../component/Breadcrumps';
import Loader from '../component/Loader';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import * as ApiService from '../DraweeBank/ApiService';
import EmptyListComponent from '../component/EmptylistComponent';
import ModalBox from './../component/Modalbox';
import Noresult from '../component/NoResults';
import * as Exceptionhandler from './../ExceptionHandling';
import * as config from './../config/config';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  divider:{
    margin:'3% 0 1%',
    height:3
  }, 
  fab: {
    margin: theme.spacing.unit,
   // backgroundColor: "#2f2e2e",
    color:'white'
  },
});

class DraweeBankBranchProfileList extends Component {
  constructor(props){
    super(props)
    this.state = {
      open:false,
      breadcrumps:[],
      draweeBankView:'',
      formPg:'' ,
      editbtn:false,
      draweeBankBranchEdit:'',
      callTableData:false,
      loading:false ,
      loaderMessage:'Retrieving Data',
      draweeBankDetails:{}, 
      draweeProfileId:'',
      serviceProviderCode:'',
      draweeIid:'',
      openCreateModal:false,
      loaderMessage: 'Retrieving Data',
      confirmStatus: false,
      apiErrMsg: '',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      loading:true,
      actionType:'',
      activityTab:true
    }
  }

  // hari logic
  componentDidMount(){
    this.fetchBankProfile();
    this.setState({draweeIid:this.props.match.params.draweeId})
    if(this.props.location.state !== undefined){
      if(this.props.location.state.onModalCreateProfile == true){
        this.setState({serviceProviderCode:this.props.location.state.serviceProvider},()=>{
          this.handleCreateEditModal();
        })
      }
      else{
        return null;
      }
    }
  }

  fetchBankProfile=()=>{
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      ApiService.fetchBankDetails(this.props.match.params.draweeId,headers)
      .then(response=>{ 
        this.setState({draweeBankDetails:response.data,serviceProviderCode:response.data.serviceProviderCode},()=>{console.log(response.data.serviceProviderCode)
          let breadcrumpData = [{link:'/draweebanklist',text:'Drawee Banks'},{link:'#',text:this.state.draweeBankDetails.bankName+' ('+this.state.draweeBankDetails.id+')'}];
          this.setState({breadcrumps:breadcrumpData,loading:false})   
        });
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
          this.setState({ loading: false, serverError: false, createProfile: true, modalMessage: error.response.data.error, actionType: 'OK' })
        }
      })
    }
  }

  handleGetEdit=(editVal,editId)=>{
    this.setState({loading:true})
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
    DraweeeBankBranchApiService.getdraweebranchprofile(this.props.match.params.draweeId,editId,headers) 
      .then((response)=>{
         if(response.status===200){
           this.setState({draweeBankBranchEdit:response.data,editbtn:editVal,draweeProfileId:editId,open:editVal,loading:false})           
         }
      })
      .catch((error)=>{
        if(Exceptionhandler.throwErrorType(error).status == 401){
          window.location.replace(config.PAAS_LOGIN_URL);
          return (<h1>401 - Unauthorized Request</h1>)
        }
        else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 404) {
          this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
        }
        else {
          this.setState({ loading: false, serverError: false, createProfile: true, modalMessage: error.response.data.error, actionType: 'OK' })
        }
      })
    }
  }

  handleCreateEditModal=()=>{
    this.setState({openCreateModal:true});
  }

  handleModalResponse = () => {
    this.setState({ createProfile: false });
  }

  handleTab = (data) => {
    console.log(data);
    if(data){
      this.setState({activityTab:true})
    }
    else{
      this.setState({activityTab:false})
    }
  }
  
  render() {
    
    const { classes } = this.props;
    return (
      <div>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
          <div className={classes.root}>
             {
                this.state.loading ?
                  <Loader action={this.state.loaderMessage} />
                  :
                <div>
                  <Grid container spacing={24}>              
                    <Grid item xs={12}>              
                        <Breadcrumps links={this.state.breadcrumps}/>                         
                    </Grid>             
                    <Grid item xs={12}>
                      <DraweeBankProfileView draweeBankView={this.state.draweeBankDetails} {...this.props} handleTab={this.handleTab}/>
                    </Grid>
                  </Grid> 
                  <Divider className={classes.divider}/>
                  {
                    this.state.activityTab ?
                    <Grid container spacing={24}>   
                      <Grid item xs={12}>
                          <DraweeBankBranchList openCreateModal={this.state.openCreateModal} draweeId={this.state.draweeIid} callTable={this.state.callTableData}  
                          getEdit={this.handleGetEdit} editval={this.state.editbtn} 
                          draweeBankView={this.state.draweeBankDetails}
                          draweeId={this.props.match.params.draweeId}
                          {...this.props}
                          />          
                      </Grid>
                    </Grid> : null 
                  }  
                  {
                  this.state.createProfile ? <ModalBox isOpen={this.state.createProfile} actionType={this.state.actionType} message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
                  }
                </div>
            }      
          </div>
        }
      </div>      
    );
  }
}

DraweeBankBranchProfileList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DraweeBankBranchProfileList);