import React from 'react';
import { loadLocalStorage } from '../Cart';
import SignUpForm from './SignUpForm';

class SignUp extends React.Component{

    componentDidMount(){
        loadLocalStorage();
    }

    render(){
        
        
        return(
            <div>
                <SignUpForm />
            </div>
        )
    }
}



export default SignUp;