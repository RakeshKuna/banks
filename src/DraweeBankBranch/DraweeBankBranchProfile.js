import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EnchancedTabContainer from '../container/TabContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        fontSize: 14,
        fontFamily:"Gotham-Rounded"
    },
});

class DraweeBankBranchProfile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            draweeBankBranchProfileView: ''
        }
    }
    
    render() {
        // console.log(this.props);
        const { classes } = this.props;

        return (

            <EnchancedTabContainer >
                <div className={classes.root}>
                    <Grid container spacing={24}>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Display Name
                        </Typography>
                            <span className="drawee-profile-view" >
                                {(this.props.draweeBankBranchProfileView['displayName'] !== null) ? this.props.draweeBankBranchProfileView['displayName'] : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Service Provider
                        </Typography>
                            <span className="drawee-profile-view" >
                                {(this.props.draweeBankBranchProfileView['serviceProviderCode'] !== null) ? this.props.draweeBankBranchProfileView['serviceProviderCode'] : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Product Type
                        </Typography>
                            <span className="drawee-profile-view" >
                                {(this.props.draweeBankBranchProfileView['productType'] !== null) ? this.props.draweeBankBranchProfileView['productType'] : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Sub Product Type
                        </Typography>
                            <span className="drawee-profile-view" >
                                {(this.props.draweeBankBranchProfileView['productSubType'] !== null) ? this.props.draweeBankBranchProfileView['productSubType'] : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Service Type
                        </Typography>
                            <span className="drawee-profile-view" >
                                {(this.props.draweeBankBranchProfileView['serviceType'] !== null) ? this.props.draweeBankBranchProfileView['serviceType'] : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Currency
                        </Typography>
                            <span className="drawee-profile-view" >
                                {(this.props.draweeBankBranchProfileView['currencyCode'] !== null) ? this.props.draweeBankBranchProfileView['currencyCode'] : '--'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Account Number
                        </Typography>
                            <span className="drawee-profile-view" >
                                {this.props.draweeBankBranchProfileView['accountNumber']}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                BIC Code
                        </Typography>
                            <span className="drawee-profile-view" >
                                {this.props.draweeBankBranchProfileView['swiftCode']}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Uaex Bank wise Exchange Ccy Markup
                        </Typography>
                            <span className="drawee-profile-view" >
                                {(this.props.draweeBankBranchProfileView['uaexBankWiseRateCcy']) ? 'Yes' : 'No'}
                            </span>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Status
                        </Typography>
                            <span className="drawee-profile-view" >
                                {this.props.draweeBankBranchProfileView['status']}
                            </span>
                        </Grid>
                    </Grid>
                </div>
            </EnchancedTabContainer>
        )
    }
}

export default withStyles(styles)(DraweeBankBranchProfile);
