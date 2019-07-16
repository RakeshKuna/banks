// import React, { Component } from 'react';
// import EnhancedTable from './EnhancedTable';
// import Pagination from '../container/Pagination';
// import rows from './BranchListTableHeader';
// import axios from 'axios';
// import Search from '../container/Search';
// import '../vendor/common.css';
// import '../theme/theme';
// import Grid from '@material-ui/core/Grid';
// import Import from '../container/Import';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import EmptyListComponent from '../component/EmptylistComponent';
// import { withRouter } from 'react-router';
// import Loader from '../component/Loader';
// import Noresult from '../component/NoResults';
// import Modal from './../component/Modalbox';
// import { CSVDownload } from "react-csv";
// import Progressbar from './../component/progressbar';

// const styles = theme => ({
//     root: {
//       flexGrow: 1,
//     },
//     paper: {
//       padding: theme.spacing.unit * 2,
//       textAlign: 'center',
//       color: theme.palette.text.secondary,
//     },
// });

// class BranchListTableView extends Component {
//   constructor(props){
//     super(props)
//     this.state = {
//         open:false,
//         tableHeader:rows,
//         bankList:'',
//         pageNum:'',
//         bankListLen:'',
//         totalRecords:'',
//         loading:true,
//         buttonText:'',
//         errMessage:'Text should contain atleast 1',
//         errCheck:false  ,
//         query:'',
//         fromSearch:false,
//         importingFile:false,
//         importedData:false,
//         modalMessage:'',
//         importErrors:[],
//         downloadFile:false,
//         progressText:'please wait...',
//         loaderMessage:'Retrieving Data'
//     }
//   }

//   componentDidMount(){
//     console.log('calling all branches list');
//     sessionStorage.setItem("allBranches",1);
//     sessionStorage.setItem('individualbankbranchquery',JSON.stringify(''));
//     var bankquery = JSON.parse(sessionStorage.getItem('branchquery'));
//     var PageNumber = JSON.parse(sessionStorage.getItem('PageNumber'));
//     this.setState((prevState, props)=>{
//       return {
//         query: (bankquery == undefined)? prevState.query: bankquery,
//         pageNum: (PageNumber == undefined)? prevState.pageNum: PageNumber,
//         fromSearch: ((bankquery == undefined) || (bankquery.length==0))? prevState.fromSearch: true
//       }
//     }, ()=>{
//       this.fetchBankList(this.state.pageNum)
//     })
//   }

//   fetchBankList=(pgno)=>{
//     this.setState({loading:true});
//     axios.get(process.env.REACT_APP_API_DEV_URL+"/banks/api/v0.1/bank/branch/all",{
//       params:{
//           pagenumber:pgno,                 
//           pageelements:10,
//           query:this.state.query
//       }
//     })
//     .then(response=>{         
//       this.setState({bankList:response.data,bankListLen:response.data['data'].length,totalRecords:response.data.total,loading:false} ,()=> {
//         // if(this.state.bankListLen > 0){
//         //   this.setState({buttonText:'+ Import / Update'})
//         // }
//         // else if((this.state.bankListLen == 0) && (this.state.fromSearch==true)){
//         //   this.setState({buttonText:'+ Import / Update'})
//         // }
//         // else{
//         //   this.setState({buttonText:'+ Import'})
//         // }  
//       })                
//     })
//     .catch(error=>{
//         throw(error)
//     });          
//   }

//   render() {
//     const {bankList,bankListLen,totalRecords,pageNum}=this.state;
//     const { classes } = this.props;

//     return (
//       <div className={classes.root}>
//         {
//         this.state.importingFile ? 
//         <Progressbar displayText={this.state.progressText}/>
//         : 
//           <div>
//               <div className="grid">
              
//                   {
//                   this.state.loading?
//                     <Loader action={this.state.loaderMessage}/>
//                     :
//                     bankListLen!=0?
//                     <div>
//                       <EnhancedTable fromPage="allBranches" bankList={bankList} rowsHdr={this.state.tableHeader}  {...this.state} {...this.props}/> 
//                     </div>
//                     :
//                     [(
//                     this.state.fromSearch?<Noresult text="Branche"/>:<EmptyListComponent text="Branche" fromPage="Banks"/> 
//                     )]
//                   }                        
//               {/* {
//                 this.state.downloadFile ? 
//                 <CSVDownload data={this.state.importErrors} target="_blank" />
//                 :null
//               } */}
//             </div>
//           </div>
//           }
//         </div>   
//     );
//   }
// }

// BranchListTableView.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withRouter(withStyles(styles)(BranchListTableView));