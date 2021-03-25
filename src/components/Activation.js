import React from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { Button } from 'react-bootstrap';
class Activation extends React.Component{

componentDidMount(){
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get('token')
    console.log('token: ' + token)

    axios.get(`/activate?token=${token}`, {withCredentials:true})
}

render(){
    return(
        
        <div style={{margin:'auto', width:'67%', textAlign:'center', minHeight:'410px'}}> 
        <h4 style={{paddingTop:'50px', paddingBottom:'50px'}}>You have successfully activated your account!</h4>

        <Button href="/login">Login</Button>
        </div>
    )
}
    
}

export default Activation