import React from 'react';
import { Container } from 'react-bootstrap';
import ContinueShopping from './ContinueShopping';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteCart } from '../actions/postActions'
class Confirm extends React.Component{

componentDidMount(){
    
    setTimeout(() => {

        if(this.props.isLogged){
            this.props.deleteCart();
          }else{
            let keysToErase = [];
            keysToErase = this.getLocalStorageProductKeys();
            for(let i = 0; i < keysToErase.length; i++){
              localStorage.removeItem(keysToErase[i])
            }
          }
        }, 1500) 
}

getLocalStorageProductKeys(){
    let index = 0;
    let lskFiltered = [];
    let storageKeysInteger = [];
    for(let i = 0; i < Object.keys(localStorage).length; i++){
      storageKeysInteger[i] = parseInt(Object.keys(localStorage)[i]);
    }
  for(let i = 0; i < storageKeysInteger.length; i++){
      if(storageKeysInteger[i] > 0){
        lskFiltered[index] = storageKeysInteger[i];
        index++;
      }
      }
      return lskFiltered;
   }

    render(){
        return(
            <div style={{margin:'auto', minHeight:'410px', paddingTop:'110px', textAlign:'center'}}>
         
         <h3>Congratulations on your purchase!</h3> 
                
           <ContinueShopping />
           </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return{
      dispatch,
       ...bindActionCreators({ deleteCart }, dispatch)
  }
  }
  
  const mapStateToProps = state => ({
      isLogged: state.posts.isLogged
    });
  
  export default connect (mapStateToProps, mapDispatchToProps)(Confirm);