import React from 'react';
import { Button, Modal} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SHOW_MODAL } from '../actions/types';
import { Form, Row, Col, Container } from 'react-bootstrap';
import CountrySelect from 'react-bootstrap-country-select';
import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import axios from 'axios';
import ModalElement from './ModalElement';
import { fetchPosts, getCartQty } from '../actions/postActions';



class MyProfile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userData: {
                nameName:'',
                surname:'',
                username:'',
                password: '',
                address:'',
                zip:'',
                city:'',
                country:''
                },
                retypePass:'',
                allowPassMatch: true,
                allowEmailFormat: true,
                allowName: true,
                allowSubmit: true,
                updateStatus: '',
                allowModalUser: false
                
        }
        this.closeModal = this.closeModal.bind(this)
        this.validatePassword = this.validatePassword.bind(this)
        this.validateEmail = this.validateEmail.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        
    }

    componentDidMount(){

      setTimeout(() => {if(this.props.sessionExpired){

         window.location.replace('http://127.0.0.1:3000/sessionexp')
      }
    }, 500)

    this.props.getCartQty();

      this.setState({retypePass: localStorage.getItem('x_py35'), userData:{...this.state.userData, 
        password: localStorage.getItem('x_py35')}})
      console.log("password: " + this.state.userData.password);
      axios.get('/get/user', { withCredentials:true})
      .then(response => {
        console.log('user: ' + JSON.stringify(response.data))
        
        if(response.data.surname !== null){
          this.setState({userData: {...this.state.userData, surname:response.data.surname}})
          }
        
        if(response.data.address !== null){
          this.setState({userData: {...this.state.userData, address:response.data.address}})
        }

        if(response.data.zip !== null){
          this.setState({userData: {...this.state.userData, zip:response.data.zip}})
        }

        if(response.data.city !== null){
          this.setState({userData: {...this.state.userData, city:response.data.city}})
        }

        if(response.data.country !== null){
          this.setState({userData: {...this.state.userData, country:response.data.country}})
        }
        
        
          this.setState({userData: {...this.state.userData, nameName:response.data.nameName,
          username:response.data.username}})
        
      })
      localStorage.setItem('lastUrl', 'http://127.0.0.1:3000/profile');
      }
      
      validatePassword(str)
      {
          const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
          return re.test(str);
      }

      validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    closeModal = () => {
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: false
        });
        window.location.replace(localStorage.getItem('lastUrl'));
      }

      handleChangeName(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , nameName : event.target.value }});
      }

      handleChangeSurname(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , surname : event.target.value }});
    }

    handleChangeEmail(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , username : event.target.value }});
    }

    handleChangePassword(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , password : event.target.value }});
    }

    handleChangeRetypePassword(event){
      this.setState({...this.state , retypePass : event.target.value, updateStatus:'' });
  }

    handleChangeAddress(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , address : event.target.value }});
    }

    handleChangeZip(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , zip : event.target.value }});
    }

    handleChangeCity(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , city : event.target.value }});
    }

    handleChangeCountry(event){
        this.setState({ updateStatus:'', userData: {...this.state.userData , country : event.target.value }});
    }

    handleDelete(){
      
      this.props.dispatch({
        type: SHOW_MODAL,
        payload: true
      })
    }

    confirmDelete = () => {
      
      axios.get('/user/del',
      {withCredentials:true})
      .then(response => {
        console.log(response)
        this.props.dispatch({
          type: SHOW_MODAL,
          payload: true
        })
        window.location.replace('http://127.0.0.1:3000/bye')
      })
    }

    handleSubmit(event){
        event.preventDefault();
        
        if(!this.validateEmail(this.state.userData.username)){
          this.setState({allowEmailFormat: false})
          if(this.state.userData.password === this.state.retypePass){
            this.setState({allowPassMatch: true})
          }
          if(this.state.userData.nameName !== ''){
            this.setState({allowName: true})
          }
          
      }

      if(this.state.userData.password !== this.state.retypePass){
        console.log("bio u matchu!")
        this.setState({allowPassMatch: false})
        if(this.validateEmail(this.state.userData.username)){
          this.setState({allowEmailFormat: true})
        }
        if(this.state.userData.nameName !== ''){
          this.setState({allowName: true})
        }
      }

      if(this.state.userData.nameName === ''){
        this.setState({allowName:false})
        if(this.validateEmail(this.state.userData.username)){
          this.setState({allowEmailFormat: true})
        }
        if(this.state.userData.password === this.state.retypePass){
          this.setState({allowPassMatch: true})
        }
      }
      
      if(this.validateEmail(this.state.userData.username) && this.state.userData.password === this.state.retypePass &&
          this.state.userData.nameName !== ''){
            this.setState({allowSubmit: false}) 
        axios.put('/users/update', this.state.userData,
        { withCredentials: true })
        .then(response => response.data)
        .then(response => {
          console.log("responseData " + JSON.stringify(response))
          this.setState({updateStatus: response})
          setTimeout(() => {console.log("updateStatus " + this.state.updateStatus)}, 0)
        })
        .catch(error => {
            console.log("error " + error);
        });
        console.log("registration verified!")
        this.setState({...this.state, allowEmailFormat: true, 
          allowPassMatch: true, allowName: true})
          setTimeout(() => {window.location.reload();}, 1000)
      }
      
    }
    render(){
        return(
            <Container>
                
                <Col xs={8}>
            <Form style={{marginTop: '20px'}}>
    <Row>       
    <Form.Group controlId="formGridName" style={{width:'50%'}}>
      <Form.Label>Name</Form.Label>
      <Form.Control type="text" placeholder="" maxLength='50'
      onChange={this.handleChangeName.bind(this)} value={this.state.userData.nameName} />
    </Form.Group>
    <p style={{float:'right', marginLeft:'5px', color:'red', marginTop:'5.3%'}}>*</p>
                {this.state.allowName ? null :
                <p className="registerFormStatus" style={{color:'red', marginTop:'5.3%'}}>Name cannot be empty!</p>
                }
          </Row>
    <Row > 
    <Form.Group  controlId="formGridSurname" style={{width:'50%'}}>
      <Form.Label>Surname</Form.Label>
      <Form.Control type="text" placeholder="" maxLength='50'
      onChange={this.handleChangeSurname.bind(this)} value={this.state.userData.surname} />
    </Form.Group>
    </Row>
  
    <Row style={{padding:'0px'}}>
    <Form.Group  controlId="formGridEmail" style={{width:'50%'}}>
      <Form.Label>Email</Form.Label>
      <Form.Control type="email" placeholder="Enter email" maxLength='50'
      onChange={this.handleChangeEmail.bind(this)} value={this.state.userData.username}/>
    </Form.Group>
    <p style={{float:'right', marginLeft:'5px', color:'red', marginTop:'5%'}}>*</p>
                {this.state.allowEmailFormat ? null :
                <p className="registerFormStatus" 
                style={{color:'red', marginTop:'5.3%'}}>Email address format error!</p>
                }
    </Row>

    <Row>
    <Form.Group  controlId="formGridPassword" style={{width:'50%'}}>
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" maxLength='20'
      onChange={this.handleChangePassword.bind(this)} value={this.state.userData.password}/>
    </Form.Group>
    <p style={{float:'right', marginLeft:'5px', color:'red', marginTop:'5%'}}>*</p>
                {this.state.userData.password === localStorage.getItem('x_py35') ?
                <p className="registerFormStatus" style={{color:'gray', marginTop:'5.3%'}}>Min. 6, max. 20 characters,
                 [A-Z], [a-z], [0-9]</p> : this.validatePassword(this.state.userData.password) ?
                <p className="registerFormStatus" style={{color:'green', marginTop:'5.3%'}}>Password accepted!</p> : 
                <p className="registerFormStatus" style={{color:'red', marginTop:'5.3%'}}>Password not accepted!</p>
                }   
    </Row>

    <Row>
    <Form.Group controlId="formGridRTPassword" style={{width:'50%'}}>
      <Form.Label>Retype password</Form.Label>
      <Form.Control type="password" placeholder="retype password" maxLength='20'
      onChange={this.handleChangeRetypePassword.bind(this)} value={this.state.retypePass}/>
    </Form.Group>
    <p style={{float:'right', marginLeft:'5px', color:'red', marginTop:'5.3%'}}>*</p>
                {this.state.allowPassMatch ? null :
                <p className="registerFormStatus" style={{color:'red', marginTop:'5.3%'}}>Passwords do not match!</p>
                }
    </Row>

    <Row>
  <Form.Group  controlId="formGridAddress1" style={{width:'50%'}}>
    <Form.Label>Address</Form.Label>
    <Form.Control placeholder="" maxLength='100'
    onChange={this.handleChangeAddress.bind(this)} value={this.state.userData.address}/>
  </Form.Group>
  </Row>

  <Row>
  <Form.Group  controlId="formGridZip" style={{width:'50%'}}>
      <Form.Label>Zip</Form.Label>
      <Form.Control onChange={this.handleChangeZip.bind(this)} maxLength='50'
      value={this.state.userData.zip}/>
    </Form.Group>
    </Row>

    <Row>
    <Form.Group  controlId="formGridCity" style={{width:'50%'}}>
      <Form.Label>City</Form.Label>
      <Form.Control onChange={this.handleChangeCity.bind(this)} maxLength='50'
      value={this.state.userData.city}/>
    </Form.Group>
   </Row>

    <Row>
    <Form.Group  controlId="formGridState" style={{width:'50%'}}>
      <Form.Label>State</Form.Label>
      <Form.Control value={this.state.userData.country} maxLength='50'
      onChange={this.handleChangeCountry.bind(this)}/>
      </Form.Group>
    </Row>
    
  

  
<Row>
  <Button variant="primary" type="submit" onClick={this.handleSubmit.bind(this)} style={{marginTop: '10px'}}>
    Submit
  </Button>
  <Button variant="outline-info" onClick={this.handleDelete} 
  style={{marginTop: '10px', marginLeft:'21%'}}>
    Delete account
  </Button>
  </Row>
  <Row style={{border:'none'}}>
    {this.state.updateStatus.charAt(0) === 'S' ? <p style={{paddingTop:'2%', height:'20px', color:'green'}}>
      {this.state.updateStatus}</p> :
    <p style={{paddingTop:'2%', height:'20px', color:'red'}}>{this.state.updateStatus}</p>
  }
  </Row>
<hr></hr>
</Form>
</Col>

<ModalElement handleDelUser={this.confirmDelete}
input='profile' modalTitle='My Profile' modalLine1='Delete the account?' modalLine2='' />

</Container>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return{
      dispatch,
       ...bindActionCreators({ getCartQty }, dispatch)
  }
  }
  
  const mapStateToProps = state => ({
      showModal: state.posts.showModal,
      sessionExpired: state.posts.sessionExpired
      });
  
  export default connect (mapStateToProps, mapDispatchToProps)(MyProfile);