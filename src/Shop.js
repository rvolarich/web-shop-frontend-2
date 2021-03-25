import React from 'react';
import ShopItem from './ShopItem'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { getProducts } from './Repository2';
import { connect } from 'react-redux';
import { fetchPosts, getCartQty } from './actions/postActions';
import { GET_DATA, POST_DATA, INCREMENT, GET_CART_PRODUCTS, UPDATE_COUNT  }  from './actions/types';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import { loadLocalStorage, updateCount } from './Cart';
import axios from 'axios';
import Footer from './components/Footer';


class Shop extends React.Component {


componentDidMount(){
   
  setTimeout(() => {if(this.props.sessionExpired){

    window.location.replace('http://127.0.0.1:3000/sessionexp')
  }
}, 30)
  
  this.props.fetchPosts();
  
  localStorage.setItem('lastUrl', 'http://127.0.0.1:3000/shop');
    
setTimeout(() => {
  
  if(this.props.isLogged){
    
  this.props.getCartQty();
}else{
  this.props.dispatch({
    type: GET_CART_PRODUCTS,
    payload: loadLocalStorage()
  });
  
  let totalCount = 0;
  setTimeout(() => {
  for(let i = 0; i < this.props.cartProducts.length; i++){
    totalCount = totalCount + this.props.cartProducts[i].productQuantity;
 }
 this.props.dispatch({
  type: UPDATE_COUNT,
  payload: totalCount
})
 }, 20);
}}, 50); 
   
    
   
    

    
}
 render(){
   
  const { products } = this.props;
  const { count } = this.props;
  
  return (
    
    
    <div style={{margin:'auto', width:'67%', minHeight:'410px'}}>
       
       {
products.map((product, index) =>
    <ShopItem product={product} key={index} />
        
    )
    
    }
   
              
</div>
       
    
  );
 }
}
function mapDispatchToProps(dispatch) {
  return{
    dispatch,
     ...bindActionCreators({ fetchPosts, getCartQty}, dispatch)
}
}

const mapStateToProps = state => ({
  products: state.posts.products,
  cartProducts: state.posts.cartProducts,
  isLogged: state.posts.isLogged,
  sessionExpired: state.posts.sessionExpired
});

export default connect(mapStateToProps,mapDispatchToProps)(Shop);

export function count(){

  let total = 200;
  this.setState({total});
}