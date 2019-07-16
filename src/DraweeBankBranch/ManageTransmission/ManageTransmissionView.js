import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../../component/Loader';
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
    height: `4px`
  },
  appbar: {
    boxShadow: 'none'
  },
  tabs: {
    backgroundColor: '#19ace3',
    color: '#fff'
  },
  title: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded'
  },
  testColor: {
    color: 'blue !important'
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class ManageTransmissionView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      loaderMessage: 'Retrieving Data',
      serverStatus: null,
      serverError: false,
      serverErrMessage: '',
      ManageTransmissionProfile: {},
      breadcrumps: []
    };
  }

  componentDidMount() {
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
                Transmission Time
                                    </Typography>
              <span className="drawee-profile-view" >
                {/* {this.props.ManageTransmissionProfile['time']} */}
                {(this.props.ManageTransmissionProfile['time'] !== null) ? this.props.ManageTransmissionProfile['time'] : 'ALL'}
              </span>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Transaction Type
                                    </Typography>
              <span className="drawee-profile-view" >
                {this.props.ManageTransmissionProfile['transactionType']}
              </span>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Source Country
                                    </Typography>
              <span className="drawee-profile-view" >
                {(this.props.ManageTransmissionProfile['country'] !== null) ? this.props.ManageTransmissionProfile['country'].name : 'ALL'}
              </span>
            </Grid>

            <Grid item xs={4}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Agent/Partner
                                    </Typography>
              <span className="drawee-profile-view" >
                {(this.props.ManageTransmissionProfile['agent'] !== null) ? this.props.ManageTransmissionProfile['agent'] : 'ALL'}
              </span>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Status
                                    </Typography>
                                    <span className="drawee-profile-view" >            
                                    {this.props.ManageTransmissionProfile['status']}
                                    </span>
                                </Grid>
                                </Grid>

                                <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <div className="country-restriction-agentbranches-section">
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        Exclude Days
                                        </Typography>
                                    </div>
                                    {
                                    (this.props.ManageTransmissionProfile['weekDays'].length > 0) ? 
                                <div>
                                    <Grid container spacing={24}>
                                        {
                                            this.props.ManageTransmissionProfile['weekDays'].map((obj)=>{
                                                return (
                                                    <Grid item xs={4}>
                                                        <span className="drawee-profile-view" >
                                                            {obj}
                                                        </span>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid></div>
                                :'ALL'
                                }
                                </Grid>
                                </Grid>
                                
                                <Grid container spacing={24}>
                                <Grid item xs={12}>
                                <div className="">
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Agent/Partner Branches
                                    </Typography>
                                </div>
                                <span className="drawee-profile-view">
                                {
                                    (this.props.ManageTransmissionProfile['agentBranches'].length > 0) ? 
                                    <div>
                                    <Grid container spacing={24}>
                                        {
                                            this.props.ManageTransmissionProfile['agentBranches'].map((obj)=>{
                                                return (
                                                    <Grid item xs={4}>
                                                        <span className="drawee-profile-view" >
                                                            {obj.branchName}
                                                        </span>
                                                    </Grid>
                                        )
                                        })
                                    }
                                </Grid></div>
                                :'ALL'
                                } 
                                </span>
                                </Grid>
                                </Grid>
                                
        </div>
      </TabContainer>
    );
  }
}

ManageTransmissionView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageTransmissionView);
