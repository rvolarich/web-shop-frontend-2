import React from 'react';
import { Button, Container, Modal, Table, Form, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SHOW_MODAL, INVENTORY_STATUS } from '../actions/types';
import { fetchPosts } from '../actions/postActions';
import InventoryItem from './InvertoryItem';
import DragAndDrop from './DragAndDrop';
import FileList from './FileList';
import axios from 'axios';
import ModalElement from './ModalElement';
import { data } from 'jquery';


class Inventory extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            file:[],
            productData:{
                productName:'',
                productDescription:'',
                productPriceString:'',
                productQuantity:'',
                productImage:''
              },
              productId: 0,
              allowAddButton:false
            
        }
        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)
        
    }

      componentDidMount(){

      setTimeout(() => {if(this.props.sessionExpired){

        window.location.replace('http://127.0.0.1:3000/sessionexp')
      }
    }, 30)

        this.props.fetchPosts();
        console.log("been in inventory");

        localStorage.setItem('lastUrl', 'http://127.0.0.1:3000/inv');
    }
    closeModal = () => {
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: false
        });
        window.location.replace(localStorage.getItem('lastUrl'));
      }

      showModal = (id) => {
        this.setState({...this.state, productId: id})
        setTimeout(() => {console.log("iddddddddddd in inventoryyyyyy " + this.state.productId);}, 20)
        
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: true
        });
        
      }

      allowAddButtonKey = () => {
       setTimeout(() => {
         console.log('state: ' + JSON.stringify(this.state.productData))
        if(this.state.productData.productName !== '' && 
       this.state.productData.productDescription !== '' && this.state.productData.productPriceString !== '' && 
       this.state.productData.productQuantity !== '' && this.props.allowAddProduct === true){
        
        this.setState({allowAddButton:true})
      }
        else{
          this.setState({allowAddButton:false})
        }}, 20) 
      
      }


      handleDelete = () => {
        
        axios({
          method: 'delete',
          url: '/products/del',
          data: {
            productId: this.state.productId
          },
          headers:{
            withCredentials:true
          }
        }).then(response => {
          this.props.dispatch({
            type: INVENTORY_STATUS,
            payload: response.data
          })
        }).then(() => {
          this.props.dispatch({
            type: SHOW_MODAL,
            payload: false
          });
          window.location.reload();
        }).catch(err => {
          console.log(err);
        });
      }

      validatePrice(s) {
        console.log('been in validate price')
        let rgx = /^[0-9]*\.?[0-9]*$/; // allows numbers and one dot
        return s.match(rgx);
    }
    
    validateStock(s) {
      let rgx = /^[0-9]*$/; // allows numbers only
      return s.match(rgx);
    }

      handleName(event){
       
        if(event.target.value.length < 25){
        this.setState({productData:{...this.state.productData, productName: event.target.value}});
        this.allowAddButtonKey();
      }
      }
    
      handleDesc(event){
        if(event.target.value.length < 25){
        this.setState({productData:{...this.state.productData, productDescription: event.target.value}});
        this.allowAddButtonKey();
        }
      }
    
      handlePrice(event){
        if(this.validatePrice(event.target.value) && event.target.value.length < 15){
        this.setState({productData:{...this.state.productData, productPriceString: event.target.value}});
        this.allowAddButtonKey();
      }
      }
    
      handleQty(event){
        if(this.validateStock(event.target.value) && event.target.value.length < 9){
        this.setState({productData:{...this.state.productData, productQuantity: event.target.value}});
        this.allowAddButtonKey();
      }
      }
    
      handleInsert(){
    
        this.setState({productData:{...this.state.productData, productImage: localStorage.getItem('image')}})
    
        setTimeout(() => {axios.post('/products/insert', this.state.productData,
        {withCredentials:true})
        .then(response => {
          console.log(response);
          this.props.dispatch({
            type: INVENTORY_STATUS,
            payload: response.data
          })
        }).then(() => {
          window.location.reload();
        })
        .catch(function(err){
          console.log(err);
        })}, 30);
      }
    render(){

        const { products, showModal } = this.props;
        return(
            
          <div style={{margin:'auto', width:'67%'}}>

            <div style={{paddingLeft:'2%', marginTop:'30px', marginBottom:'20px'}}>
            <h4>Inventory</h4>
            </div>
            <ModalElement  input='inventory' modalLine1='Delete the item?' modalTitle='Inventory' 
                           modalLine2='The product will be removed from the main products list!'
                          handleDel={this.handleDelete}/>  
                
                
                {
                    products.map((product, index) => 
                    <InventoryItem product={product} key={index} getKey={(id) => this.showModal(id)}/>

                    
                    
                    )
                }
              
<Col style={{marginTop: '10px'}} xs={6}>
  <div style={{width:'80%', height:'30px', color:'green'}}> 
          {this.props.inventoryStatus.charAt(0) === 'E' ? <p><span style={{color:'red'}}>{this.props.inventoryStatus}</span></p>
          : <p><span style={{color:'green'}}>{this.props.inventoryStatus}</span></p>}
   </div>
    <div style={{marginBottom: '20px', marginTop: '10px'}}>
        <h6>
            Add new product:
        </h6>
    </div>

    <Form >

<Form.Group  controlId="productName">
      <Form.Label>Product Name</Form.Label>
      <Form.Control type="text" placeholder="" onChange={this.handleName.bind(this)}
        value={this.state.productData.productName}/>
    </Form.Group>
<Form.Group  controlId="productDescription">
      <Form.Label>Product description</Form.Label>
      <Form.Control type="text" placeholder="" onChange={this.handleDesc.bind(this)}
        value={this.state.productData.productDescription} />
    </Form.Group>
    <Form.Row>
    <Form.Group  as={Col} controlId="productPrice">
      <Form.Label>Price</Form.Label>
      <Form.Control type="text" onChange={this.handlePrice.bind(this)}
        value={this.state.productData.productPriceString} />
    </Form.Group>
    <Form.Group  as={Col} controlId="productStock">
      <Form.Label>Quantity</Form.Label>
      <Form.Control type="text" placeholder="" onChange={this.handleQty.bind(this)}
        value={this.state.productData.productQuantity} /> 
    </Form.Group>
    </Form.Row>
</Form>
<FileList allowButtAdd={() => this.allowAddButtonKey()}/>

{this.state.allowAddButton ? <Button onClick={this.handleInsert.bind(this)} style={{marginBottom:'70px'}}>Add product</Button> :
<Button style={{marginBottom:'70px'}} onClick={this.handleInsert.bind(this)} disabled >Add product</Button>}

</Col>

</div>
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
      showModal: state.posts.showModal,
      allowAddProduct: state.posts.allowAddProduct,
      inventoryStatus: state.posts.inventoryStatus,
      sessionExpired: state.posts.sessionExpired
      });
  
  export default connect (mapStateToProps, mapDispatchToProps)(Inventory);

  