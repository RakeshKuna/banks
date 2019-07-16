import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../component/EnchancedTableHead';
import { withRouter } from 'react-router';


const drawerWidth = 240;
const styles = theme => ({
    root: {
      width: '100%',
      overflowX: 'auto',
      padding:'0',
    //   marginTop:20,
    },
    // table: {
    //   minWidth: 700,
    // },
    button: {
        margin: theme.spacing.unit,
        width: '70%',
        boxShadow:'none',
        textTransform:'capitalize',
        marginLeft:0
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

class AccountVaildationviewTable extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
      console.log(this.props);
    }
    
    render(){
        const {classes,theme1}=this.props;
        return(
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className='global-font' style={{whiteSpace:`nowrap`}}>
                        <EnhancedTableHead rows={this.props.rowsHdr} />
                        <TableBody>
                            {this.props.accountNumberLengths && this.props.accountNumberLengths.map(row=>{
                              return(
                                <TableRow >
                                    <TableCell style={{paddingLeft:40,fontSize:"14px"}}>{row.minimumLength}</TableCell>
                                    <TableCell style={{fontSize:"14px"}}>{row.maximumLength}</TableCell>
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

AccountVaildationviewTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AccountVaildationviewTable));