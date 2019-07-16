import React from 'react';
import { FloatButton, Notifications, IconButton, Button } from 'finablr-ui';

class EmptylistComponent extends React.Component {

    constructor(props){
        super(props);
    }

    handleReload = () =>{
      window.location.reload();
    }

    render() {
      return(
        <div className="empty-result-text">
          {
            (this.props.fromPage == 'Banks') ? 
              <div className="align-center"><p>{this.props.text} list is empty.</p><p>Please click on <span className="empty-list-text">Import</span> button to upload the list of {this.props.text}</p></div>
            : 
            [
              (this.props.fromPage == 'Branches') ? <div className="align-center"><p>{this.props.text} list is Empty.</p><p>Please click on the <span className="empty-list-text">Bank Branch Profiles</span> to upload list of {this.props.text}</p></div>
              :
              [ 
                (this.props.fromPage == 'DraweeBanks') ? 
                  <div className="align-center">
                    <p>{this.props.text} list is empty.</p>
                    <p>Please click on <span className="empty-list-action">Plus</span> button to create the {this.props.text}</p>
                  </div>
                : 
                [
                  (this.props.fromPage == 'BranchTableProfileView')? <div className="align-center"><p>{this.props.text} List is Empty.</p><p>Branch Identification codes are not found.</p></div>
                  :
                  [
                    (this.props.fromPage == 'BeneficiaryBanks')? <div className="align-center"><p>{this.props.text} List is Empty.</p><p>Click on <span className="empty-list-action">ADD </span>button to create Beneficiary Banks</p></div>
                    :
                    [
                      (this.props.fromPage == 'PurposeOfTransactions')? <div className="align-center"><p>{this.props.text} List is Empty.</p><p>Click on <span className="empty-list-action">ADD </span>button to create Purpose Of Transactions</p></div>
                    :
                      [
                        (this.props.fromPage == 'SourceOfFunds')? <div className="align-center"><p>{this.props.text} List is Empty.</p><p>Click on <span className="empty-list-action">ADD </span>button to create Source Of Funds.</p></div>
                      :
                        [
                          (this.props.fromPage == 'draweebankforrate')? <div className="align-center"><p>{this.props.text} List is Empty.</p><p>Click on <span className="empty-list-action">ADD </span>button to create Drawee Bank For Rate.</p></div>
                          : 
                          [
                            (this.props.fromPage == 'agentdraweebank4rate')? <div className="align-center"><p>{this.props.text} List is Empty.</p><p>Click on <span className="empty-list-action">ADD </span>button to create Agent  Drawee Bank For Rate.</p></div>
                              :
                              <div className="align-center">
                                <h4>{this.props.text}</h4>
                              </div>
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]  
            ]
          }
          {
            ((this.props.text) && (this.props.text.toLowerCase().includes("something went wrong") || (this.props.text.toLowerCase().includes("internal server error")))) ? 
            <div className="align-center" style={{marginTop:40}}>
              <Button onClick={this.handleReload}>Refresh</Button> 
            </div>
            :null
          }
        </div>
      )
    }
  }

  export default EmptylistComponent;

  // agentdraweebank4rate