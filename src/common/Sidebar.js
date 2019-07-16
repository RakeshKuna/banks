import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBalance from "@material-ui/icons/AccountBalance";
import { Link } from "react-router-dom";
import getMuiTheme from "../theme/theme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Work from "@material-ui/icons/Work";
import Contacts from "@material-ui/icons/Contacts";
import LocationCity from "@material-ui/icons/LocationCity";
import HowToReg from "@material-ui/icons/HowToReg";
import Settings from "@material-ui/icons/Settings";
import Tooltip from "@material-ui/core/Tooltip";

//import '../vendor/layout.css';
const drawerWidth = 270;

const styles = theme => ({
  root: {
    display: "flex",
  },
  icon: {
    color: `white`,
  },
  textcolor: {
    color: `${getMuiTheme.palette.primary.light} !important`,
  },
  selected: {
    backgroundColor: `#19ace3 !important`,
    color: `${getMuiTheme.palette.primary.light} !important`,
    fontWeight: 600,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    top: 64,
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: getMuiTheme.palette.primary.main,
  },
  drawerClose: {
    top: 64,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: 56,
    },
    backgroundColor: getMuiTheme.palette.primary.main,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  listItemText: {
    fontSize: ".8em",
    color: getMuiTheme.palette.primary.links,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 3,
  },
});

const sidebarLinks = [
  {
    link: "/banklist",
    text: "Bank Profiles",
    sublinks: [],
    icon: "AccountBalance",
  },
  {
    link: "/branches",
    text: "Bank Branch Profiles",
    sublinks: [],
    icon: "LocationCity",
  },
  {
    link: "/draweebanklist",
    text: "Drawee Banks",
    sublinks: [],
    icon: "Work",
  },
  // {
  // link:'/accountvalidation',
  // text:'Account Validation',
  // sublinks:[]
  // },
  {
    link: "#",
    text: "Global Rule Settings",
    sublinks: [
      {
        id: 101,
        link: "/accountvalidation",
        text: "Account Number Validation",
        icon: "HowToReg",
      },
    ],
    icon: "Settings",
  },
];

class PersistentDrawerLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      openGeneralSettings: false,
    };
  }

  componentDidMount() {
    if (
      (this.props.props.location.pathname.includes("banklist") &&
        !this.props.props.location.pathname.includes("draweebanklist")) ||
      this.props.props.location.pathname.includes("bankprofiledetails")
    ) {
      this.setState({ selectedIndex: 0 });
    } else if (
      this.props.props.location.pathname.includes(
        "bankbranchprofiledetailsview",
      ) ||
      this.props.props.location.pathname.includes("branches")
    ) {
      this.setState({ selectedIndex: 1 });
    } else if (
      this.props.props.location.pathname.includes("draweebanklist") ||
      this.props.props.location.pathname.includes("draweebranchprofilerules") ||
      this.props.props.location.pathname.includes("draweeBankProfile")
    ) {
      this.setState({ selectedIndex: 2 });
    } else {
      this.setState({ selectedIndex: 101, openGeneralSettings: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.props.location.pathname.includes("banklist") &&
        !nextProps.props.location.pathname.includes("draweebanklist")) ||
      nextProps.props.location.pathname.includes("bankprofiledetails")
    ) {
      this.setState({ selectedIndex: 0 });
    } else if (
      nextProps.props.location.pathname.includes(
        "bankbranchprofiledetailsview",
      ) ||
      nextProps.props.location.pathname.includes("branches")
    ) {
      this.setState({ selectedIndex: 1 });
    } else if (
      nextProps.props.location.pathname.includes("draweebanklist") ||
      nextProps.props.location.pathname.includes("draweebranchprofilerules") ||
      nextProps.props.location.pathname.includes("draweeBankProfile")
    ) {
      this.setState({ selectedIndex: 2 });
    } else {
      this.setState({ selectedIndex: 101, openGeneralSettings: true });
    }
  }

  handleListItemClick = (event, index, obj) => {
    sessionStorage.setItem("selectedIndexs", index);
    this.setState({ selectedIndex: index });
    if (obj.hasOwnProperty("sublinks")) {
      if (obj.sublinks.length > 0) {
        this.setState(state => ({
          openGeneralSettings: !state.openGeneralSettings,
        }));
      } else {
        this.setState(state => ({ openGeneralSettings: false }));
      }
    }
  };

  renderIcon = icon => {
    switch (icon) {
      case "AccountBalance":
        return <AccountBalance />;
        break;
      case "Work":
        return <Work />;
        break;
      case "HowToReg":
        return <HowToReg />;
        break;
      case "Settings":
        return <Settings />;
        break;
      case "LocationCity":
        return <LocationCity />;
        break;
      case "Contacts":
        return <Contacts />;
        break;
    }
  };

  render() {
    const { classes, theme } = this.props;
    const { open } = this.props;
    return (
      <MuiThemeProvider theme={getMuiTheme}>
        <div className={classes.root}>
          <CssBaseline />
          <Drawer
            variant="permanent"
            className={classNames(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: classNames({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
            open={open}
          >
            <Divider />
            <List>
              {sidebarLinks.map((obj, index) => (
                <Link style={{ textDecoration: "none" }} to={obj.link}>
                    <ListItem
                      button
                      key={index}
                      selected={this.state.selectedIndex === index}
                      onClick={event =>
                        this.handleListItemClick(event, index, obj)
                      }
                      primary={obj.text}
                      classes={{ selected: classes.selected }}
                    >
                    <Tooltip title={obj.text} placement="top">
                      <ListItemIcon className={classes.icon}>
                        {this.renderIcon(obj.icon)}
                      </ListItemIcon>
                    </Tooltip>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            type="body2"
                            style={{
                              color: "#FFFFFF",
                              fontFamily: "Gotham-Rounded",
                            }}
                          >
                            {obj.text}
                          </Typography>
                        }
                        classes={{ primary: classes.listItemText }}
                      />

                      {obj.sublinks.length > 0
                        ? [
                            this.state.openGeneralSettings ? (
                              <ExpandLess className={classes.icon} />
                            ) : (
                              <ExpandMore className={classes.icon} />
                            ),
                          ]
                        : null}
                    </ListItem>
                    <Divider />
                  
                  {obj.sublinks.length > 0
                    ? [
                        obj.sublinks.map((sublink, index) => {
                          return (
                            <Link
                              style={{ textDecoration: "none" }}
                              to={sublink.link}
                            >
                              <Collapse
                                in={this.state.openGeneralSettings}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                    <ListItem
                                      button
                                      className={classes.nested}
                                      key={sublink.id}
                                      selected={
                                        this.state.selectedIndex === sublink.id
                                      }
                                      onClick={event =>
                                        this.handleListItemClick(
                                          event,
                                          sublink.id,
                                          sublink,
                                        )
                                      }
                                      primary={sublink.text}
                                      classes={{ selected: classes.selected }}
                                    >
                                      <Tooltip title={sublink.text} placement="top">
                                        <ListItemIcon className={classes.icon}>
                                          {this.renderIcon(sublink.icon)}
                                        </ListItemIcon>
                                      </Tooltip>
                                      <ListItemText
                                        disableTypography
                                        primary={
                                          <Typography
                                            type="body2"
                                            style={{
                                              color: "#FFFFFF",
                                              fontFamily: "Gotham-Rounded",
                                            }}
                                          >
                                            {sublink.text}
                                          </Typography>
                                        }
                                        classes={{
                                          primary: classes.listItemText,
                                        }}
                                      />
                                    </ListItem>
                                    <Divider />
                                </List>
                              </Collapse>
                            </Link>
                          );
                        }),
                      ]
                    : null}
                </Link>
              ))}
            </List>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);
