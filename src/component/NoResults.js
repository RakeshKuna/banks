import React from 'react';
class Noresults extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
      return(
        <div className="empty-result-text global-font">
          <div className="align-center"><p>No search results available for your search keyword!</p></div>
        </div>
      )
    }
  }

  export default Noresults;