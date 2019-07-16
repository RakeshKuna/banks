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
import rows from './BranchListTableHeader';
import { Badges } from 'finablr-ui';

const drawerWidth = 240;
const styles = theme => ({
    root: {
      width: '100%',
      overflowX: 'auto',
      boxShadow:'none',
    },
    table: {
      minWidth: 700,
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
 
  const mapDispatchtoProps=dispatch=>{
      return{
        viewDetails:(viewData)=>dispatch(viewDetails(viewData))
      };
  };

class EnhancedTablec extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data:rows,
            fromPage:''
        }
    }

    handleViewDetail(id){   
        this.props.history.push({
            pathname: '/bankbranchprofiledetailsview/'+id,
            // search:'?id='+id,
            state: { bankBranchId: id }
        }) 
    }

    render(){
        const {classes,theme1}=this.props;
        const { open } = this.props;
        return(
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className='global-font' style={{whiteSpace:`nowrap`}}>
                        <EnhancedTableHead rows={this.state.data} />
                        <TableBody>
                            {this.props.bankList && this.props.bankList['data'] && this.props.bankList['data'].map(row=>{
                                return(
                                <TableRow key={row.branchId}
                                hover
                                onClick={() => this.handleViewDetail(row.branchId)}
                                >
                                    <TableCell style={{paddingLeft:40}}>{row.branchCode}</TableCell>
                                    <TableCell>{row.branchName}</TableCell>
                                    <TableCell>{row.city}</TableCell>
                                    <TableCell>{row.country}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell>
                                        <Badges type="labelBadge" umClass={(row.status == 'ENABLED' ? 'table-button-enabled' : 'table-button-disabled')} value={row.status}></Badges>
                                    </TableCell>
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

EnhancedTablec.propTypes = {
    classes: PropTypes.object.isRequired,
};

const EnhancedTable =connect(null,mapDispatchtoProps)(EnhancedTablec);
export default withRouter(withStyles(styles)(EnhancedTable));