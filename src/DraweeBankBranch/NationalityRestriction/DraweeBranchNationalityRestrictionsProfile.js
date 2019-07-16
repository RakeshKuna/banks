import React from 'react';
import Grid from '@material-ui/core/Grid';
import DraweeBankNationalityRestrictionProfileView from './DraweeBankNationalityRestrictionProfileView';
import EnchancedTabs from '../../container/Tabs';
import Breadcrumps from '../../component/Breadcrumps';
import * as ApiService from './ApiService';
import * as Exceptionhandler from '../../ExceptionHandling';
import Loader from '../../component/Loader';
import EmptyListComponent from '../../component/EmptylistComponent';
import AuditingComponent from '../../component/AuditingComponent';
import * as BranchApiService from './../../DraweeBank/ApiService';
import * as config from '../../config/config';
import moment from 'moment';

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
    color:'white'
  },
});


  class DraweeBranchNationalityRestrictionsProfile extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        breadcrumps:[],
        value:0,
        loading:true, 
        loaderMessage:'Retrieving Data',
        serverStatus:null,
        serverError:false,
        serverErrMessage:'',
        draweeBankBranchNationalityRestrictionView:{},
        activityDetails: {},
      };
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

    handleTabVal=(val)=>{
      this.setState({value:val})
    }

    componentDidMount(){ 
      console.log(this.props)
     this.fetchNationalityRestrictionDetails();
    //  this.getActivity();
    }

    getActivity = () => {
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else {
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        this.setState({ loading: true }, () => {
          ApiService.getActivity(this.props.match.params.draweeId, this.props.match.params.nationalityprofieId)
            .then((response) => {
              if (response.status == 200) {
                console.log(response);
                this.setState({ loading: false, serverError: false, activityDetails: response.data }, () => {
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
                this.setState({ loading: false, serverError: false, confirmStatus: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
              }
            });
        })
      }
    }

    fetchNationalityRestrictionDetails(){
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        this.setState({loading:true},()=>{
            ApiService.getNationalityRestrictionProfile(this.props.match.params.draweeId,this.props.match.params.nationalityprofieId,headers)
            .then((response)=>{
            if(response.status == 200){
                this.setState({serverError:false,draweeBankBranchNationalityRestrictionView:response.data},()=>{
                  console.log(this.state.draweeBankBranchNationalityRestrictionView)
                    BranchApiService.fetchBankDetails(this.props.location.state.draweeId)
                    .then((response)=>{
                        if(response.status == 200){
                          let breadcrumps = [];
                          breadcrumps=[{link:'/draweebanklist/',text:'Drawee Banks'},{link:'/draweeBankProfile/'+this.props.location.state.draweeId,text:response.data.bankName+','+this.props.location.state.draweeId},{link:`/draweebranchprofilerules/${this.props.location.state.draweeId}/products/profile/${this.state.draweeBankBranchNationalityRestrictionView.draweeBankProductProfileId}`,text:this.state.draweeBankBranchNationalityRestrictionView.draweeBankProductProfileId},{link:'#',text:this.state.draweeBankBranchNationalityRestrictionView.id}]
                          this.setState({breadcrumps}, () => {
                            this.getActivity();
                          });
                        }
                    })
                    .catch(error=>{
                        if(Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400){
                            this.setState({loading:false,serverError:true,serverStatus:Exceptionhandler.throwErrorType(error).status,serverErrMessage:Exceptionhandler.throwErrorType(error).message})
                        }
                        else{
                            this.setState({loading:false,serverError:false,confirmStatus:true,apiErrMsg:error.response.data.error,actionType:'OK'})
                        }
                    });
                });
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
  }
  
render(){
  const { activityDetails } = this.state;
  return(
    <div> 
      {
        this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors"/> :
          [ this.state.loading ? 
            <Loader action={this.state.loaderMessage}/>
            :  
            <div>
            <Grid container spacing={24}>              
                <Grid item xs={12} style={{marginBottom:20,marginTop:20}}>              
                    <Breadcrumps links={this.state.breadcrumps}/>                         
                </Grid>             
            </Grid>   
            <EnchancedTabs value={this.state.value} getTabVal={this.handleTabVal} draweeLabel={"NATIONALITY RESTRICTIONS"} >
              {this.state.value === 0 && <DraweeBankNationalityRestrictionProfileView data={this.state.draweeBankBranchNationalityRestrictionView} />}
              {this.state.value === 1 && <AuditingComponent createDate={activityDetails.createDate} createBy={activityDetails.createBy} modifiedBy={activityDetails.modifiedBy} modifiedDate={activityDetails.modifiedDate}/>}
          </EnchancedTabs>
          </div>
          ]
      }  
    </div>
  );
  }
}

export default DraweeBranchNationalityRestrictionsProfile;