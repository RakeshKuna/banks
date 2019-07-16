import React , { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import '../vendor/common.css';
import '../theme/theme';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import rows from './AccountValidationViewTableHeader';
import ruleLengthRows from './AccountValidationViewLengthTableHeader';
import AccountVaildationviewTable from './AccountValidationViewTable';
import AccountVaildationviewLengthTable from './AccountValidationViewLengths';
const styles = theme => ({
    root: {
      flexGrow: 1,       
    },
  
    indicator: {
      backgroundColor: 'white',
      height:`4px`
    },
    appbar:{
      boxShadow:'none'
    },
    tabs:{
        backgroundColor:'#19ace3',
        color:'#fff'
    },
    title: {
        fontSize: 14,
        fontFamily: 'Gotham-Rounded'
    },
    testColor:{
  color:'blue !important'
    }
});

function TabContainer(props) {
    return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
    </Typography>
    );
}

class AccountVaidationView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:true, 
            loaderMessage:'Retrieving Data',
            serverStatus:null,
            serverError:false,
            serverErrMessage:'',
            accountValidationDetails:{},
            breadcrumps:[],
            tableHeader:rows,
            ruleLengthHeaders:ruleLengthRows,
            validationValue:[]
        };
    }

    componentDidMount(){
       console.log(this.props); 
       this.setState({
          validationValue:this.props.accountValidationDetails.validationValue
       });
    }
    
    render() {
        const { classes } = this.props;
        return (
            <TabContainer>
                <div className={classes.root}>
                    <Grid container spacing={24}>
                    <Grid item xs={12}>
                    <p  className="account-validation-header">Validations</p>
                    </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Country
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.accountValidationDetails.countryName}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Drawee Bank
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {(this.props.accountValidationDetails.draweeBankName !== null) ? this.props.accountValidationDetails.draweeBankName : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Drawee Bank Profile
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {(this.props.accountValidationDetails.draweeBankProfile !== null) ? this.props.accountValidationDetails.draweeBankProfile : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Beneficiary Bank
                            </Typography>
                            <span className="drawee-profile-view" >   
                            {(this.props.accountValidationDetails.beneficiaryBank !== null) ? this.props.accountValidationDetails.beneficiaryBank : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={12}><p className="account-validation-header">Set Validation Rule</p></Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                AlphaNumeric Allowed
                            </Typography>
                            <span className="drawee-profile-view" >      
                            {(this.props.accountValidationDetails.allowAlphaNumeric !== null) ? 'Yes' : 'No'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Status
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.accountValidationDetails.status}
                            </span>
                        </Grid>
                    </Grid>
                </div>

                  <Grid container spacing={24} className="bank_details">
                  <Grid item xs={12}>
                    {
                      this.props.accountValidationDetails.accountNumberLengths.length > 0
                      ?
                      <AccountVaildationviewLengthTable accountNumberLengths={this.props.accountValidationDetails.accountNumberLengths} rowsHdr={this.state.ruleLengthHeaders}/>
                      :null
                    } 
                  </Grid>
                  <Grid item xs={12}>
                  {
                  (this.state.validationValue.length > 0)?
                  <div style={{width: '100%',marginTop:20,marginBottom:20}}>
                  <AccountVaildationviewTable validationValue={this.state.validationValue} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props}/>
                  </div> : null
                }
                   </Grid>
                    </Grid>
            </TabContainer>
        );
      }
}

AccountVaidationView.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(AccountVaidationView);