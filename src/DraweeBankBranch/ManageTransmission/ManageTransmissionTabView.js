import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import * as ApiManageService from './ApiManageService';
import * as Exceptionhandler from '../../ExceptionHandling';
import * as BranchApiService from './../../DraweeBank/ApiService';
import ManageTransmissionView from './ManageTransmissionView';
import Loader from '../../component/Loader';
import EmptyListComponent from '../../component/EmptylistComponent';
import '../../vendor/common.css';
import '../../theme/theme';
import Grid from '@material-ui/core/Grid';
import Breadcrumps from '../../component/Breadcrumps';
import AuditingComponent from '../../component/AuditingComponent';
import { Tabs, Tab } from 'finablr-ui';
import * as config from '../../config/config';
import moment from 'moment';

const styles = theme => ({
  root: {
    flexGrow: 1,
    border: '1px solid lightgrey',
    backgroundColor: "white",
  },

  indicator: {
    backgroundColor: 'white',
    height: `4px`
  },
  appbar: {
    boxShadow: 'none'
  },
  tabs: {
    backgroundColor: '#19ace3',
    color: '#fff'
  },
  testColor: {
    color: 'blue !important'
  }
});

class ManageTransmissionTabView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      loading: true,
      loaderMessage: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      ManageTransmissionProfile: {},
      breadcrumps: [],
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

  componentDidMount() {
    console.log(this.props);
    this.fetchManageTransmissonViewDetails();
    // this.getActivity();
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
        ApiManageService.getActivity(this.props.match.params.draweeProductId, this.props.match.params.managetransmissonprofileid)
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

  fetchManageTransmissonViewDetails() {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiManageService.getManageTrannmssionsDetails(this.props.match.params.draweeProductId, this.props.match.params.managetransmissonprofileid,headers)
          .then((response) => {
            if (response.status == 200) {
              this.setState({ serverError: false, ManageTransmissionProfile: response.data }, () => {
                BranchApiService.fetchBankDetails(this.props.location.state.draweeId,headers)
                  .then((response) => {
                    if (response.status == 200) {
                      let breadcrumps = [];
                      breadcrumps = [{ link: '/draweebanklist/', text: 'Drawee Banks' }, { link: '/draweeBankProfile/' + this.props.location.state.draweeId, text: response.data.bankName + ',' + this.props.location.state.draweeId }, { link: `/draweebranchprofilerules/${this.props.location.state.draweeId}/products/profile/${this.state.ManageTransmissionProfile.draweeBankProductProfileId}`, text: this.state.ManageTransmissionProfile.draweeBankProductProfileId }, { link: '#', text: this.state.ManageTransmissionProfile.id }]
                      this.setState({ breadcrumps }, () => {
                        this.getActivity();
                      });
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
                      this.setState({ loading: false, serverError: false, confirmStatus: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
                    }
                  });
              });
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
              this.setState({ loading: false, serverError: false, confirmStatus: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
            }
          });
      })
    }
  }

  handleChange = (event, valt) => {
    this.setState({ value: valt });
  };

  render() {
    const { classes } = this.props;
    const { value, activityDetails } = this.state;
    return (
      <div>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
            [
              this.state.loading ?
                <Loader action={this.state.loaderMessage} />
                :
                <div>
                  <Grid container spacing={24}>
                    <Grid item xs={12} style={{ marginBottom: 20, marginTop: 20 }}>
                      <Breadcrumps links={this.state.breadcrumps} />
                    </Grid>
                  </Grid>
                  <div className={classes.root}>
                    <AppBar position="static" className={classes.appbar}>
                      <Tabs value={value} umStyle="primary" onChange={this.handleChange}>
                        <Tab style={{ fontSize: "17px", fontFamily: "Gotham-Rounded" }} label="MANAGE TRANSMISSION" />
                        <Tab style={{ fontSize: "17px", fontFamily: "Gotham-Rounded" }} label="ACTIVITY" />
                      </Tabs>
                    </AppBar>
                    {this.state.value === 0 && <ManageTransmissionView ManageTransmissionProfile={this.state.ManageTransmissionProfile} />}
                    {this.state.value === 1 && <AuditingComponent createDate={activityDetails.createDate} createBy={activityDetails.createBy} modifiedBy={activityDetails.modifiedBy} modifiedDate={activityDetails.modifiedDate}/>}
                  </div>
                </div>
            ]
        }
      </div>
    );
  }
}

ManageTransmissionTabView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageTransmissionTabView);
