import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Breadcrumps from '../component/Breadcrumps';
import * as ApiService from './BanksApiService';
import BankProfileDetails from './BankProfileDetails';
import * as Exceptionhandler from '../ExceptionHandling';
import Loader from '../component/Loader';
import EmptyListComponent from '../component/EmptylistComponent';
import AuditingComponent from '../component/AuditingComponent';
import BranchList from '../Branches/BranchList';
import Divider from '@material-ui/core/Divider';
import { Tabs, Tab } from 'finablr-ui';
import moment from 'moment';
import * as config from './../config/config';

const styles = theme => ({
  root: {
    flexGrow: 1,
    border: '1px solid lightgrey',
    backgroundColor: '#fff',
  },
  divider: {
    margin: '3% 0 1%',
    height: 3
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

class EnchancedTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      loading: true,
      loaderMessage: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      bankDetails: {},
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
    this.getBankDetails();
  }

  getBankDetails() {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        ApiService.getBankDetails(this.props.match.params.bankId)
          .then((response) => {
            if (response.status == 200) {
              this.setState({ serverError: false, bankDetails: response.data }, () => {
                let breadcrumps = [];
                breadcrumps = [{ link: '/banklist', text: 'Banks Profiles' }, { link: '#', text: this.state.bankDetails.bankName + ' (' + this.state.bankDetails.bankId + ')' }];
                this.setState({ breadcrumps }, () => {
                  this.getActivity();
                });
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
        // .catch(error => {
        //   if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400 || Exceptionhandler.throwErrorType(error).status == 400) {
        //     this.setState({ loading: false, serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
        //   }
        //   else {
        //     this.setState({ loading: false, serverError: false, confirmStatus: true, apiErrMsg: error.response.data.error, actionType: 'OK' })
        //   }
        // });
      })
    }
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
        ApiService.getActivity(this.props.match.params.bankId)
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
                        <Tab style={{ fontSize: "17px", fontFamily: "Gotham-Rounded" }} label="BANK PROFILE DETAILS" />
                        <Tab style={{ fontSize: "17px", fontFamily: "Gotham-Rounded" }} label="ACTIVITY" />
                      </Tabs>
                    </AppBar>

                    {this.state.value === 0 && <BankProfileDetails bankDetails={this.state.bankDetails} />}
                    {this.state.value === 1 && <AuditingComponent createDate={activityDetails.createDate} createBy={activityDetails.createBy} modifiedBy={activityDetails.modifiedBy} modifiedDate={activityDetails.modifiedDate}/>}
                  </div>
                  <Divider className={classes.divider} />
                    { this.state.value === 0 ?
                      <Grid container spacing={24} className="bank_details"><BranchList /></Grid>:null
                    }
                </div>
            ]
        }
      </div>
    );
  }
}

EnchancedTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnchancedTabs);