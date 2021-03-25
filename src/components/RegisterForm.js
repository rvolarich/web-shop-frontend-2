import React from 'react';
import { Form, Container, Col, Button, Row } from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import CountrySelect from 'react-bootstrap-country-select';
import axios from 'axios';
import { connect } from 'react-redux';
import { IS_LOGGED, SET_EMAIL } from '../actions/types';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';



let isLog = false;



class RegisterForm extends React.Component{
    
    constructor (props) {
        super(props);
        this.state = { 
            country: '', 
            region: '' ,
            authData : {
                nameName:'',
                surname:'',
                username: '',
                password: '',
                adminAuth: false
           },
           retypePass:'',
           userExists: true,
           allowCheckUserExists : false,
           allowRegisterButton: false,
           allowPassMatch: true,
           allowEmailFormat: true
    
        };
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeSurname = this.handleChangeSurname.bind(this)
        this.handleChangeUsername = this.handleChangeUsername.bind(this)
        this.handleChangePass = this.handleChangePass.bind(this)
        this.handleChangeRetypePass = this.handleChangeRetypePass.bind(this)
        this.validateEmail = this.validateEmail.bind(this)
        this.validatePassword = this.validatePassword.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.postAuthData = this.postAuthData.bind(this)
        this.handleAdminAuth = this.handleAdminAuth.bind(this)
        
      }

      validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validatePassword(str)
{
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return re.test(str);
}

allowRegisterButtonKey(){
    setTimeout(() => {if(this.state.authData.nameName !== '' && this.validatePassword(this.state.authData.password) && 
    this.state.authData.username !== '' && this.state.retypePass !== '' ){
        this.setState({allowRegisterButton: true})
    }
    else{
        this.setState({allowRegisterButton: false})
    }}, 20)
    
}

      handleChangeName(event){
        this.setState({ authData: {...this.state.authData , nameName : event.target.value }});
        this.allowRegisterButtonKey();
      }

      handleChangeSurname(event){
        this.setState({ authData: {...this.state.authData , surname : event.target.value }});
        
    }

    handleChangeUsername(event){        //e-mail
        this.setState({ authData: {...this.state.authData , username : event.target.value }});
        this.allowRegisterButtonKey();
      }

      handleChangePass(event){
          
        this.setState({ authData: {...this.state.authData , password : event.target.value }});
        this.allowRegisterButtonKey();
    }

    handleChangeRetypePass(event){
        this.setState({...this.state, retypePass : event.target.value });
        this.allowRegisterButtonKey();
      }

      handleAdminAuth(event){
        this.setState({authData:{...this.state.authData, adminAuth: event.target.checked}})
      }

      

    postAuthData = () => {
        

        if(!this.validateEmail(this.state.authData.username)){
            this.setState({...this.state, allowEmailFormat: false})
        }

        else if(this.state.authData.password !== this.state.retypePass){
            
            this.setState({...this.state, allowPassMatch: false})
            console.log("registration not verified!")
        }
        
        else if(this.validateEmail(this.state.authData.username) && this.state.authData.password === this.state.retypePass){
            console.log("registration verified!")
            this.setState({...this.state, allowEmailFormat: true, allowPassMatch: true})
            
            axios.post('/reg', 
        this.state.authData).then(function (response){
        console.log("registered: " + response.data);
        this.setState({userExists: response.data, allowCheckUserExists: true});
        }.bind(this));

        this.props.dispatch({
            type: SET_EMAIL,
            payload: this.state.authData.username
        })

        localStorage.setItem('email',this.state.authData.username)
        }
        
        
        
    }

    handleClick = () => {
      
      console.log('Been in register:', this.state.registerForm);
    }
    
     render(){
        
        const { isLogged } = this.props;
        const { userExists } = this.state;
        const { allowCheckUserExists } = this.state;
        

        
        
        return(
            <Container>
                <Row >
                <Col xs={8}>
            <div style={{marginTop: '50px', }}>
                
                <Form>
                <Row > 
                <Form.Group controlId="formBasicName" style={{margin:'0', width:'35%'}}>
                
                    <Form.Control type="text" placeholder="name" onChange={this.handleChangeName} 
                     maxLength='50' value={this.state.authData.nameName} />

                </Form.Group>
                <p style={{float:'right', marginLeft:'5px', color:'red'}}>*</p>
                </Row>

                <Row style={{paddingTop:'20px'}}>           
                <Form.Group controlId="formBasicSurname" style={{margin: '0px', width:'35%'}}>
                    <Form.Control type="text" placeholder="surname" onChange={this.handleChangeSurname} 
                    maxLength='50' value={this.state.authData.surname} />
                </Form.Group>
                </Row>

                <Row style={{paddingTop:'20px'}}> 
                <Form.Group controlId="formBasicEmail" style={{margin: '0px', width:'35%'}}>
                    <Form.Control type="email" placeholder="e-mail" onChange={this.handleChangeUsername} 
                    maxLength='50' value={this.state.authData.username} />
                </Form.Group>
                <p style={{float:'right', marginLeft:'5px', color:'red'}}>*</p>
                {this.state.allowEmailFormat ? null :
                <p className="registerFormStatus" style={{color:'red'}}>Email address format error!</p>
                }
                </Row>

                <Row style={{paddingTop:'20px'}}> 
                <Form.Group controlId="formBasicPassword" style={{margin: '0px', width:'35%'}}>
                <Form.Control type="password" placeholder="password" onChange={this.handleChangePass}
                maxLength='20' minLength='6' value={this.state.authData.password} />
                </Form.Group>
                
                <p style={{float:'right', marginLeft:'5px', color:'red'}}>*</p>
                {this.state.authData.password === '' ?
                <p className="registerFormStatus" style={{color:'gray'}}>Min. 6, max. 20 characters,
                 [A-Z], [a-z], [0-9]</p> : this.validatePassword(this.state.authData.password) ?
                <p className="registerFormStatus" style={{color:'green'}}>Password accepted!</p> : 
                <p className="registerFormStatus" style={{color:'red'}}>Password not accepted!</p>
                }   
                </Row>

                <Row style={{paddingTop:'20px'}}> 
                <Form.Group controlId="formBasicRTPassword" style={{margin: '0px', width:'35%'}}>
                <Form.Control type="password" placeholder="retype password" onChange={this.handleChangeRetypePass}
                maxLength='20' value={this.state.retypePass} />
                </Form.Group>
                <p style={{float:'right', marginLeft:'5px', color:'red'}}>*</p>
                {this.state.allowPassMatch ? null :
                <p className="registerFormStatus" style={{color:'red'}}>Passwords do not match!</p>
                }
               </Row>
                
                </Form>

            
            </div>
            <Row style={{paddingTop:'20px', marginTop:'10px'}}> 
            
            {this.state.allowRegisterButton ?

            <Button  onClick={this.postAuthData} style={{marginTop:'5px', marginBottom:'10px'}}>Register</Button> :
            <Button  onClick={this.postAuthData} style={{marginTop:'5px', marginBottom:'10px'}} disabled>Register</Button>
            }

<Form.Group controlId="formBasicCheckbox">
              
              <Form.Check type="checkbox" label="Give me administrator authority" value="true" 
              onChange={this.handleAdminAuth} style={{marginLeft:'25px', paddingTop:'10px'}} />
              </Form.Group>
            </Row>
            {allowCheckUserExists ? userExists ? window.location.replace("http://127.0.0.1:3000/reginfo") : 
            <div style={{color: 'red', height:'20px', marginBottom:'30px', marginLeft:'-16px'}}>Username not available!</div> :
            <div style={{color: 'red', height:'20px', marginBottom:'30px'}}></div>}
            
            
            </Col>
            
            </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    isLogged: state.posts.isLogged
    });

export default connect(mapStateToProps)(RegisterForm);