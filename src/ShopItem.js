import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { getProductId } from './Repository2';
import { connect } from 'react-redux';
import Shop from './Shop';
import count from './Shop'
import AddToCartButton from './AddToCartButton';

import Navig from './Navig';
import { cartChildren } from './App'
import { getCartQty, getCartProducts } from './actions/postActions';
import { GET_DATA, POST_DATA, GET_CART_QTY, INCREMENT, 
  SET_CART_PRODUCT_QUANTITY_LOCAL, KEY_SEQUENCE, GET_CART_PRODUCTS  }  from './actions/types';
import { loadLocalStorage } from './Cart';
import { bindActionCreators } from 'redux';

let compare = 0;
let keySequence = [];
class ShopItem extends React.Component{
   
  
  
    constructor(props){
        super(props);
        this.state = {
          cartData: {
            productId: this.props.product.productId,
            productName: this.props.product.productName,
            productQuantity: 0,
            productStock: this.props.product.productQuantity,
            productPrice: this.props.product.productPrice,
            productDescription: this.props.product.productDescription,
            productImage: this.props.product.productImage
          },

          prodQty: this.props.product.productQuantity
          
        }

        this.clickMe = this.clickMe.bind(this)
        
    }


   clickMe = () => {

    localStorage.setItem('count', '1')
    let productQuantityLocal = 0;
    
    let cartProductQuantity = [];
    cartProductQuantity = this.props.cartProducts;
    console.log("cartProducts " + JSON.stringify(cartProductQuantity.length));
    console.log("cartProductsProductId " + JSON.stringify(this.props.product.productId));
    for(let i = 0; i < cartProductQuantity.length; i++){
      if(cartProductQuantity[i].productId === this.props.product.productId){
        
        productQuantityLocal = cartProductQuantity[i].productQuantity;
        console.log("productQuantityLocal " + productQuantityLocal);
      }
    }

    let newArray = {...this.state.cartData};
        console.log("This state prodqty: " + this.props.cartProducts.productQuantity);
        
          
          console.log('prodQty:' + this.state.prodQty)
        newArray= {...newArray, productQuantity: productQuantityLocal + 1}
        console.log("racun: " + (this.props.product.productQuantity - this.state.cartData.productQuantity ))
        if((this.props.product.productQuantity - newArray.productQuantity) < 0){
          newArray= {...newArray, productQuantity: this.props.product.productQuantity}
        }
        else{
          this.props.dispatch({
            type: INCREMENT
          });

          if(this.props.isLogged){

            axios.post('http://127.0.0.1:8080/pcp', 
             this.state.cartData, { withCredentials: true }).then(() => {
               
               this.props.getCartProducts();
                //this.props.getCartQty();
               })
             .catch(function (error) {
               console.log(error);
             });
      
             
           }else{
             setTimeout(() => {
                keySequence.push(this.props.product.productId);
              localStorage.setItem(Date.now(), this.props.product.productId);
              
              this.setCartQtyState();
            
            
            }, 40);
          
          }
        }

    setTimeout(() => {this.setState({cartData: newArray})}, 20)

  
    
      }

      setCartQtyState = () => {
        let id = this.props.product.productId;
        localStorage.setItem(id, JSON.stringify(this.state.cartData));
        console.log("idddddddddddddddddddddddddddddddddddddddd " + id)
        setTimeout(function() { //Start the timer
          
          this.props.dispatch({
            type: GET_CART_PRODUCTS,
            payload: loadLocalStorage()
          });
          
      }.bind(this), 20)
    }
    
    
    render(){
        const {product} = this.props;
        
        return(
<Container>
      
        <Row key={product.productId} style={{minHeight:'200px', marginTop:'70px'}}>
          <Col  xs={4}>
          <img className="rounded mb-0" alt="100x100" 
          src={product.productImage} alt=""></img>
          </Col>
          <Col  xs={5} style={{marginTop:'80px'}}>
            <div>
        <h3 >{product.productName}</h3>
           </div>
           <br />
           <div>
           <h4>{product.productDescription}</h4>
           </div>
           <br />
            <div >
              {product.productQuantity <= 0 ? <h6><span style={{color: 'red'}}>Out of stock</span></h6> :
               <h6><span style={{color: 'green'}}>In Stock:</span> {product.productQuantity}</h6>} 
            </div>
          </Col>
          <Col  xs={3}>
            <div style={{marginTop:'30px', marginLeft: '60px'}}>
              <h5>Price: {parseFloat(product.productPrice).toFixed(2)}, EUR</h5>
            </div>
            <br />
           
            
          {product.productQuantity <= 0 ? 
          <p style={{marginTop: '115px', marginLeft: '40px'}}>Available in two weeks</p> : <AddToCartButton 
          postToCart={this.clickMe}/>}
          </Col>
          
        </Row>
        <hr />
        
        
        
      </Container>
      
        );
    }

}

function mapDispatchToProps(dispatch) {
  return{
    dispatch,
     ...bindActionCreators({ getCartQty, getCartProducts }, dispatch)
}
}

const mapStateToProps = state => ({
  cartProducts: state.posts.cartProducts,
  isLogged: state.posts.isLogged,
  username: state.posts.username
});

export default connect(mapStateToProps,mapDispatchToProps)(ShopItem);