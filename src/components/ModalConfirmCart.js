import React from 'react';
import { Button, Modal, Row, Form} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SHOW_MODAL } from '../actions/types';

class ModalConfirmCart extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userData:{
            nameName:'',
            email:''
        },
        allowEmailFormat: true,
                allowName: true,
        }
        this.closeModal = this.closeModal.bind(this)
        this.validateEmail = this.validateEmail.bind(this)
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeEmail = this.handleChangeEmail.bind(this)
        this.verifyData = this.verifyData.bind(this)
}

validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

handleChangeName(event){
    this.setState({userData:{...this.state.userData , nameName : event.target.value }})
  }

  handleChangeEmail(event){
    this.setState({userData:{...this.state.userData , email : event.target.value }})
  }

    closeModal = () => {
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: false
        });
        
      }

      verifyData = () => {
        
        
        if(!this.validateEmail(this.state.userData.email)){
          this.setState({allowEmailFormat: false})

          if(this.state.userData.nameName !== ''){
            this.setState({allowName: true})
          }
          
      }

      if(this.state.userData.nameName === ''){
        this.setState({allowName:false})
        if(this.validateEmail(this.state.userData.email)){
          this.setState({allowEmailFormat: true})
        }
        }

        if(this.validateEmail(this.state.userData.email) && this.state.userData.nameName !== ''){
        
            this.props.confOrder(this.state.userData)
            this.setState({allowEmailFormat: true, allowName: true})
            this.closeModal()
        }
    }


    render(){
        return(
            <Modal
     
      show={this.props.showModal}
    size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
        Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      <Row style={{paddingTop:'20px'}}>           
                <Form.Group controlId="formBasicSurname" style={{marginLeft: '30px', width:'35%'}}>
                    <Form.Control type="text" placeholder="name" value={this.state.userData.nameName} 
                    onChange={this.handleChangeName} maxLength='50'  />
                </Form.Group>
                <p style={{float:'right', marginLeft:'5px', color:'red'}}>*</p>
                {this.state.allowName ? null :
                <p className="registerFormStatus" style={{color:'red', marginTop:'1%'}}>The name can not be empty!</p>
                }
                </Row>

                <Row style={{paddingTop:'20px'}}> 
                <Form.Group controlId="formBasicEmail" style={{marginLeft: '30px', width:'35%'}}>
                    <Form.Control type="email" placeholder="e-mail" value={this.state.userData.email} 
                   onChange={this.handleChangeEmail} maxLength='50'  />
                </Form.Group>
                <p style={{float:'right', marginLeft:'5px', color:'red'}}>*</p>
                {this.state.allowEmailFormat ? null :
                <p className="registerFormStatus" style={{color:'red'}}>Email address format error!</p>
                }
                </Row>
                <div style={{marginLeft:'15px'}}>
                <p>You must enter your name and email address to complete your purchase.</p>
                <p>A confirmation email will be delivered to the address provided.</p>
                </div>
      </Modal.Body>
      <Modal.Footer>
      
        <Button onClick={this.closeModal} style={{marginRight:'15px'}}>Back</Button>
        <Button onClick={this.verifyData}>Confirm</Button>
       

      </Modal.Footer>
    </Modal>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return{
      dispatch,
       ...bindActionCreators({ }, dispatch)
  }
  }
  
  const mapStateToProps = state => ({
      showModal: state.posts.showModal
      });
  
  export default connect (mapStateToProps, mapDispatchToProps)(ModalConfirmCart);