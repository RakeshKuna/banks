import React, { Component } from 'react';
import PrimaryAppBar from '../common/Header';
import PersistentDrawerLeft from '../common/Sidebar';
import { MuiThemeProvider,createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ErrorBoundary from './ExceptionErrorHandling';

const drawerWidth = 240;
const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
    button: {
        margin: theme.spacing.unit,
      },
    content: {
        flexGrow: 1,
        padding: '15px 24px',
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 73,
        // overflow : '-webkit-paged-x'
      },
    contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 270,
      },
  });

  const LayoutTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#fff', 
        light:'#16ace3'     
      },
      secondary: {      
        main: '#19ace3',     
        contrastText: '#fff',
      },
      error: {
         main:'#0044ff',      
      },
    },
    CommonLayout:{
      content:{
        marginTop:60
      }
    }
  });
 
class CommonLayout extends Component {
  constructor(props){
    console.log(props);
    super(props)
    this.state = {
        open:true        
    }
  }

  componentDidMount(){
    console.log(this.props);
  }

  sbar(val){
    this.setState({open:val})
  }

  render() {    
    const { open } = this.state;
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={LayoutTheme}>
          <div className="App">
            <PrimaryAppBar {...this.state}  sbar={this.sbar.bind(this)}/>         
            <PersistentDrawerLeft {...this.state} {...this.props}/> 
            <main
              className={classNames(classes.content,'main-content', {
              [classes.contentShift]: open,
              })}
              >              
                {this.props.children}              
            </main>
          </div>
      </MuiThemeProvider>
    );
  }
}

CommonLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommonLayout);