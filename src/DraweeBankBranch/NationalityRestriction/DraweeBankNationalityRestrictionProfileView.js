import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EnchancedTabContainer from '../../container/TabContainer';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },  
  title: {
      fontSize: 14,
      fontFamily:"Gotham-Rounded"
    }, 
});
let data={};

class DraweeBankNationalityRestrictionProfileView extends React.Component{

  constructor(props){
    super(props)
    console.log(props.data);
    data=props.data;
    }

  render(){
    const { classes }=this.props;
    
    return(
        
        <EnchancedTabContainer >
        <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Customer Type
                        </Typography>
                        <span className="drawee-profile-view" >            
                            {this.props.data.customerType}
                        </span>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                         Beneficiary Type
                        </Typography>
                        <span className="drawee-profile-view" >            
                           {this.props.data.beneficiaryType}
                        </span>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Country
                        </Typography>
                        <span className="drawee-profile-view" >            
                           {/* {this.props.data.country} */}
                           {(this.props.data['country'] !== null)? this.props.data['country'].name : '---'}       
                        </span>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Status
                        </Typography>
                        <span className="drawee-profile-view" >            
                           {this.props.data.status}
                        </span>
                    </Grid>
                </Grid>
            </div>  
        </EnchancedTabContainer>
    )
  }
}

export default withStyles(styles)(DraweeBankNationalityRestrictionProfileView);
