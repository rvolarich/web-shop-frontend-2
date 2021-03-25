import React from 'react';
import { Button, Container, Form, Col, Table} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { INVENTORY_STATUS, PRODUCT_DATA, SHOW_MODAL } from '../actions/types';
import { fetchPosts } from '../actions/postActions';
import axios from 'axios';
import '../App.css';



class InventoryItem extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          productPriceQty:{
            productId: 0,
            productPriceString: '',
            productQuantity: ''
        }
        }
        this.closeModal = this.closeModal.bind(this)
        //this.showModal = this.showModal.bind(this)
    }

    componentDidMount(){
    
      this.setState({productPriceQty:{...this.state.productPriceQty, 
        productPriceString: this.props.product.productPrice, 
        productQuantity: this.props.product.productQuantity}});
      
      }

  validatePrice(s) {
    let rgx = /^[0-9]*\.?[0-9]*$/; // allows numbers and one dot
    return s.match(rgx);
}

validateStock(s) {
  let rgx = /^[0-9]*$/; // allows numbers only
  return s.match(rgx);
}

    handlePrice(event){
     
        if(this.validatePrice(event.target.value) && event.target.value.length < 15){
         this.setState({productPriceQty:{...this.state.productPriceQty, productPriceString: event.target.value}});
        }
        
    }

    handleStock(event){
      if(this.validateStock(event.target.value) && event.target.value.length < 9){
        this.setState({productPriceQty:{...this.state.productPriceQty, productQuantity: event.target.value}});
      }
  }

  

    handleUpdate(){
      
      this.setState({productPriceQty:{...this.state.productPriceQty, 
                     productId: this.props.product.productId}});
        setTimeout(() => {axios.post('http://127.0.0.1:8080/products/update', this.state.productPriceQty,
        {withCredentials:true})
        .then(response => {
          console.log('update response' + JSON.stringify(response.data));
          this.props.dispatch({
            type: INVENTORY_STATUS,
            payload: response.data
          })
        }).then(() => {
          window.location.reload();
        })
        .catch(function(err){
          console.log(err);
        })}, 20)
      

      
    }

    /*handleDelete(){
      this.props.dispatch({
        type: SHOW_MODAL,
        payload: true
      });
    }*/

    /*showModal = () => {
      this.props.dispatch({
        type: SHOW_MODAL,
        payload: true
      });
      
    }*/

    closeModal = () => {
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: false
        });
        window.location.replace(localStorage.getItem('lastUrl'));
      }
    render(){

        const { product, showModal } = this.props;

        return(
            <Container>



                <Table responsive="lg" bordered hover style={{marginBottom: '0px'}}>
  
  <tbody >
    <tr>
      <td style={{width: '70px'}}>{product.productId}</td>
      <td style={{width: '280px'}}>{product.productName}</td>
      <td style={{width: '280px'}}>{product.productDescription}</td>
      <td style={{width: '120px'}}><Form><Form.Control onChange={this.handlePrice.bind(this)}
          value={this.state.productPriceQty.productPriceString}/></Form></td>
      <td style={{width: '100px'}}><Form><Form.Control onChange={this.handleStock.bind(this)} 
          value={this.state.productPriceQty.productQuantity}/></Form></td>
      <td>
        <Button style={{marginLeft: '20px', marginRight: '20px'}} 
                onClick={this.handleUpdate.bind(this)}>Update</Button>
        
        <Button variant="outline-danger" 
        onClick={() => this.props.getKey(this.props.product.productId)}>Delete</Button>
      
      </td>
    </tr>
    
  </tbody>
</Table>


            </Container>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return{
      dispatch,
       ...bindActionCreators({ fetchPosts }, dispatch)
  }
  }
  
  const mapStateToProps = state => ({
      showModal: state.posts.showModal,
      products: state.posts.products,
      showModal: state.posts.showModal
      });
  
  export default connect (mapStateToProps, mapDispatchToProps)(InventoryItem);