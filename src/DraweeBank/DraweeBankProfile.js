import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import EnchancedTabContainer from './../container/TabContainer';
import * as ApiService from './ApiService'; 

const styles = theme => ({
    root: {
      flexGrow: 1,
    },  
    title: {
        fontSize: 14,
        fontFamily:"Gotham-Rounded"
      }, 
  });

class DraweeBankProfile extends React.Component{
    constructor(props){
        super(props)
        this.state={
            draweeBankProfileView:'',
            draweeBankName:''
        }        
    }

    componentDidMount(){
    }

    render(){
        const { classes }=this.props;
        const { draweeBankProfileView }=this.props;
        return(
            
            <EnchancedTabContainer>
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Bank Name
                        </Typography>
                        <span className="drawee-profile-view" >
                            {draweeBankProfileView['bankName']}
                        </span>
                    </Grid>                   
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Service Provider
                        </Typography>
                        <span className="drawee-profile-view" >
                             {draweeBankProfileView['serviceProviderCode']}
                        </span>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Country
                        </Typography>
                        <span className="drawee-profile-view" >            
                            {draweeBankProfileView['country']}
                        </span>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Status
                        </Typography>
                        <span className="drawee-profile-view" >                 
                            {draweeBankProfileView['status']}
                        </span>
                    </Grid>
                </Grid>
            </div>  
            </EnchancedTabContainer>              
        )
    }
}

DraweeBankProfile.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(DraweeBankProfile);