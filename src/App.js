import React from 'react';
import './App.css';
import Navig from './Navig';
import SignUp from './components/SignUp';
import LogIn from './LogIn';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Inventory from './components/Inventory';
import { Provider } from 'react-redux';

import Cart from './Cart';

import store from './store';
import Shop from './Shop';

import Confirm from './components/Confirm';

import Logout from './components/Logout';

import SetLoggedIn from './components/SetLoggedIn';
import Register from './components/Register';
import LoggedOut from './components/LoggedOut';
import MyProfile from './components/MyProfile';

import Goodbye from './components/GoodBye';
import Activation from './components/Activation';
import SessionExpired from './components/SessionExpired';
import RegisterInfo from './components/RegisterInfo';
import Footer from './components/Footer';
import ModalInventory from './components/ModalInventory';
import Home from './components/Home';





var x = 0;

class App extends React.Component{

constructor(props){
  super(props);
  this.state = {
    loggedInStatus: "NOT_LOGGED_IN",
    allowExpired: true
   }
  
  
  this.updateCount = this.updateCount.bind(this);
  
  
}

 clickMe = () => {
  
}

updateCount(){
  console.log("bin in updatecount");
  
  this.setState({count: x});
  
}

  
render(){

  
  
  return (
   <Provider store={store}>
    <Router>
       
    
    <div style={{margin:'auto', width:'100%', height:'150px', backgroundColor:'#447297'}}>
    <h1 style={{color:'white', paddingLeft:'17%', paddingTop:'42px'}}>OneStop-ShipShop</h1>
    </div>
     
    <Navig />
    <SetLoggedIn />
    
    
      <Route path="/" component={Home} exact />
      <Route path="/shop" component={Shop} />
      <Route path="/inv" component={Inventory} />
      <Route path="/cart" component={Cart} />
      <Route path="/profile" component={MyProfile} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={LogIn} />
      <Route path="/confirm" component={Confirm} />
      <Route path="/logout" component={Logout} />
      <Route path="/register" component={Register} />
      <Route path="/loggedout" component={LoggedOut} />
      <Route path="/bye" component={Goodbye} />
      <Route path="/activation" component={Activation} />
      <Route path="/sessionexp" component={SessionExpired} />
      <Route path="/reginfo" component={RegisterInfo} />
      <Route path="/log" component={ModalInventory} />

      <Footer />
    
    
    </Router>
    </Provider>
  );
}
}

export default App;

export function cartChildren(child){
  x = child;
  console.log("been in ex: " + x);
  
}




