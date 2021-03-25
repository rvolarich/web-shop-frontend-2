import React, { Component } from 'react';
import '../App.css';

let dragCounterVar = 0;
let imgUploaded = false;
class DragAndDrop extends Component {
  state = {
    drag: false,
    newImage:''
  }
  dropRef = React.createRef()
  handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterVar++;
    console.log("dragIn dragCounterVar " + dragCounterVar)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({drag: true})
    }
  }
  handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterVar--;
    console.log("dragOut dragCountervar " + dragCounterVar)
    console.log("been in dragOut")
    if (dragCounterVar === 0) {
    console.log("dragOut state " + this.state.drag)
      this.setState({drag: false})
    }
    
  }
  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({drag: false})
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files)
      e.dataTransfer.clearData()
      dragCounterVar = 0
      imgUploaded = true;    
    }
  }
  componentDidMount() {
    imgUploaded = false;
    let div = this.dropRef.current
    div.addEventListener('dragenter', this.handleDragIn)
    div.addEventListener('dragleave', this.handleDragOut)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop)
  }
  componentWillUnmount() {
    let div = this.dropRef.current
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }
  render() {
    return (
        
        
     <div style={{ width: '100%', height: '200px'}}>


{this.state.drag ?
        <div ref={this.dropRef} className="dropHereDashed" style={{ float:'left', height:'200px' }}>
            <div style={{ marginTop:'60px' }}>
              <h2 style={{ opacity:'0.8'}}>:)</h2>
           </div>   
        </div>
          :
        <div ref={this.dropRef} className="dropHere" style={{ float:'left', height:'200px', 
        border:'1px dashed', opacity:'0.7' }}>
          <div style={{ marginTop:'55px' }}>
            <p>Drop the product </p><br />
            <p>image here!</p>
          </div>   
        </div>
  }



        <div className="dropHere" >
          
        {imgUploaded ? <img src={'images/img_icon.png'} style={{width: '50%', marginTop:'30px'}}alt=""></img> : 
        <p style={{fontSize:'15px', color: 'black', opacity:'.65', marginTop:'50px'}}>
          Max image size 2MB.<br /><br />Allowed file formats:<br />
        .jpg, .jpeg, .bmp, .gif, .png</p>}
         <div style={{width:'200px', overflow:'hidden', wordBreak:'break-all', whiteSpace:'normal', margin:'auto'}}>
           <p>{this.props.imgName}</p>
           </div>
        </div> 
        {this.props.children}
      </div>     
         
       
      
    )
  }
}
export default DragAndDrop