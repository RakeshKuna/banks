import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import '../vendor/common.css';
import green from '@material-ui/core/colors/green';
import Loader from '../component/Loader';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import { CheckBox, Notifications, TextButton } from 'finablr-ui';
import { SHOW_NOTIFICATION } from '../constants/action-types';
import { HIDE_NOTIFICATION } from '../constants/action-types';
import * as config from './../config/config';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    // border:'0.5px solid grey',
  },

  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    overflow: `scroll`
  },
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: `100%`,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: `100%`,
  },
  dense: {
    marginTop: 19,
  },
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    // borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: 'bold',
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: 'black',
      opacity: 1,
    },
    '&$tabSelected': {
      color: 'white',
      fontWeight: 'bold',
    },
    '&:focus': {
      color: 'white',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  bootstrapRoot: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
  button: {
    margin: `25px 0px 0px 8px`,
    padding: `5px 8px 2px 8px`
  },
  input: {
    display: 'none',
  },
});


const theme = createMuiTheme({
  palette: {
    primary: green,
  },
  typography: {
    useNextVariants: true,
  },
});

class DraweeBankFieldValidations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fieldValidations: [],
      loading: true,
      snackbar: false,
      snackbarMessage: '',
      notificationType: 'success',
      loaderMessage: 'Retrieving Data'
    }
  }

  static dirtyFlag = false;

  static getDirtyFlag = () => {
    return DraweeBankFieldValidations.dirtyFlag;
  }

  static setDirtyFlag = (flag) => {
    DraweeBankFieldValidations.dirtyFlag = flag;
  }

  componentDidMount() {
    this.props.handleCompValueChange(false);
    this.fetchFieldValidations();
  }

  fetchFieldValidations = () => {
    if(sessionStorage.getItem('token') == undefined){
      window.location.replace(config.PAAS_LOGIN_URL);
      return (<h1>401 - Unauthorized Request</h1>)
    }
    else{
      let headers = {
        Authorization:sessionStorage.getItem('token')
      }
      // this.setState({snackbar:false});
      DraweeeBankBranchApiService.getfiledvalidationrules(this.props.draweeBankBranchProfileView.branchId,headers)
        .then(response => {
          let fieldValidations = [];
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let section = {};
              section.categories = [];
              section.displayName = response.data[i].displayName;
              for (let j = 0; j < response.data[i].categories.length; j++) {
                let sectionType = {};
                sectionType.displayName = response.data[i].categories[j].displayName;
                sectionType.enabled = true;
                sectionType.fieldValidations = [];
                for (let k = 0; k < response.data[i].categories[j].fieldValidations.length; k++) {
                  let field = {};
                  field.key = response.data[i].categories[j].fieldValidations[k].key;
                  field.displayName = response.data[i].categories[j].fieldValidations[k].displayName;
                  field.value = (response.data[i].categories[j].fieldValidations[k].status == 'DISABLED') ? false : true;
                  field.disabled = false;
                  sectionType.fieldValidations.push(field);
                }
                section.categories.push(sectionType);
              }
              fieldValidations.push(section);
            }
            this.setState({ fieldValidations: fieldValidations, loading: false }, () => {
              console.log(this.state.fieldValidations);
            });
          }
        })
        .catch(error => {
          this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: 'OOPS! Error in api request' });
        });
    }
  }

  //Toggle Button Changes
  handleToggleChange = (event, type, categoryName, categoryType) => {
    this.state.fieldValidations.filter((obj, index) => {
      if (obj.displayName == categoryName) {
        let objIndex = index;
        obj.categories.filter((category, index) => {
          if (category.displayName == categoryType) {
            let categoryIndex = index;
            let categoryDisabled = [];
            category.fieldValidations.filter((field) => {
              var newField = {}
              newField.value = false;
              newField.disabled = (event == true) ? false : true;
              newField.key = field.key;
              newField.displayName = field.displayName;
              categoryDisabled.push(newField);
            })
            var fieldValidations = this.state.fieldValidations;
            fieldValidations[objIndex].categories[categoryIndex].enabled = event;
            fieldValidations[objIndex].categories[categoryIndex].fieldValidations = categoryDisabled;
            this.setState({ fieldValidations });
          }
        })
      }
    })
  };

  //Beneficiary Fields Validations
  handleCheckedChange = (event, isChecked, categoryName, categoryType) => {
    console.log(event.target.id, isChecked);
    console.log(categoryName, categoryType)
    this.props.handleCompValueChange(true);
    this.state.fieldValidations.filter((obj, index) => {
      if (obj.displayName == categoryName) {
        let objIndex = index;
        obj.categories.filter((category, index) => {
          if (category.displayName == categoryType) {
            let categoryIndex = index;
            category.fieldValidations.filter((field, index) => {
              if (field.key == event.target.id) {
                let fieldIndex = index;
                var fieldValidations = this.state.fieldValidations;
                fieldValidations[objIndex].categories[categoryIndex].fieldValidations[fieldIndex].value = isChecked;
                this.setState({ fieldValidations });
              }
            })
          }
        })
      }
    })
  };

  handleSave = () => {
    this.props.handleCompValueChange(false);
    let fieldValidations = this.state.fieldValidations;
    let finalData = []
    this.setState({ loading: true, loaderMessage: 'Posting data', snackbar:false });
    if (fieldValidations.length > 0) {
      for (let i = 0; i < fieldValidations.length; i++) {
        let section = {};
        section.categories = [];
        section.displayName = fieldValidations[i].displayName;
        for (let j = 0; j < fieldValidations[i].categories.length; j++) {
          let sectionType = {};
          sectionType.displayName = fieldValidations[i].categories[j].displayName;
          sectionType.fieldValidations = [];
          for (let k = 0; k < fieldValidations[i].categories[j].fieldValidations.length; k++) {
            let field = {};
            field.key = fieldValidations[i].categories[j].fieldValidations[k].key;
            field.displayName = fieldValidations[i].categories[j].fieldValidations[k].displayName;
            field.status = (fieldValidations[i].categories[j].fieldValidations[k].value == false) ? 'DISABLED' : 'ENABLED';
            sectionType.fieldValidations.push(field);
          }
          section.categories.push(sectionType);
        }
        finalData.push(section);
      }
      this.setState({ snackbar: false, snackbarMessage: '' }, () => {
      let finalApiData = {
        "categoriesValueObjectList": finalData,
        "ruleType": "FIELD_VALIDATIONS"
      }
      if(sessionStorage.getItem('token') == undefined){
        window.location.replace(config.PAAS_LOGIN_URL);
        return (<h1>401 - Unauthorized Request</h1>)
      }
      else{
        let headers = {
          Authorization:sessionStorage.getItem('token')
        }
        DraweeeBankBranchApiService.postvalidationrules(finalApiData, this.props.draweeBankBranchProfileView.branchId,headers)
          .then((response) => {
            this.setState({ loading: false, snackbar: true, notificationType: 'success', snackbarMessage: 'Rules saved successfully' }, () => {
              if (response.status == 200) {
                this.fetchFieldValidations();
              }
            })
          })
          .catch((error) => {
            this.setState({ loading: false, snackbar: true, notificationType: 'error', snackbarMessage: 'OOPS! Error in api request' });
            throw error;
          })
      }
    })
    }
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <TabContainer>
        {
          this.state.loading ?
            <Loader action={this.state.loaderMessage} />
            :

            <MuiThemeProvider theme={getMuiTheme}>
              <h1 style={{fontSize:"22px"}} className="global-font">Field Validations</h1>
              <div className="field-validation-block global-font">
                {
                  this.state.fieldValidations.map((obj) => {
                    return (
                      <div>
                        <h2 style={{fontSize:"20px"}}>{obj.displayName}</h2>
                        {
                          obj.categories.map((category) => {
                            return (
                              <div>
                                <h3 style={{fontSize:"16px"}}>{category.displayName}</h3>
                                <div className="Benificiary-info">
                                  <Grid container justify="space-between" spacing={24}>
                                    {
                                      category.fieldValidations.map((field) => {
                                        return (
                                          <Grid item xs={4} style={{ padding: 0 }} classes={classes.grid}>
                                            <div className="inline-alignment">
                                              <CheckBox id={field.key} isChecked={field.value} onChange={(e, f) => this.handleCheckedChange(e, f, `${obj.displayName}`, `${category.displayName}`)} />
                                            </div>
                                            <p className="inline-alignment">{field.displayName}</p>
                                          </Grid>
                                        )
                                      })
                                    }
                                  </Grid>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
              <Grid container direction="row"
                justify="flex-end"
                alignItems="flex-end">
                <TextButton style={{ color: "#19ace3", fontWeight: '500', fontSize: 17, margin: "15px 15px 30px 15px",fontFamily:"Gotham-Rounded" }} onClick={this.handleSave} >Save</TextButton>
              </Grid>
              {
                this.state.snackbar ?
                  <Notifications
                    id="notificationBar"
                    umStyle={this.state.notificationType}
                    placement="bottom-right"
                    children={this.state.snackbarMessage}
                    delayShow={SHOW_NOTIFICATION}
                    delayHide={HIDE_NOTIFICATION}
                    style={{ width: 'auto' }}
                  /> : null
              }
            </MuiThemeProvider>
        }
      </TabContainer>
    )
  }
}

export default withStyles(styles)(DraweeBankFieldValidations);