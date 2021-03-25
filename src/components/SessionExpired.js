import { Button } from 'react-bootstrap';
import React from 'react';


class SessionExpired extends React.Component{



    

render(){
    return(
        <div style={{margin:'auto', minHeight:'410px', paddingTop:'90px', textAlign:'center'}}>
        <h3 style={{marginBottom:'20px'}}>Your session has expired!</h3>
        <br />
        <Button variant="outline-info" href="/login" style={{width:'18%'}}>Login</Button>
        </div>
        
    )
}
    
}

export default SessionExpired