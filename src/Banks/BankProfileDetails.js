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

class BankProfileDetails extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:true, 
            loaderMessage:'Retrieving Data',
            serverStatus:null,
            serverError:false,
            serverErrMessage:'',
            bankDetails:{},
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
                                {this.props.bankDetails.bankName}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Bank Code
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.bankCode}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Country
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.country}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Phone
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.phone}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Phone 2
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.phone2}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Mobile
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.mobile}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Fax
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.fax}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Email
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.email}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Web Site
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.website}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Status
                            </Typography>
                            <span className="drawee-profile-view" >            
                                {this.props.bankDetails.status}
                            </span>
                        </Grid>
                      
                    </Grid>
                </div>
            </TabContainer>
        );
      }
}

BankProfileDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(BankProfileDetails);