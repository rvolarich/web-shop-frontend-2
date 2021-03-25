import React from 'react';
import { Button } from 'react-bootstrap';


class ContinueShopping extends React.Component{

    render(){
        
        
        return(
            <Button variant="outline-secondary"  href="/shop" 
              style={{marginTop:'30px', marginBottom:'20px', marginLeft:'1%'}}>Continue shopping</Button>
        );
    }
}

export default ContinueShopping;