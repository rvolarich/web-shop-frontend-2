import React from 'react';
import { Button, Container } from 'react-bootstrap';

class LoggedOut extends React.Component{

    render(){
        
        
        return(
           
           <div style={{margin:'auto', minHeight:'410px', paddingTop:'90px', textAlign:'center'}}>
                
                <div style={{marginBottom: '20px'}}>
                <h3 >You are logged out!</h3>
                </div>

                <Button variant="outline-secondary"  href="/shop" 
            style={{marginTop:'10px'}}>Continue shopping</Button>
                
               
            </div>
            
            
            
        )
    }
}



export default LoggedOut;