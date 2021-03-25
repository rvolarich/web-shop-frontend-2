import React from 'react';
import { Button, Modal} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SHOW_MODAL } from '../actions/types';

class ModalInventory extends React.Component{

    constructor(props){
        super(props);
        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)
        this.redirect = this.redirect.bind(this)
    }

    componentDidMount(){
    
        this.showModal();
       
       
    }

    redirect = () => {
        localStorage.setItem('lastUrl', 'http://127.0.0.1:3000/inv')
    }

    closeModal = () => {
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: false
        });
        
        window.location.replace(localStorage.getItem('lastUrl'));
    
      }

      showModal = () => {
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: true
        });
      }
      

    render(){
        return(
            <div style={{margin:'auto', minHeight:'410px'}}>
            <Modal
     
      show={this.props.showModal}
    size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
        Info
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <p>
        In order to use the resorce you must be logged in with an administrator account!
        </p>
        <p>
       You can create one by selecting "Give me administrator authority" option while signing up!
        </p>
      </Modal.Body>
      <Modal.Footer>

        
        <Button onClick={this.closeModal} style={{marginRight:'15px'}}>Back</Button>
        <Button href="/login" onClick={this.redirect}>Login</Button>
        

      </Modal.Footer>
    </Modal>
    </div>
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
      showModal: state.posts.showModal,
      isLogged: state.posts.isLogged,
      adminLogged: state.posts.adminLogged 
      });
  
  export default connect (mapStateToProps, mapDispatchToProps)(ModalInventory);