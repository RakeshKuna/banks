import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import {MuiThemeProvider} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

import getMuiTheme from "../theme/theme";
const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      width:'100%',
      marginTop:`-17px`,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
});

class NativeSelects extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      labelWidth: 0,
    };
  }
  
  componentDidMount() {
    this.setState({value:this.props.value})
  }

  handleChange = name => event => {
    this.setState({ value: event.target.value });
    this.props.getSelectText(event.target.value,this.props.fromPage,this.props.type);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={getMuiTheme}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel className="selectLabel"
              htmlFor="outlined-age-native-simple"
            >  
            </InputLabel>
            <NativeSelect
              className={classes.selectEmpty}
              value={this.props.value}
              onChange={this.handleChange('value')}
              input={
                <OutlinedInput
                  id="outlined-age-native-simple"
                />
              }
            >
            { ((this.props.fromPage == 'draweebanks'||this.props.fromPage == 'draweebanksbranch' ||this.props.fromPage == 'nationalityrestriction' ) || (this.props.fromPage == 'CountryRestriction')
            || (this.props.fromPage == 'individualbankbranches')
            || (this.props.fromPage == 'ManageTransmission') || (this.props.fromPage == 'BeneficiaryBank') || (this.props.fromPage == 'BankListSelect') || (this.props.fromPage == 'BranchListSelect') || (this.props.fromPage == 'Purpose') || (this.props.fromPage == 'SourceOfFunds'))
            || (this.props.fromPage == 'AccountValidation') || (this.props.fromPage == "DraweeBank4RateSelect") || (this.props.fromPage == "AgentDraweeBank4RateSelect") ? 
            <option value=''>
              Select
            </option>: null }
            {
              this.props.selectLabels.map((obj)=>{
                return(
                  <option key={obj.id} value={obj.value}>{obj.label}</option>
                )
              })
            }
            </NativeSelect>
          </FormControl>
        </MuiThemeProvider>
      </div>
    )
  }
}

NativeSelects.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NativeSelects);