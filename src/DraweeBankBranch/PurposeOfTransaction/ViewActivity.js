import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import getMuiTheme from "../../theme/theme";
import { MuiThemeProvider } from '@material-ui/core/styles';
import '../../vendor/common.css';
import { FloatButton } from 'finablr-ui';
import AuditingComponent from '../../component/AuditingComponent';

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    minHeight: `50%`,
    width: `78%`,
    transform: `translate(-50%, -50%)`,
    borderRadius: `5px`,
    overflowY: 'auto'
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    overflowY: 'scroll'
  },
  fab: {
    marginTop: 15,
    marginRight: 2,
    backgroundColor: "#000",
    boxShadow: `none`,
    width: 24,
    height: 24
  },
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  MuiFormControlLabel: {
    root: {
      marginLeft: 0,
      marginRight: 0,
    }
  },
  button: {
    margin: theme.spacing.unit,
    fontSize: 16
  },
  input: {
    display: 'none',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: 30,
    paddingRight: 30,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: `100%`,
  },
  dense: {
    marginTop: 19,
  },
});

class ViewActivityModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false }, () => {
      this.props.viewActivity(false);
    })
  }

  render() {
    const { classes, activityDetails } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
        >
          <div className="modal-card-y-scroll">
            <div style={getModalStyle()} className={classes.paper}>
              <div className="modal-card-header activity-header">
                <div className="modal-card-header-content">
                  <Grid container spacing={12}>
                    <Grid item xs={6}>
                      <h3 className="screenTitle" style={{ color: '#19ace3' }}>Activity</h3>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid direction="column" alignItems="flex-end" container spacing={12}>
                        <FloatButton style={{ height: 36, width: 36, backgroundColor: '#333333' }} umClass={classes.fab} icon="close" onClick={this.handleClose} />
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </div>
              <h3 style={{ fontSize: "20px" }} className="global-font activity-header title-margin">Purpose of Transaction</h3>
              <AuditingComponent createDate={activityDetails.createDate} createBy={activityDetails.createBy} modifiedBy={activityDetails.modifiedBy} modifiedDate={activityDetails.modifiedDate}/>
            </div>
          </div>
        </Modal>
      </MuiThemeProvider>
    )
  }
}

ViewActivityModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ViewActivityModalPopup = withStyles(styles)(ViewActivityModal);

export default ViewActivityModalPopup;