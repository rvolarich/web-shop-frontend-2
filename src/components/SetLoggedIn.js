import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { IS_LOGGED } from '../actions/types';

class SetLoggedIn extends React.Component{

    constructor (props) {
        super(props);
        }

    componentDidMount(){
        axios.get(`/logged_in?sessionExpired=${this.props.sessionExpired}`, 
        { withCredentials: true })
        .then(response => {
          console.log("logged_in = " + response.data) 
          this.props.dispatch({
            type: IS_LOGGED,
            payload: response.data
        });
        })
        .catch(error => {
          console.log("check login error", error);
        });

        axios.get("/", {withCredentials: true})
        .then(response => {

        }).catch(error => {
          console.log("check session error", error);
        });
        
      }

    render(){

      const { sessionExpired } = this.props;
        return(
            <div>
              
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLogged: state.posts.isLogged,
    username: state.posts.username,
    sessionExpired: state.posts.sessionExpired
    });

export default connect(mapStateToProps)(SetLoggedIn);