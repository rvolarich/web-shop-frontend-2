import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { IS_LOGGED } from '../actions/types';
import FileList from './FileList';

class CheckCenter extends React.Component{

    constructor (props) {
        super(props);
        }

    

    render(){
        return(
            <div>
                <FileList />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLogged: state.posts.isLogged,
    username: state.posts.username
    });

export default connect(mapStateToProps)(CheckCenter);