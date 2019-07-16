import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Tabs, Tab } from 'finablr-ui';

const styles = theme => ({
  root: {
    flexGrow: 1,
    border: '1px solid lightgrey',
    backgroundColor: '#fff',
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
      draweeBankView: ''
    };
  }


  draweeBankViewFn = (draweeBankName) => {
    this.setState({ draweeBankView: draweeBankName })
  }

  handleChange = (event, valt) => {
    this.setState({ value: valt }, () => {
      this.props.getTabVal(this.state.value)
    });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appbar}>
          <Tabs value={value} umStyle="primary" onChange={this.handleChange}>
            <Tab style={{ fontSize: "17px", maxWidth: "400px", fontFamily: "Gotham-Rounded" }} label={this.props.draweeLabel} />
            <Tab style={{ fontSize: "17px", maxWidth: "400px", fontFamily: "Gotham-Rounded" }} label="ACTIVITY" />
          </Tabs>
        </AppBar>
        {this.props.children}
      </div>
    );
  }
}

EnchancedTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnchancedTabs);
