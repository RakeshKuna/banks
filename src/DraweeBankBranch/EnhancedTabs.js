import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
// import { Tabs, Tab, Badges } from 'finablr-ui';
import DraweeBankGeneralRules from './DraweeBankGeneralRules';
import DraweeBankFieldValidations from './DraweeBankFieldValidations';
import DraweeBankNationalityRestrictions from './NationalityRestriction/DraweeBankNationalityRestrictions';
import ManageTrasmissionList from './ManageTransmission/ManageTrasmissionList'
import TabContainer from '../container/TabContainer';
import ModalBox from './../component/Modalbox';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import * as Exceptionhandler from './../ExceptionHandling';
import CountryRestrictions from './CountryRestriction/CountryRestriction';
import SourceOfFunds from './SourceOfFunds/SourceOfFunds';
import DraweeBank4Rate from './DraweeBank4Rate/DraweeBank4Rate';
import AgentDraweeBank4Rate from './AgentDraweeBank4Rate/AgentDraweeBank4Rate';
import * as ApiService from './CountryRestriction/ApiService';
import * as BeneficiaryApiService from './BeneficiaryBank/ApiService';
import * as PurposeApiService from './PurposeOfTransaction/ApiService'
import BeneficiaryBank from './BeneficiaryBank/BeneficiaryBankMapping';
import * as ApiManageService from './ManageTransmission/ApiManageService';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme";
import '../vendor/common.css';
import Loader from '../component/Loader';
import * as SourceOfFundsApiService from './SourceOfFunds/SourceOfFundsApiService';
import * as APIDrawee4RateService from './DraweeBank4Rate/APIDrawee4RateService';
import * as APIAgentDrawee4RateService from './AgentDraweeBank4Rate/APIAgentDrawee4RateService';
import PurposeOfTransaction from './PurposeOfTransaction/PurposeOfTransaction';
import * as config from './../config/config';
import EmptyListComponent from '../component/EmptylistComponent';

const styles = theme => ({
  root: {
      flexGrow: 1,
      
  },
  badge: {
      background: `#25479e`,
      marginRight:-12,
      width:24,
      height:24,
      borderRadius: '12px',
    },
  indicator: {
      backgroundColor: 'white',
      height: `3px`
  },
  appbar: {
      boxShadow: 'none'
  },
  tabs: {
      backgroundColor: '#19ace3',
      color: '#fff',
      fontSize: '16px'
  },
  testColor: {
      color: 'blue !important'
  }
});

let currentVal = 0;
class EnchancedTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      confirmChange: false,
      actionCompChange: false,
      actionType: 'YES',
      pageNum: 0,
      totalRecordsofNationalityRestriction: 0,
      pageelements: 10,
      modalMessage: 'There are un saved changes on this page. These will be lost if not saved! Are you sure you want to continue?',
      countryRestrictionRecords: 0,
      beneficiaryBankRecords: 0,
      sourceOfFundsRecords: 0,
      draweeBank4RateRecords: 0,
      agentDraweeBank4RateRecords: 0,
      loading: false,
      loaderMessage: '',
      serverError: false,
      serverErrMessage: '',
      shownogeneralrules: false,
      apiErrMsg: '',
      actionType: '',
      manageTransmissionstotal: 0,
      purposeBankRecords: null,
    };
  }

  componentDidMount() {
    console.log(this.props);
    isNaN(this.props.tabIndex) ? this.setState({ value: 0 }) : this.setState({ value: this.props.tabIndex });
    this.fetchIndividualRulesCounts();
  }

  fetchIndividualRulesCounts = () => {
    let params = {
      pagenumber: this.state.pageNum,
      pageelements: this.state.pageelements,
    }
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      this.setState({ loading: true }, () => {
        DraweeeBankBranchApiService.IndividualRulesCounts(this.props.draweeBankBranchProfileView.branchId).then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            let data = response.data
            this.setState({
              countryRestrictionRecords: data.countryRestrictionsCount,
              totalRecordsofNationalityRestriction: data.nationalityRestrictionsCount,
              manageTransmissionstotal: data.manageTransmissionsCount,
              beneficiaryBankRecords: data.beneficiaryBankMappingsCount,
              purposeBankRecords: data.purposeOfTransactionRulesCount,
              sourceOfFundsRecords: data.sourceOfFundsRulesCount,
              draweeBank4RateRecords: data.draweeBankForRatesCount,
              agentDraweeBank4RateRecords: data.agentDraweeBankForRatesCount,
            }, () => {
              this.setState({ loading: false }, () => {
              })
            });
          }
        }).catch(error => {
          if(Exceptionhandler.throwErrorType(error).status == 401){
            window.location.replace(config.PAAS_LOGIN_URL);
            return (<h1>401 - Unauthorized Request</h1>)
          }
          else if (Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400) {
            console.log(Exceptionhandler.throwErrorType(error));
            this.setState({ loading: false,serverError: true, serverStatus: Exceptionhandler.throwErrorType(error).status, serverErrMessage: Exceptionhandler.throwErrorType(error).message })
          }
        });
      })
    }
  }

  handleChange = (event, valt) => {
    let emptydatasearch = '';
    this.setState({ confirmChange: false }, () => {
      currentVal = valt;
      if (this.state.actionCompChange === true) {
        this.setState({ confirmChange: true, actionType: 'Yes' });
      }
      else {
        this.props.props.history.push(`/draweebranchprofilerules/${this.props.draweeId}/products/profile/${this.props.draweeProductId}?tabId=${valt}`)
        this.setState({ confirmChange: false, actionCompChange: false, value: valt }, () => {

        });
      }
    })
  };

  handleCompValueChange = (data) => {
    console.log("Tab Change Genral Rules" + data)
    this.setState({ actionCompChange: data });
  }

  handleModalResponse = (data) => {
    if (data) {
      this.setState({ value: currentVal, confirmChange: false });
    }
    else {
      this.setState({ confirmChange: false });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
      {
        this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors" /> :
        [
          <div className={classes.root}>
            <div>
              {
                this.state.loading ?
                  <Loader action={this.state.loaderMessage} />
                  :
                  <AppBar position="static" className={classes.appbar}>
                                    <Tabs value={this.state.value} 
                                    onChange={this.handleChange} 
                                    variant="scrollable" 
                                    scrollButtons="auto"  classes={{ root: classes.tabs, indicator: classes.indicator }}>
                        <Tab style={{ fontSize: "16px", fontFamily: "Gotham-Rounded" }} label="GENERAL RULES" />
                        <Tab style={{ fontSize: "16px", fontFamily: "Gotham-Rounded"}} label="FIELD VALIDATIONS" />
                                        <Tab style={{ height: '70px', fontSize: '16px', minWidth: '300px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.countryRestrictionRecords}> COUNTRY RESTRICTIONS </Badge>} /> 
                                        <Tab style={{ fontSize: '16px', minWidth: '310px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.totalRecordsofNationalityRestriction}> NATIONALITY RESTRICTIONS </Badge>} />
                                        <Tab style={{ fontSize: '16px', minWidth: '200px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.manageTransmissionstotal}> MANAGE TRANSMISSION </Badge>} />
                                        <Tab style={{ fontSize: '16px', minWidth: '300px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.beneficiaryBankRecords}> BENEFICIARY BANK MAPPING </Badge>} />
                                        <Tab style={{ fontSize: '16px', minWidth: '300px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.purposeBankRecords}> PURPOSE OF TRANSACTION </Badge>} />
                                        <Tab style={{ fontSize: '16px', minWidth: '300px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.sourceOfFundsRecords}> SOURCE OF FUNDS </Badge>} />
                                        <Tab style={{ fontSize: '16px', minWidth: '300px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.draweeBank4RateRecords}> DRAWEE BANK FOR RATE </Badge>} />
                                        <Tab style={{ fontSize: '16px', minWidth: '310px',fontFamily: "Gotham-Rounded" }} label={<Badge invisible={false} classes={{badge:classes.badge}}  badgeContent={this.state.agentDraweeBank4RateRecords}> AGENT DRAWEE BANK FOR RATE </Badge>} />
                                    </Tabs>
                                    </AppBar>

                  // <AppBar position="static" className={classes.appbar}>
                  //   <Tabs value={this.state.value} scrollable={true} umStyle="primary" onChange={this.handleChange}>
                  //     <Tab style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative" }} label="GENERAL RULES" />
                  //     <Tab style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative" }} label="FIELD VALIDATIONS" />
                  //     <Tab id="white" style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative","white-space":"nowrap" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e', top:-16,position:'relative', left:117 }} type="notifiyBadge" value={this.state.countryRestrictionRecords} />} label="COUNTRY RESTRICTIONS" />
                  //     <Tab className="tabline" style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e',top:1,position:'relative', left:-4 }} type="notifiyBadge" value={this.state.totalRecordsofNationalityRestriction} />} label="NATIONALITY RESTRICTIONS" />
                  //     <Tab className="tabline" style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e', top:1,position:'relative', left:-1 }} type="notifiyBadge" value={this.state.manageTransmissionstotal} />} label="MANAGE TRANSMISSION" />
                  //     <Tab className="tabline" style={{ fontSize: "17px", maxWidth:"440px", fontFamily: "Gotham-Rounded", position: "relative" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e',top:1,position:'relative', left:-5 }} type="notifiyBadge" value={this.state.beneficiaryBankRecords} />} label="BENEFICIARY BANK MAPPING" />
                  //     <Tab className="tabline" style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e', top:1,position:'relative', left:-2 }} type="notifiyBadge" value={this.state.purposeBankRecords} />} label="PURPOSE OF TRANSACTION" />
                  //     <Tab style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e' }} type="notifiyBadge" value={this.state.sourceOfFundsRecords} />} label="SOURCE OF FUNDS" />
                  //     <Tab className="tabline" style={{ fontSize: "17px", fontFamily: "Gotham-Rounded", position: "relative" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e',top:1,position:'relative', left:-3 }} type="notifiyBadge" value={this.state.draweeBank4RateRecords} />} label="Drawee Bank For Rate" />
                  //     <Tab className="tabline" style={{ fontSize: "17px", maxWidth:"400px", fontFamily: "Gotham-Rounded", position: "relative" }} badge={<Badges umStyle="primary" style={{ backgroundColor: '#25479e',top:-4,position:'relative', left:-14 }} type="notifiyBadge" value={this.state.agentDraweeBank4RateRecords} />} label="Agent Drawee Bank For Rate" />
                  //   </Tabs>
                  // </AppBar>
              }
              {this.state.value === 0 && <DraweeBankGeneralRules draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} />}
              {this.state.value === 1 && <DraweeBankFieldValidations draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} />}
              {this.state.value === 2 && <CountryRestrictions props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} getNewBadge={this.fetchIndividualRulesCounts} />}
              {this.state.value === 3 && <DraweeBankNationalityRestrictions props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} getNewBadge={this.fetchIndividualRulesCounts} handleCompValueChange={this.handleCompValueChange} />}
              {this.state.value === 4 && <ManageTrasmissionList props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} getNewBadge={this.fetchIndividualRulesCounts} />}
              {this.state.value === 5 && <BeneficiaryBank props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} getNewBadge={this.fetchIndividualRulesCounts} />}
              {this.state.value === 6 && <PurposeOfTransaction props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} getNewBadge={this.fetchIndividualRulesCounts} />}
              {this.state.value === 7 && <SourceOfFunds props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} getNewBadge={this.fetchIndividualRulesCounts} ></SourceOfFunds>}
              {this.state.value === 8 && <DraweeBank4Rate props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} getNewBadge={this.fetchIndividualRulesCounts} ></DraweeBank4Rate>}
              {this.state.value === 9 && <AgentDraweeBank4Rate props={this.props} draweeBankBranchProfileView={this.props.draweeBankBranchProfileView} handleCompValueChange={this.handleCompValueChange} getNewBadge={this.fetchIndividualRulesCounts} ></AgentDraweeBank4Rate>}


            </div>
            {
              this.state.confirmChange ? <ModalBox isOpen={this.state.confirmChange} actionType={this.state.actionType} message={(this.state.modalMessage)} modalAction={this.handleModalResponse} /> : null
            }

          </div>
        ]
      }
      </MuiThemeProvider>

    );
  }
}


EnchancedTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnchancedTabs);