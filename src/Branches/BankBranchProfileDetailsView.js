import React , { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import '../vendor/common.css';
import '../theme/theme';
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

class BankBranchProfileDetailsView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:true, 
            loaderMessage:'Retrieving Data',
            serverStatus:null,
            serverError:false,
            serverErrMessage:'',
            bankBranchDetails:{},
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
                                Bank Name
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.bankName}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Branch Name
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.branchName}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Branch Code
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.branchCode}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Country Code
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.countryCode}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Zip Code
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.zipcode}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Bank PO Box
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.poBox}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Phone
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.phone}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Email
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.email}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Fax
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.fax}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Bank Address 1
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.address1}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Bank Address 2
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.address2}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                City
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.city}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                State
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.state}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Status
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankBranchDetails.status}
                            </span>
                        </Grid>
                    </Grid>
                </div>
            </TabContainer>
        );
      }
}

BankBranchProfileDetailsView.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(BankBranchProfileDetailsView);