import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { SET_CART_QTY, SET_CART_PRODUCT_QUANTITY, GET_CART_QTY } from './actions/types';
import { getCartItemQty, getCartProducts, deleteCartItem } from './actions/postActions';
import { bindActionCreators } from 'redux';
import { allowConfirmButton } from './components/CartCalculator';

import axios from 'axios';
import { allowUpdateCart } from './Cart';


class CartItem extends React.Component{

    constructor(props){
        super(props);
        this.state = {
              
              input: 0
          }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCartItemById = this.updateCartItemById.bind(this)
    this.validateStock = this.validateStock.bind(this)
    
    }

    componentDidMount(){
      
      getCartItemQty();
     
      this.setState({...this.state, input: this.props.product.productQuantity})
    }


    updateCartItemById = () => {
     /* this.props.postCart(this.props.products);
      allowCountUpdate = true;*/
     }

     validateStock(s) {
      let rgx = /^[0-9]*$/; // allows numbers only
      return s.match(rgx);
    }

    handleChange(event){
      
      if(this.validateStock(event.target.value)){
        if(event.target.value >= this.props.product.productStock){
          this.setState({...this.state, input: this.props.product.productStock})
          event.target.value = this.props.product.productStock;
        }else{
        this.setState({...this.state, input: event.target.value})
      }
      }
      
          getCartProducts();
          if(event.target.value <= 0){
            allowConfirmButton(1);
            }
          else{
            allowConfirmButton(5);
          }
          
          //this.setState({fieldData: {input: event.target.value, prodId: this.props.product.productId}});
           

                    allowUpdateCart(1);
      //  }

    }
      
    handleSubmit(event) {
      event.preventDefault();
      
      
      this.setState({fieldData: {...this.state.fieldData, input: event.target.value, prodId: this.props.product.productId}});
      
      if(this.state.fieldData.input == ''){
        this.setState({fieldData: {...this.state.fieldData, input: this.props.product.productQuantity}});
      }
      setTimeout(() => {this.props.onSubmit(this.state.fieldData);
        console.log(this.state);}, 50);
      
    }

    

    

    render(){

        const {product, isLogged, cartProductQuantity} = this.props;
        
        return (

            <div name="cartItem" style={{margin:'auto', width:'96%'}}>
              
                <Row>
                  <Col>
                  <img src={product.productImage} style={{width:'9vw',
                              paddingTop: '45px' }} alt=""></img>
                  </Col>
                  <Col>
                  <p style={{marginTop: '50px'}}><span style={{fontWeight:'bold'}}>{product.productName}</span></p>
                  <p>{product.productDescription}</p>
                  <br />
                  {product.productStock <= 0 ? <p><span style={{color: 'red'}}>Out of stock</span></p> :
               <p><span style={{color: 'green'}}>In Stock:</span> {product.productStock}</p>} 
                  </Col>
                  <Col style={{marginTop: '50px'}}>
                  
                  <input key="index" type="text"  size="3" maxLength="10"
                  
              onChange={this.handleChange} value={this.state.input}/>
              
              <Button type="submit" variant="outline-info" 
              onClick={() => this.props.updateCartItems()} size="sm"
              style={{marginLeft:'65px', marginTop:'-58px'}}>Update</Button>
              
               
          
       
        
        
                  </Col>
                  <Col>
                  
                  
              <h6 style={{marginTop:'50px', marginLeft: '10%', marginBottom: 'auto'}}>EUR 
              {parseFloat(product.productPrice).toFixed(2)}</h6>
              <Button variant="outline-danger" onClick={/*this.deleteCartItemById*/() => this.props.deleteCartProduct(this.props.product.productId)} 
                   style={{marginLeft:'10%', marginTop:'35px'}}>Remove</Button>
                  </Col>
                </Row>
                <hr />
                </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
  return{
    dispatch,
     ...bindActionCreators({ getCartProducts, getCartItemQty, deleteCartItem }, dispatch)
}
}

const mapStateToProps = state => ({
  number: state.posts.cartQtyState,
  updateCart: state.posts.updateCart,
  isLogged: state.posts.isLogged,
  cartProductQuantity: state.posts.cartProductQuantity
});

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);