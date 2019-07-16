import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../../component/EnchancedTableHead';
import { withRouter } from 'react-router';
import rows from './NationalityRestrictionHeader';
import Edit from '@material-ui/icons/Edit';
import {Badges} from 'finablr-ui';
import Tooltip from '@material-ui/core/Tooltip';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
        boxShadow: 'none',
    },
    table: {
        minWidth: 700,
    },
    btnEbl: {
        margin: '2% 2% 2% -20%',
        backgroundColor: '#418839',
        width: '70%',
        color: '#ffffff',
        boxShadow: 'none',
        textTransform: 'capitalize',

    },
    btnDbl: {
        margin: '2% 2% 2% -20%',
        backgroundColor: '#c03018',
        width: '70%',
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
    handleEditBank(bankcode, e) {
        e.stopPropagation();
        console.log(bankcode);
        this.props.editDraweeBankfn(bankcode);
    }

    handleViewDetail(id, row) {
        console.log(id, row)
        this.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeProductId}/nationalityrestrictionsview/profile/${id}`,
            state: {
                draweeId: this.props.props.draweeId
            }
        })
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
                                        onClick={() => this.handleViewDetail(row.id, row)}
                                    >
                                        <TableCell style={{ paddingLeft: 40 }}>{row.customerType}</TableCell>
                                        <TableCell>{row.beneficiaryType}</TableCell>
                                        <TableCell>
                                            {(row['country'] == null) ? '---' : row['country'].name}
                                        </TableCell>
                                        <TableCell>
                                            <Badges type="labelBadge" umClass={(row.status == 'ENABLED' ? 'table-button-enabled' : 'table-button-disabled')} value={row.status}></Badges>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit" placement="bottom">
                                                <Edit className="edit-button" onClick={(e) => this.handleEditBank(row, e)} />
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