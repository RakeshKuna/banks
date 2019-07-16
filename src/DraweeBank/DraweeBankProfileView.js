import React , { Component } from 'react';
import EnchancedTabs from '../container/Tabs';
import TabContainer from './../container/TabContainer';
import DraweeBankProfile from '../DraweeBank/DraweeBankProfile';
import AuditingComponent from '../component/AuditingComponent';
import moment from 'moment';
import * as ApiService from './ApiService';
import * as config from './../config/config';
import * as Exceptionhandler from '../ExceptionHandling';

class DraweeBankProfileView extends Component{
    constructor(props){
        super(props)
        this.state={
            value:0,
            draweeBankName:'',
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
        this.getActivity();
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
            ApiService.getActivity(this.props.match.params.draweeId)
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

    handleTabVal=(val)=>{
      this.setState({value:val},()=>{
        if(this.state.value == 0){
          this.props.handleTab(true);
        }
        else{
          this.props.handleTab(false);
        }
      })
    }

    handledraweeBankView=(val)=>{
     this.props.getdraweeBankViewL(val)
    }

  render(){
      const { activityDetails } = this.state;
    return(
        <EnchancedTabs value={this.state.value} getTabVal={this.handleTabVal} draweeLabel={"DRAWEE BANK DETAILS"} >
            {this.state.value === 0 && <DraweeBankProfile draweeBankProfileView={this.props.draweeBankView} />}
            {this.state.value === 1 && <AuditingComponent createDate={activityDetails.createDate} createBy={activityDetails.createBy} modifiedBy={activityDetails.modifiedBy} modifiedDate={activityDetails.modifiedDate}/>}
        </EnchancedTabs>
    )
  }
}

export default DraweeBankProfileView;
