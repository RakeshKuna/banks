import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../../component/EnchancedTableHead';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import Edit from '@material-ui/icons/Edit';
import { Badges } from 'finablr-ui';
import Tooltip from '@material-ui/core/Tooltip';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
        padding: '0',
        //   marginTop:20,
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: theme.spacing.unit,
        width: '70%',
        boxShadow: 'none',
        textTransform: 'capitalize',
        marginLeft: 0
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

class EnhancedTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        console.log(this.props);
    }

    handleViewDetail(id, e) {
        e.stopPropagation();
        this.props.history.push({
            pathname: `/draweebranchprofilerules/${this.props.props.draweeProductId}/countryrestrictionsview/profile/${id}`,
            state: { draweeId: this.props.props.draweeId }
        })
    }

    handleEditBank(bankcode, e, agentId) {
        e.stopPropagation();
        this.props.editDraweeCountryRestrictionfn(bankcode, agentId);
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
                                    <TableRow key={row.id} className="table-row"
                                        hover
                                        onClick={(e) => this.handleViewDetail(row.id, e)}
                                    >
                                        <TableCell style={{ paddingLeft: 40 }}>{row.customerType}</TableCell>
                                        <TableCell>{row.beneficiaryType}</TableCell>
                                        <TableCell>{(row['country'] == null) ? 'All' : row['country'].name}</TableCell>
                                        <TableCell>{(row.agent == null ? 'All' : (row.agent))}</TableCell>
                                        <TableCell>{(row.agentBranches.length > 0) ? [(row.agentBranches.length == 1) ? (row.agentBranches[0].branchName) : (row.agentBranches[0].branchName + ', ...')] : 'All'}</TableCell>
                                        <TableCell>{(row['destinationCountry'] == null) ? '---' : row['destinationCountry'].name}</TableCell>
                                        <TableCell>
                                            <Badges type="labelBadge" umClass={(row.status == 'ENABLED' ? 'table-button-enabled' : 'table-button-disabled')} value={row.status}></Badges>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit" placement="bottom">
                                                <Edit className="edit-button" onClick={(e) => this.handleEditBank(row.id, e, row.agentId)} />
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