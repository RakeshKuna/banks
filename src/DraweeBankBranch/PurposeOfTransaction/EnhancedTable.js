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
import RegulerTextfield from '../../container/Textfield';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ToggleMenu from './../../container/ToggleMenu';
import { Badges } from 'finablr-ui';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    padding: '0',
    // marginTop:20,
    boxShadow: 'none',
  },
  table: {
    minWidth: 700,
  },
  button: {
    margin: theme.spacing.unit,
    width: '70%',

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
      AccountValidation: '',

    }
  }

  componentDidMount() {

  }

  handleViewDetail(id, e) {
    e.stopPropagation();
    // this.props.history.push({
    //     pathname:`/draweebranchprofilerules/${this.props.props.draweeProductId}/countryrestrictionsview/profile/${id}`,
    //     state:{draweeId:this.props.props.draweeId}
    // })
  }

  handleTextfieldChange = (event, type, index) => {
    switch (type) {
      case 'allowedMaxAmount':
        this.props.getChangedRoutingValue(event, index, type);
        break;
      case 'valuePassed':
        this.props.getChangedRoutingValue(event, index, type);
        break;
    }
  }

  handleCheck = (index, check, ruleId, e, type) => {
    console.log(index, check, ruleId, type);
    e.stopPropagation();
    this.props.handleRoutingValueCheck(index, check, ruleId, type);
  }

  handleToggleAction = (field, index) => {
    this.props.handleToggleAction(field, index);
  }

  handleBlurText = (value,type,index) => {
    switch (type) {
      case 'allowedMaxAmount':
          this.props.getBlurRoutingValue(value,type,index);
      break;
      case 'valuePassed':
          this.props.getBlurRoutingValue(value,type,index);
      break;
    }
  }

  render() {
    const { classes, theme1 } = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className='global-font' style={{ whiteSpace: `nowrap` }}>
            <EnhancedTableHead rows={this.props.rowsHdr} />
            <TableBody>
              {this.props.bankList && this.props.bankList['data'] && this.props.bankList['data'].map((row, index) => {
                return (
                  <TableRow key={row.id}
                    hover
                    onClick={(e) => this.handleViewDetail(row.id, e)}
                  >
                    <TableCell style={{ paddingLeft: 40 }}>{row.categoryName}</TableCell>
                    <TableCell>{row.purposeName}</TableCell>
                    <TableCell>{row.purposeCode}</TableCell>
                    <TableCell>
                      {((row.maxAmount == '' && row.maxAmountisEditClick == true) || ((row.maxAmount !== '') && (row.maxAmountisEditClick == true)) || ((row.maxAmount !== '') && (row.maxAmounteditClicked == true)) || ((row.maxAmount == '') && (row.maxAmounteditClicked == true)))
                        ?
                        <div className="edit-routing-bankbeneficiary">
                          <RegulerTextfield tableRowIndex={index} value={row.maxAmount} type='allowedMaxAmount' label={'Enter Amount'} getEnterText={this.handleTextfieldChange} getBlurEnterText={this.handleBlurText} placeholder="Enter Amount" />
                          {/* <CheckCircle onClick={(e) => { this.handleCheck(index, true, row.id, e, 'allowedMaxAmount') }} className="edit-routing-bankbeneficiary-check" /> */}
                        </div>
                        :
                        row.maxAmount}
                    </TableCell>
                    <TableCell>
                      {((row.valueToBePassed == '' && row.valueToBePassedisEditClick == true) || ((row.valueToBePassed !== '') && (row.valueToBePassedisEditClick == true)) || ((row.valueToBePassed !== '') && (row.valueToBePassededitClicked == true)) || ((row.valueToBePassed == '') && (row.valueToBePassededitClicked == true)))
                        ?
                        <div className="edit-routing-bankbeneficiary">
                          <RegulerTextfield tableRowIndex={index} value={row.valueToBePassed} type='valuePassed' label={'Enter Value'} getEnterText={this.handleTextfieldChange} getBlurEnterText={this.handleBlurText} placeholder="Enter value" />
                          {/* <CheckCircle onClick={(e) => { this.handleCheck(index, true, row.id, e, 'valuePassed') }} className="edit-routing-bankbeneficiary-check" /> */}
                        </div>
                        :
                        row.valueToBePassed}
                    </TableCell>
                    <TableCell>
                      <Badges type="labelBadge" umClass={(row.status == 'ENABLED' ? 'table-button-enabled' : 'table-button-disabled')} value={row.status}></Badges>
                    </TableCell>
                    <TableCell>
                      <ToggleMenu menuArray={[{ id: 1, label: 'Edit', field: 'edit' }, { id: 2, label: ((row.status == 'ENABLED') ? 'Disable' : 'Enable'), field: ((row.status == 'ENABLED') ? 'Disable' : 'Enable') }, { id: 3, label: 'View Activity', field: 'viewactivity' }]} isOpen={row.isMenuOpen} tableIndex={index} handleToggleAction={this.handleToggleAction} />
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