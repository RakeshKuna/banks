import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {MuiThemeProvider} from '@material-ui/core/styles';
import getMuiTheme from "../theme/theme";

class EnhancedTableHeadView extends React.Component {
    render(){
        return(            
            <MuiThemeProvider theme={getMuiTheme}>
                <TableHead >
                    <TableRow >
                        {this.props.rows.map(row=>{
                            return(
                                <TableCell style={{textAlign:'center'}} key={row.id}>
                                    {row.label}
                                </TableCell>
                            )   
                        },this)}
                    </TableRow>
                </TableHead>        
             </MuiThemeProvider>       
        )
    }
}
export default EnhancedTableHeadView;