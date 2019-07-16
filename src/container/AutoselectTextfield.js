import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    height: 30,
    flexGrow: 1,
    marginBottom:'3%'
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight:200,
    overflowY:`scroll`,
    overflowX:`hidden`
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

class IntegrationAutosuggest extends React.Component {
  state = {
    single: '',
    suggestions: [],
    suggestedObj:{}
  };

  renderInputComponent = (inputProps) => {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input,
          },
        }}
        {...other}
      />
    );
  }

  handleSelectMenuItem = (e,data) =>{
    e.stopPropagation();
    this.setState({
      single: data.label,
      suggestedObj: data,
    },()=>{
      this.handleSubmitData(this.state.single,this.props.type,this.state.suggestedObj);
      this.handleSuggestionsClearRequested();
    });
  }
  
  renderSuggestion =(suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);
    return (
      <MenuItem onClick={(e) => this.handleSelectMenuItem(e,suggestion)} selected={isHighlighted} component="div">
        <div className="global-font">
          {parts.map((part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            ),
          )}
        </div>
      </MenuItem>
    );
  }
  
  getSuggestions = (value) => {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    return inputLength === 0
      ? []
      : this.props.suggestionFields.filter(suggestion => {
          const keep = 
             count < this.props.suggestionFields.length && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;       
          if (keep) {
            count += 1;
          }
          return keep;
        });
  }
  
  getSuggestionValue = (suggestion) => {
    this.setState({suggestedObj:suggestion})
    return suggestion.label;
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
      suggestedObj:{}
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.setState({
      single:newValue
    },()=>{
      this.handleSubmitData(newValue,this.props.type,this.state.suggestedObj);
    });
  };

  handleBlur = name => (event, { newValue }) => {
    this.props.getHandleBlurValue(this.props.value,this.props.type);
  };

  handleSubmitData = (data,type,obj) =>{
    this.props.getAutoSelectValue(data,type,obj);
  }

  render() {
    const { classes } = this.props;

    const autosuggestProps = {
      renderInputComponent:this.renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue:this.getSuggestionValue,
      renderSuggestion:this.renderSuggestion,
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            label: this.props.label,
            disabled:this.props.disabled,
            placeholder: this.props.placeholder,
            value: this.props.value,
            onChange: this.handleChange('single'),
            onBlur: this.handleBlur('single')
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);