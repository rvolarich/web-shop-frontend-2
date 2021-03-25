import React, {Children, Component} from 'react';
import axios from 'axios';
import './App.css'
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css'
import './Cart.css';
import CartItem from './CartItem'
import CartCalculator from './components/CartCalculator'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getCartProducts, getCartQty, deleteCart, postCart,
          deleteCartItem, fetchPosts } from './actions/postActions';
import { GET_CART_PRODUCTS, GET_CART_QTY, UPDATE_CART_TOTAL, SET_CART_PRODUCT_QUANTITY, 
  UPDATE_COUNT, SHOW_MODAL, DELETE_CART_PRODUCT, DELETE_CART} from './actions/types';
import { bindActionCreators } from 'redux';
import { allowConfirmButton } from './components/CartCalculator';

import ModalElement from './components/ModalElement';
import ModalConfirmCart from './components/ModalConfirmCart';
import ContinueShopping from './components/ContinueShopping';



let total = 0;
let allowUpdateCartLocal = false;
let allowCountUpdate = true;

class Cart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            userData:{
              nameName:'',
              email:''
            },

            isCartEmpty:false
            //cartProds:[]
        }
        this.deleteCart = this.deleteCart.bind(this)
        this.updateCart = this.updateCart.bind(this)
        this.updateCountNumber = this.updateCountNumber.bind(this)
        this.addTotal = this.addTotal.bind(this)
        this.confirmOrder = this.confirmOrder.bind(this)
        this.confirmOrderGuest = this.confirmOrderGuest.bind(this)
       // this.loadLocalStorage = this.loadLocalStorage.bind(this)
        this.addTodo = this.addTodo.bind(this)
        this.priceTotal = this.priceTotal.bind(this)
        
       
    }

    

   

    componentDidMount(){

      
      
      if(this.props.cartProducts <= 0){
        setTimeout(() => {this.setState({...this.state, isCartEmpty: true})}, 100)
    }
      setTimeout(() => {
        if(this.props.sessionExpired){
    
        window.location.replace('http://127.0.0.1:3000/sessionexp')
      }else{

        if(this.props.isLogged){
        
          this.props.getCartProducts();
          this.props.getCartQty();
          this.props.fetchPosts();
          this.priceTotal();
     
          axios.get('/get/user', { withCredentials:true})
          .then(response => {
            this.setState({userData:{...this.state.userData, email: response.data.username, nameName: this.props.username}})
        })
    }else{
          this.props.dispatch({
            type: GET_CART_PRODUCTS,
            payload: loadLocalStorage()
          });
        
          this.priceTotal();
          this.updateCountNumber();
          
    } 
      }
    }, 30)

      localStorage.setItem('lastUrl', 'http://127.0.0.1:3000/cart');
  }

   


    deleteCart = () => {

      this.props.dispatch({
        type: DELETE_CART,
        payload: []
      })

      this.props.dispatch({
        type: UPDATE_COUNT,
        payload: 0
      })

      

      if(this.props.isLogged){
        this.props.deleteCart();
      
      }else{
        let keysToErase = [];
        keysToErase = this.getLocalStorageProductKeys();
        
        for(let i = 0; i < keysToErase.length; i++){
          localStorage.removeItem(keysToErase[i])
        }
      }
       //window.location.reload() 
       
    }

 priceTotal = () => {

      
      total = 0;
     
  
      let totalRounded = 0;
      
      setTimeout(() => { 
        
        if(this.props.cartProducts != null){
        
        for(let i = 0; i < this.props.cartProducts.length; i++){
            total += this.props.cartProducts[i].productPrice * this.props.cartProducts[i].productQuantity;
          }
      }
       else{
        total = 0;
        
       }    
       totalRounded = (Math.round(total * 100) / 100).toFixed(2);
       this.props.dispatch({ 
        type: UPDATE_CART_TOTAL,
        payload: Number(totalRounded)
      });
  
      
      }, 200); 
 }
 

 updateCart = () => {

  let inputNodes = [];
  let inputValues = [];
  
  inputNodes = document.getElementsByTagName("input")
  
  let i = 0;
  for(let i = 0; i < inputNodes.length; i++){
    
    let k = parseInt(inputNodes[i].value)
    inputValues.push(k)
   }
  console.log('niz vrijednosti: ' + inputValues)
 
  this.props.dispatch({
    type: SET_CART_PRODUCT_QUANTITY,
    payload: inputValues
    })

    
    
    this.priceTotal();
    setTimeout(() => { this.updateCountNumber();}, 100)
  setTimeout(() => {

    
    
    if(this.props.isLogged){
    this.props.postCart(this.props.cartProducts);
    
  }else{
    for(let i = 0; i < this.props.cartProducts.length; i++){
      localStorage.setItem(this.props.cartProducts[i].productId, JSON.stringify(this.props.cartProducts[i]));
      }
    }}, 500) 
  

//window.location.reload();
 }


 addTodo = (heading) => {
   console.log("Heading: " + JSON.stringify(heading));
   this.props.dispatch({type: SET_CART_PRODUCT_QUANTITY ,
    payload: {
    fieldValue: heading.input,
    prodId: heading.prodId
    }
    });

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

deleteCartItemById(id) {
  
  this.props.dispatch({
    type: DELETE_CART_PRODUCT,
    payload: id
   })

   setTimeout(() => {this.updateCountNumber();}, 100) 
   this.priceTotal();

  if(this.props.isLogged){
    let prodObj = {
      productId: id
      }
    this.props.deleteCartItem(prodObj); 
  }else{
    
    let lskFiltered = [];
    let storageKeysInteger = [];
    let temp = [];
    let keysToErase = [];
    
    let index = 0;
    for(let i = 0; i < Object.keys(localStorage).length; i++){
        storageKeysInteger[i] = parseInt(Object.keys(localStorage)[i]);
      }
    for(let i = 0; i < storageKeysInteger.length; i++){
        if(storageKeysInteger[i] > 100000){
          lskFiltered[index] = storageKeysInteger[i];
          index++;
        }
        }

        //console.log("storageKeysInteger " + lskFiltered);
        
        for(let i = 0; i < lskFiltered.length; i++){
          if(localStorage.getItem(lskFiltered[i]) === id.toString()){
            temp[index] = lskFiltered[i];
            localStorage.removeItem(temp[index]);
            index++;
          }
        }

       //updateCount();

    setTimeout(() => {if(temp.length == 0){
      
      localStorage.clear();
      
      
   }}, 25); 
  }
  
  
  //window.location.reload();
  
            
  
  
  
 
  
  }

  updateCountNumber = () => {
    let totalCount = 0;

    console.log('updateCount length' + this.props.cartProducts.length)
   for(let i = 0; i < this.props.cartProducts.length; i++){
      totalCount = totalCount + this.props.cartProducts[i].productQuantity;
   }

   console.log('updateCount total ' + totalCount)
   this.props.dispatch({
    type: UPDATE_COUNT,
    payload: totalCount
  });
  }

  
addTotal = (total, shipping) => {
    console.log("been in add total");
    return (Math.round((Number(total) + Number(shipping)) * 100) / 100).toFixed(2);
    }

confirmOrderGuest = (data) => {
  console.log('bio u confirmOrderGuest, data:' + JSON.stringify(data))
  setTimeout(() => {let objectArray = [];
    this.props.cartProducts.map((product) => {
        
      objectArray.push(product)
        
    })

    objectArray.push(data)
    console.log('array length' + objectArray.length)


      axios.post('/confirmorder', objectArray,
      { withCredentials: true })
    .then(response => response.data)
    .catch(function (error) {
        console.log(error);
      });}, 50)
  
      setTimeout(() => {
      
      window.location.replace('http://127.0.0.1:3000/confirm') 
       
    }, 50) 

    setTimeout(() => {
      
      window.location.replace('http://127.0.0.1:3000/confirm') 
      
    }, 50) 
  }




confirmOrder = () => {
  
    if(!this.props.isLogged){
      this.props.dispatch({
        type: GET_CART_PRODUCTS,
        payload: loadLocalStorage()
      });

      this.props.dispatch({
        type: SHOW_MODAL,
        payload: true
      })
      
    }
   else{
    setTimeout(() => {let objectArray = [];
      this.props.cartProducts.map((product) => {
          
        objectArray.push(product)
          
      })
  
      objectArray.push(this.state.userData)
      console.log('array length' + objectArray.length)
  
  
        axios.post('/confirmorder', objectArray,
        { withCredentials: true })
      .then(response => response.data)
      .catch(function (error) {
          console.log(error);
        });}, 50)
    
        
      
      
      setTimeout(() => {
        
        window.location.replace('http://127.0.0.1:3000/confirm')  
      }, 50) 
    }
    }

      render(){
    
      
    const { cartProducts, total, cTotal, shipping, isLogged} = this.props;
     
  return (


    <div style={{margin:'auto', width:'67%', minHeight:'410px'}}>

      <ModalConfirmCart confOrder={(data) => this.confirmOrderGuest(data)} />
        
       {this.props.cartProducts.length <= 0 ? this.state.isCartEmpty ? 
       
       <div style={{margin:'auto', paddingTop:'110px', textAlign:'center'}}>
         
         <h3>Your cart is empty!</h3> 

         <Button href="/shop" variant="outline-info" 
         style={{marginTop:'40px', width:'25%'}}>To Shop</Button>
         
         </div> : null : <div>
      
      <div style={{width:'67%', height:'75px', paddingLeft:'1%'}}>
              <Button variant="outline-info" onClick={this.deleteCart} style={{marginTop:'37px'}}
              >Clear cart</Button>
         </div>  
    <hr style={{width:'64%', marginLeft:'10px'}}/>
    
    <Row>
        <Col>
                
            <div name="cartMain">
        {
          this.props.cartProducts.map((product) => 
          <CartItem product={product} key={product.productId}
          deleteCartProduct={(num) => this.deleteCartItemById(num)}  updateCartItems={() => this.updateCart()} 
          onSubmit={this.addTodo} />
          
          )
          
        }
        </div>
         <ContinueShopping />       
        
                

                
                
        </Col>

    
     
     <Col xs={4}>
      
     
        <CartCalculator cTotal={cTotal} shipping={shipping} prodStock={cartProducts.productStock} 
        totalAmount={this.addTotal(cTotal, shipping)} confirmOrderKey={this.confirmOrder} />
     
     
     </Col>
     

     </Row>
    
     </div>}
        
              </div> 
        

        
    
    
  );
  }
}



function mapDispatchToProps(dispatch) {
  return{
    dispatch,
     ...bindActionCreators({ getCartProducts, getCartQty, deleteCart, postCart,
    deleteCartItem, fetchPosts }, dispatch)
}
}

const mapStateToProps = state => ({
    cartProducts: state.posts.cartProducts,
    products: state.posts.products,
    updateCart: state.posts.updateCart,
    cTotal: state.posts.cTotal,
    shipping: state.posts.shipping,
    isLogged: state.posts.isLogged,
    username: state.posts.username,
    sessionExpired: state.posts.sessionExpired
    
  });

export default connect (mapStateToProps, mapDispatchToProps)(Cart);

export function allowUpdateCart(num){
  if(num === 1){
    allowUpdateCartLocal = true;
  }
  else allowUpdateCartLocal = false;
}

export function loadLocalStorage(){
  let localStorageCart = [];
  
        let lskFiltered = [];
        let storageKeysInteger = [];
        let uniqueValues = [];
        let index = 0;
        let temp = [];

        for(let i = 0; i < Object.keys(localStorage).length; i++){
            storageKeysInteger[i] = parseInt(Object.keys(localStorage)[i]);
          }
        for(let i = 0; i < storageKeysInteger.length; i++){
            if(storageKeysInteger[i] > 100000){
              lskFiltered[index] = storageKeysInteger[i];
              index++;
            }
            }

            lskFiltered.sort((a, b) => a-b);
          

        for(let i = 0; i < lskFiltered.length; i++){
            
            temp[i] = localStorage.getItem(lskFiltered[i]);
        }
          
          uniqueValues = [...new Set(temp)];
          

   for(let i = 0; i < uniqueValues.length; i++){
      localStorageCart[i] = JSON.parse(localStorage.getItem(uniqueValues[i]));
   }
   return localStorageCart;
  }

  export function updateCount(){
    let totalCount = 0;
    setTimeout(() => {
      for(let i = 0; i < this.props.cartProducts.length; i++){
        totalCount = totalCount + this.props.cartProducts[i].productQuantity;
     }
     this.props.dispatch({
      type: UPDATE_COUNT,
      payload: totalCount
    });
     }, 20);
  }