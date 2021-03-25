import React from 'react';
import { Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Logout extends React.Component{

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        
        setTimeout(() => {if(this.props.sessionExpired){

            window.location.replace('http://127.0.0.1:3000/sessionexp')
          }
        }, 30)

    }

    handleClick = () => {
        localStorage.removeItem('x_py35');
        fetch('/logout', {
            credentials: 'include',
            method: 'GET'
        }).then(response => response.json())
        .then(data => {
            console.log("logout data: ", data)
        })
        .catch((error) => {
            console.log("error: ", error)
        })
    }

    render(){

        return(

            <div style={{margin:'auto', minHeight:'410px', paddingTop:'90px', textAlign:'center'}}>
               
                    <h3 style={{marginBottom: '20px'}}>Do you really want to logout?</h3>
                    <Button variant="outline-info" href="/loggedout" style={{marginRight: '15px'}} onClick={this.handleClick}>Yes</Button>
                    <Button variant="outline-info" href="/shop" >No</Button>
                
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
      sessionExpired: state.posts.sessionExpired
      });
  
  export default connect (mapStateToProps, mapDispatchToProps)(Logout);