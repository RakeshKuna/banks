import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../component/EnchancedTableHead';
import { Badges } from 'finablr-ui';
import { withRouter } from 'react-router';
import rows from '../component/DraweeBankBranchTableHeader';
import Edit from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        width: '100%',
        //   marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        boxShadow: 'none',
    },
    table: {
        minWidth: 700,
    },
    btnEbl: {
        margin: '2% 2% 2% -20%',
        backgroundColor: '#418839',
        color: '#ffffff',
        boxShadow: 'none',
        textTransform: 'capitalize',

    },
    btnDbl: {
        margin: '2% 2% 2% -20%',
        backgroundColor: '#c03018',
        color: '#ffffff',
        boxShadow: 'none',
        textTransform: 'capitalize',

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
    edit: {
        marginLeft: '-50%',
    }
});

class EnhancedTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: rows,
            fromPage: '',
            editButton: false
        }
    }

    handleEdit = (e, id) => {
        e.stopPropagation();
        this.setState({ editButton: true }, () => {
            this.props.getEditTbl(this.state.editButton, id)
        })
    }

    handleViewDetail(id) {
        let id2 = this.props.draweeBank.id;
        let tabId = 0;
        this.props.history.push(`/draweebranchprofilerules/${id2}/products/profile/${id}?tabId=${tabId}`)
    }

    render() {
        const { classes, theme1 } = this.props;
        const { open, editBtn } = this.props;
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className='global-font' style={{ whiteSpace: `nowrap` }}>
                        <EnhancedTableHead rows={this.state.data} />
                        <TableBody>
                            {this.props.bankList && this.props.bankList['data'] && this.props.bankList['data'].map(row => {
                                return (
                                    <TableRow key={row.id} className="table-row"
                                        hover
                                        onClick={() => this.handleViewDetail(row.id)}
                                    >
                                        <TableCell style={{ paddingLeft: 40 }}>{row.displayName ? row.displayName : '--'}</TableCell>
                                        <TableCell>{row.productSubType ? row.productSubType : '--'}</TableCell>
                                        <TableCell>{row.serviceType ? row.serviceType : '--'}</TableCell>
                                        <TableCell>{row.currencyCode ? row.currencyCode : '--'}</TableCell>
                                        <TableCell>{row.swiftCode}</TableCell>
                                        <TableCell>{row.accountNumber}</TableCell>
                                        <TableCell>
                                            <Badges type="labelBadge" umClass={(row.status == 'ENABLED' ? 'table-button-enabled' : 'table-button-disabled')} value={row.status}></Badges>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit" placement="bottom">
                                                <Edit className={classes.edit} onClick={(e) => this.handleEdit(e, row.id)} />
                                            </Tooltip>        
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

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(EnhancedTable));