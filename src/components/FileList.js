import React, { Component } from 'react'
import DragAndDrop from './DragAndDrop';
import Resizer from 'react-image-file-resizer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ALLOW_ADD_PRODUCT } from '../actions/types';
class FileList extends Component {

constructor(props){
  super(props);

  this.state = {
    file: [],
    newImage:'',
    imageName:''
      }

  this.validateExtension = this.validateExtension.bind(this);
  this.validateSize = this.validateSize.bind(this);
  this.convertImg = this.convertImg.bind(this);
}


 validateExtension = (file) => {
   let validated = false;
  let validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    let fileName = file;
    
    for (var j = 0; j < validFileExtensions.length; j++) {
      let extension = validFileExtensions[j];
      if (fileName.substr(fileName.length - extension.length, extension.length).
      toLowerCase() == extension.toLowerCase()) {
        validated = true;
          break;
      }
  }

  if(!validated){
    return false;
  }
  return true;
  }

  validateSize = (fileSize) => {
    if(fileSize > 2097152) return false;
    return true;
  }

  convertImg = (image) => {

    try{
    Resizer.imageFileResizer(

        image,
        280,
        210,
        'JPG',
        100,
        0,
        uri => {
          this.setState({ newImage: uri})
          localStorage.setItem('image', this.state.newImage)
        },
        'base64',
        100,
        100
    );
  } catch(error){
    console.log(error);
  }
  }

 handleDrop = (files) => {

    let imgFile = this.state.file;
    if (!files[0].name) return
    imgFile.push(files[0].name)
    let valSize = this.validateSize(files[0].size)
    let valExt = this.validateExtension(files[0].name)
    if(valSize && valExt){
      this.convertImg(files[0]);
      this.setState({ imageName: files[0].name })
      this.props.dispatch({
        type: ALLOW_ADD_PRODUCT,
        payload: true
      })

      this.props.allowButtAdd();
    }
     
    this.setState({files: imgFile})
    console.log("image file: " + this.state.file[0])
    imgFile.pop()
    
  }
render() {
    return (
      <DragAndDrop handleDrop={this.handleDrop} imgName={this.state.imageName}>
        
      </DragAndDrop>
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
  allowAddProduct: state.posts.allowAddProduct,
  isLogged: state.posts.isLogged,
  username: state.posts.username
});

export default connect(mapStateToProps,mapDispatchToProps)(FileList);