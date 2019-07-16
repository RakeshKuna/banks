import React, { Component } from 'react';
import EnhancedTable from './EnhancedTable';
import Pagination from '../container/Pagination';
import axios from 'axios';
import Search from '../container/Search';
import Select from '../container/Select';
import '../vendor/common.css';
import '../theme/theme';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import EmptyListComponent from '../component/EmptylistComponent';
import Loader from '../component/Loader';
import Noresult from '../component/NoResults';
import rows from '../component/DraweeBankListTableHeader';
import * as Exceptionhandler from './../ExceptionHandling';
import * as DraweeeBankBranchApiService from './DraweeeBankBranchApiService';
import Card from '@material-ui/core/Card';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  fab: {
    margin: theme.spacing.unit,
    backgroundColor: "#2f2e2e",
    color:'white'
  },
  fntMsg:{
    fontSize:16,    
    color:'#888888'

  }
});

const selectLabels = [
{'id':1,'label':'Display Name','value':'displayName'},
{'id':2,'label':'Product SubType','value':'productSubType'},
{'id':3,'label':'Service Type','value':'serviceType'},
{'id':4,'label':'Currency Code','value':'currencyCode'},
{'id':5,'label':'BIC Code','value':'swiftCode'},
{'id':6,'label':'Account Number','value':'accountNumber'}
];

const rowsPerpage = [{'id':5,'label':'5','value':'5'},{'id':10,'label':'10','value':'10'},{'id':15,'label':'15','value':'15'},{'id':20,'label':'20','value':'20'}]

class BankList extends Component {
  constructor(props){
    super(props)
    this.state = {
      open:false,
      tableHeader:rows,
      bankList:'',
      pageNum:0,
      pageelements:'5',
      bankListLen:'',
      totalRecords:'',
      loading:true,
      buttonText:'',
      errMessage:'Text must contain atleast 1',
      errCheck:false,
      query:'',
      fromSearch:false,
      columnFilter:'',
      editButn:'',
      callTableData:'',
      loaderMessage:'Retrieving Data',
      confirmStatus:false,
      apiErrMsg:'',
      serverStatus:null,
      serverError:false,
      serverErrMessage:''
    }
  }

  async shouldComponentUpdate(nextProps,newState){
    // sessionStorage.setItem('draweebanksbranchFilter',' ')
    // sessionStorage.setItem('draweebankbranchquery',' ')
    // sessionStorage.setItem('PageNumber',0)
    // sessionStorage.setItem('draweebanksbranchRows','5')
    if(!this.props.callTable && nextProps.callTable) {
      try {
        await this.fetchBankList(0);
      } catch (error) {        
      }
    }
    return true;  
    }

  componentWillMount(){   
    let draweebankbranchquery = JSON.parse(sessionStorage.getItem('draweebankbranchquery'))
    let draweebanksbranchRows = JSON.parse(sessionStorage.getItem('draweebanksbranchRows'))
    let draweebanksbranchFilter = JSON.parse(sessionStorage.getItem('draweebanksbranchFilter'))
    let PageNumber = JSON.parse(sessionStorage.getItem('PageNumber'))
    this.setState((prevState, props)=>{
      return {
        query: (draweebankbranchquery == undefined)? prevState.query: draweebankbranchquery,
        pageelements: (draweebanksbranchRows == undefined)? prevState.pageelements: draweebanksbranchRows,
        columnFilter: (draweebanksbranchFilter == undefined)? prevState.columnFilter: draweebanksbranchFilter,
        pageNum: (PageNumber == undefined)? prevState.pageNum: PageNumber
      }
    }, ()=>{
      
      if(this.state.columnFilter.length == 0){
        this.setState({query:''},()=>{
          this.fetchBankList(this.state.pageNum)
        })
      }
      else if((this.state.columnFilter.length > 0)&&(this.state.query.length >= 3)){
        this.setState({fromSearch:true},()=>{
          this.fetchBankList(this.state.pageNum)
        })
      }
      else{
        this.fetchBankList(this.state.pageNum)
      }
    });
  }

  fetchBankList= async (pgno)=>{
    this.setState({loading:true});
    
      sessionStorage.setItem("PageNumber",pgno);
      // const response = await axios
      // .get(process.env.REACT_APP_API_BASE_URL+"/api/v1/onboarding/draweeBanks/"+this.props.draweeId+"/draweeBankProductProfiles",{
      //       params:{
      //         pagenumber:this.state.pageNum,                 
      //         pageelements:this.state.pageelements,
      //         query:(this.state.columnFilter == '')? null:this.state.query,
      //         type:(this.state.columnFilter == '')?null:this.state.columnFilter
      //       }
      //    });
      //    this.setState({bankList:response.data,bankListLen:response.data['data'].length,totalRecords:response.data.total,loading:false});         
      
      let params={
        pagenumber:this.state.pageNum,                 
        pageelements:this.state.pageelements,
        query:(this.state.columnFilter == '')? null:this.state.query,
        type:(this.state.columnFilter == '')?null:this.state.columnFilter
      }
      

      DraweeeBankBranchApiService.getDraweeBankBranchList(params,this.props.draweeId).then((response)=>{ 
        if(response.status == 200){
          this.setState({bankList:response.data,bankListLen:response.data['data'].length,totalRecords:response.data.total,loading:false});         
        }
      }).catch(error=>{
        if(Exceptionhandler.throwErrorType(error).status == 500 || Exceptionhandler.throwErrorType(error).status == 503 || Exceptionhandler.throwErrorType(error).status == 400){
          this.setState({loading:false,serverError:true,serverStatus:Exceptionhandler.throwErrorType(error).status,serverErrMessage:Exceptionhandler.throwErrorType(error).message})
        }
        else{
          this.setState({loading:false,serverError:false,confirmStatus:true,apiErrMsg:error.response.data.error,actionType:'OK'})
        }
    });
  }

  handleSelect=(data,fromPage,type)=>{
    switch (fromPage,type){
      case ('draweebanks','rowsPerpage'):
        this.setState({pageelements:data,pageNum:0,loaderMessage:'Retrieving Data'},()=>{
          sessionStorage.setItem('draweebanksRows',JSON.stringify(data));
          this.fetchBankList(this.state.pageNum);
        });
      break;
      case ('draweebanks','columnFilter'):
        sessionStorage.setItem('draweebanksbranchFilter',JSON.stringify(data));
        this.setState({columnFilter:data},()=>{
          if((this.state.query.length > 0) && (this.state.columnFilter.length > 0)){
            sessionStorage.setItem('draweebankbranchquery',JSON.stringify(this.state.query));
            sessionStorage.setItem('draweebanksbranchFilter',JSON.stringify(this.state.columnFilter));
            this.setState({fromSearch:true,loaderMessage:'Retrieving Data',errCheck:false},()=>{
              this.fetchBankList(this.state.pageNum);
            })
          }
          else if((this.state.query.length == 0) && (this.state.columnFilter.length == 0)){
            sessionStorage.setItem('draweebanksbranchFilter',JSON.stringify(''));
            sessionStorage.setItem('draweebankbranchquery',JSON.stringify(''));
            this.setState({fromSearch:false,pageNum:0,query:'',loaderMessage:'Retrieving Data',columnFilter:''},()=>{
              this.fetchBankList(this.state.pageNum);
            })
          }
          else if((this.state.columnFilter.length == 0) && (this.state.query.length > 0)){
            this.setState({fromSearch:false,pageNum:0,query:'',loaderMessage:'Retrieving Data'},()=>{
              sessionStorage.setItem('draweebankbranchquery',JSON.stringify(''));
              this.fetchBankList(this.state.pageNum);
            })
          }
        });
      break;
    }
  }

  handleSearch = (dataEvent,value) =>{
    if(dataEvent.keyCode == 13){
      this.setState({query:value},()=>{
        this.handleSearchCheck(this.state.query,true);
      })
    }
    else{
      this.setState({query:value},()=>{
        this.handleSearchCheck(this.state.query,false);
      })
    }
  }

  handleSearchCheck(data,enter) {
    let dataLen = null;
    if(data == undefined){
      dataLen = 0;
    }
    else{
      dataLen = data.length;
    }
    switch(enter){
      case (true):
        if((dataLen ==0)&&(this.state.columnFilter.length == 0)){
          this.setState({query:'',errCheck:false},()=>{
            this.handleSearchData(data);
          });
        }
        else if((dataLen ==0)&&(this.state.columnFilter.length > 0)){
          this.setState({query:'',errCheck:true,errMessage:'Enter atleast 1 char'});
        }
        else if((dataLen >= 1)&&(this.state.columnFilter.length == 0)){
          this.setState({query:data,errMessage:'Please select column type',errCheck:true});
        }
        else if((dataLen >= 1)&&(this.state.columnFilter.length > 0)){
          this.setState({query:data,errCheck:false,fromSearch:true},()=>{
            this.handleSearchData(data);
          });
        }
      break;
      case (false):
        if(dataLen == 0 && this.state.columnFilter.length == 0){
          this.setState({query:'',errCheck:false,columnFilter:""},()=>{
            sessionStorage.setItem('draweebanksbranchFilter',JSON.stringify(''));
            sessionStorage.setItem('draweebankbranchquery',JSON.stringify(''));
            this.handleSearchData(this.state.query);
          })
        }
        else if(dataLen >= 1){
          this.setState({query:data,errCheck:false})
        }
      break;
    }
  }

  handleGetEditTbl=(editopenval,editId)=>{    
    this.props.getEdit(editopenval,editId)
  }

  handleSearchData = (data) => {
    this.setState({query:data,loaderMessage:'Retrieving Data'},()=>{
      this.fetchBankList(this.state.pageNum);
    })
  }

  handlePagingListing=(pgno)=>{
    this.setState({pageNum:pgno,loaderMessage:'Retrieving Data'},()=>this.fetchBankList(this.state.pageNum))
  }
  
  sbar=(val)=>{
    this.setState({open:val})
  }

  render() {
    const { classes } = this.props;
    const { editval } = this.props;
    const draweeBank = this.props.draweeBankView;
    return (
      <div className={classes.root}>
        {
          this.state.serverError ? <EmptyListComponent text={this.state.serverErrMessage} fromPage="Errors"/> :
          <div className="grid">
            <p className="bank-profile global-font">Drawee Bank Profiles <span className={classes.fntMsg}>{this.state.bankListLen!=0?"(*Please click on any Drawee profile to apply rules)":""}</span></p>
            {  
              this.state.loading?
              <Loader action={this.state.loaderMessage}/>
              :
              <div>
                <Card>
                {
                  (((this.state.bankListLen==0) && (this.state.fromSearch==true)) || (this.state.bankListLen!=0)) ?
                  <Grid container spacing={24} className="page-element-grid" justify="space-between">
                    <Grid item xs={1}> 
                      <Select fromPage="draweebanksbranchRows" value={this.state.pageelements} type="rowsPerpage" selectLabels={rowsPerpage} getSelectText={this.handleSelect}/>    
                    </Grid>
                    <Grid item xs={6} style={{ padding: `16px 0 0 0` }}><div className="global-font"><p>Entries</p></div></Grid>
                    <Grid item xs={5}>  
                      <Grid direction="row" container spacing={24} justify="flex-end" >
                        <Grid item xs={5} style={{paddingRight:'0px'}}>         
                          <Select fromPage="draweebanksbranch" value={this.state.columnFilter} type="columnFilter" selectLabels={selectLabels} getSelectText={this.handleSelect}/> 
                        </Grid>       
                        <Grid item xs={5}>          
                          <Search fromPage="draweebanksbranch" value={this.state.query} getSearchText={this.handleSearch}/>
                          <span className="errorMessage">{this.state.errCheck ? this.state.errMessage:''}</span>          
                        </Grid>  
                      </Grid>
                    </Grid>
                  </Grid> : null
                }
                {
                  ((this.state.fromSearch == true) && (this.state.bankListLen==0))?<Noresult text="Drawee Bank Profiles"/>
                  :
                  [
                    ((this.state.fromSearch == false) && (this.state.bankListLen==0))? <EmptyListComponent text="Drawee Bank Profiles" fromPage="DraweeBanks"/> :null
                  ]
                }
                {
                  (this.state.bankListLen!=0)?
                  <div>
                    <EnhancedTable draweeBank={draweeBank} editBtn={this.props.editval} getEditTbl={this.handleGetEditTbl} bankList={this.state.bankList}  rowsHdr={this.state.tableHeader}  {...this.state} {...this.props}/> 
                    <Pagination totalNumberOfRows={this.state.totalRecords} page={this.state.pageNum} rowsPerPage={this.state.pageelements} handlePagingListing={this.handlePagingListing.bind(this)} {...this.state}/>
                  </div> : null
                }
                </Card>
              </div> 
          }                              
          </div>
        }
      </div>
    );
  }
}

BankList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BankList);
