import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../component/EnchancedTableHead';
import viewDetails from '../Banks/BankViewAction';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import rows from './BranchTableHeaderView';
import axios from 'axios';
import EnhancedTableHeadView from './EnhancedTableHeadView';


const drawerWidth = 240;
const styles = theme => ({
    root: {
      width: '100%',
      overflowX: 'auto',
      textAlign:'center',
    },
    table: {
      minWidth: 700,
    //   textAlign:'center',
    },
    button: {
        margin: theme.spacing.unit,
      },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 73,
      },
    contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 240,
      },
  });

class BranchEnhancedTableView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data:rows,
            branchId:'',
            TableData:'',
            TableDataLen:'',
        }
    }
   
    render(){
        const {classes,theme1}=this.props;
        const { open } = this.props;
        return(
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className='global-font' style={{whiteSpace:`nowrap`}}>
                        <EnhancedTableHeadView rows={this.state.data}/>
                        <TableBody>
                        {this.props.TableData && this.props.TableData['data'].map((row) => {
                                        return(
                                            <TableRow key={row}>
                                                <TableCell style={{textAlign:'center',fontSize:"14px"}}>{row.identificationType}</TableCell>
                                                <TableCell style={{textAlign:'center',fontSize:"14px"}}>{row.identificationCode}</TableCell>
                                            </TableRow>
                                             )
                                    })}
                    </TableBody>
                    </Table>                    
                </div>
            </Paper>
        )
    }
}

BranchEnhancedTableView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(BranchEnhancedTableView));