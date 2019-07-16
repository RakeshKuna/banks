import React , { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import '../../vendor/common.css';
import '../../theme/theme';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

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

class CountryRestrictionView extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading:true, 
            loaderMessage:'Retrieving Data',
            serverStatus:null,
            serverError:false,
            serverErrMessage:'',
            countryRuleProfile:{},
            breadcrumps:[]
        };
    }

    componentDidMount(){
       console.log(this.props); 
    }

    render() {
        const { classes } = this.props;
        return (
            <TabContainer>
                <div className={classes.root}>
                    <Grid container spacing={24}>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Allowed Customer Type
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.countryRuleProfile['customerType']}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Allowed Beneficiary Type
                            </Typography>
                            <span className="drawee-profile-view" >            
                            {this.props.countryRuleProfile['beneficiaryType']}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Agent Source Country
                            </Typography>
                            <span className="drawee-profile-view" >  
                            {(this.props.countryRuleProfile['country'] != null )? this.props.countryRuleProfile['country'].name : 'All'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Agent
                            </Typography>
                            <span className="drawee-profile-view" >            
                            {(this.props.countryRuleProfile['agent'] != null )? this.props.countryRuleProfile['agent'] : 'All'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Destination Country
                            </Typography>
                            <span className="drawee-profile-view" > 
                            {(this.props.countryRuleProfile['destinationCountry'] !== null)? this.props.countryRuleProfile['destinationCountry'].name : '---'}           
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Status
                            </Typography>
                            <span className="drawee-profile-view" >            
                            {this.props.countryRuleProfile['status']}
                            </span>
                        </Grid>


                        <Grid item xs={12}>
                        <div className="country-restriction-agentbranches-section">
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Agent Branches
                            </Typography>
                        </div>
                        <Grid container spacing={24}>
                            {
                            (this.props.countryRuleProfile['agent'] != null ) ?  
                            [
                                this.props.countryRuleProfile['agentBranches'].map((obj)=>{
                                    return (
                                        <Grid style={{ paddingTop: 0 }} item xs={4}>
                                            <p className="drawee-profile-view" >
                                                {obj.branchName}
                                            </p>
                                        </Grid>
                                    )
                                })
                                ] : <Grid item xs={4}><p>All</p></Grid>
                            }
                        </Grid>
                    </Grid>
                    </Grid>
                </div>
            </TabContainer>
        );
      }
}

CountryRestrictionView.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(CountryRestrictionView);