import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../component/EnchancedTableHead';
import Button from '@material-ui/core/Button';
import viewDetails from './BankViewAction';
import branchList from '../Branches/BranchesAction';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Badges } from 'finablr-ui';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        width: '100%',
        //   marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        padding: '0',
        boxShadow: 'none',
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: theme.spacing.unit,
        backgroundColor: 'rgb(241,245,248)',
        width: '70%',
        color: 'black',
        boxShadow: 'none',
        textTransform: 'capitalize'

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

const matchDispatchtoProps = dispatch => {
    return {
        viewDetails: (bankid) => dispatch(viewDetails(bankid)),
        branchList: (bankid) => dispatch(branchList(bankid)),
    };
};

class EnhancedTablec extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        console.log(this.props);
    }

    handleViewDetail(id) {
        this.props.history.push({
            pathname: '/bankprofiledetails/' + id,
            state: { bankProfileId: id }
        })
    }

    render() {
        const { classes, theme1 } = this.props;
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className='global-font' style={{ whiteSpace: `nowrap` }}>
                        <EnhancedTableHead rows={this.props.rowsHdr} />
                        <TableBody>
                            {this.props.bankList && this.props.bankList['data'] && this.props.bankList['data'].map(row => {
                                return (
                                    <TableRow key={row.bankId}
                                        hover
                                        onClick={() => this.handleViewDetail(row.bankId)}
                                    >
                                        <TableCell style={{ paddingLeft: 40 }}>{row.bankCode}</TableCell>
                                        <TableCell>{row.bankName}</TableCell>
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

const EnhancedTable = connect(null, matchDispatchtoProps)(EnhancedTablec);
export default withRouter(withStyles(styles)(EnhancedTable));