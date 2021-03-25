import React from 'react';
import ReactDelayRender from 'react-delay-render';

class Footer extends React.Component{

render(){
    return(
        <div style={{margin:'auto', width:'100%', height:'300px', textAlign:'center', backgroundColor:'#447297'}}>
        <h1 style={{paddingTop:'130px', color:'white'}}>OneStop-ShipShop</h1>
        </div>
    )
}
    
}

export default ReactDelayRender({ delay: 250 })(Footer);