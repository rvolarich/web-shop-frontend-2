import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap';
import { Container, Nav, Row,
        Navbar} from 'react-bootstrap';
import { render } from '@testing-library/react';
import { connect } from 'react-redux';
import { getCartQty } from './actions/postActions';
import { SHOW_MODAL } from './actions/types';
import ModalInventory from './components/ModalInventory';

class Navig extends React.Component{
  
  showModal(){
    this.props.dispatch({
      type: SHOW_MODAL,
      payload: true
    })
  }
    
  one = 1;
  navStyle = {
    color: 'white'
  };
  render(){
    const { count, isLogged, username } = this.props;
  return (
    

    <div style={{margin:'auto', width:'100%'}}>
    
    <Navbar bg="light" variant="light">
     <Nav className="mr-auto" style={{paddingLeft:'16.2%'}}>
     <Nav.Link href="/" >Home</Nav.Link>
      <Nav.Link href="/shop" >Shop</Nav.Link>
      <Nav.Link {... this.props.isLogged && this.props.adminLogged ? {href: '/inv'} : {href: '/log'} } >Inventory</Nav.Link>
  <Nav.Link href="/cart">Cart <span style={{color: 'green'}}>{count === 0 ? null : count}</span></Nav.Link>
      
      {isLogged ? <Nav.Link href="/logout">Logout</Nav.Link> : <Nav.Link href="/login">Login</Nav.Link>}
      {isLogged ? <Nav.Link href="/profile">My Profile</Nav.Link> : null}
      {isLogged ? <div style={{marginLeft: '11px', marginTop: '8px', color: 'gray'}}>Welcome, {username}</div> : null}
    </Nav>
    </Navbar>

  </div>
    
  );
  }
}
const mapStateToProps = state => ({
  count: state.posts.count,
  isLogged: state.posts.isLogged,
  adminLogged: state.posts.adminLogged,
  username: state.posts.username
});

export default connect(mapStateToProps)(Navig);