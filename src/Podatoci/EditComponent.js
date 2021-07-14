import React from 'react'
import './../App.css'
import Example from "./Example"

class EditComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
           editedBlogs:this.props.blogs,
            editedBlog: this.props.blog,
            editId: this.props.blog.id,
            editTitle: this.props.blog.title,
            editDescription: this.props.blog.description,
            editAuthor: this.props.blog.author,
        }
        this.handleChange = this.handleChange.bind(this)
        
    }

    handleChange(event) {

        this.setState((prevState) => {
            let propertyName = event.target.name;
            let newState = {
                ...prevState,
            }
            newState.editedBlog[propertyName] = event.target.value;
            return newState;
        })
    }
    closeChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    
    
    editBlog = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/blog/edit_blog`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.editedBlog)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.props.refreshParentBlogs();
                this.props.onClose();
            })
           
    }

    
    render() {
        return (
            <div className='update-form'>
            

                <div className='update-form-positions' key={this.props.blog.id} >
                    <label className='updateFormLabels'>Title: </label>
                    <input className='updateFormInputs' type="text" name="title" value={this.state.editedBlog.title} onChange={this.handleChange} required /><br></br>
                    <label className='updateFormLabels'>Description: </label>
                    <textarea className='update-form-description' type="text" name="description" value={this.state.editedBlog.description} onChange={this.handleChange} required /><br></br>
                    <label className='updateFormLabels'>Author: </label>
                    <input className='updateFormInputs' type="text" name="author" value={this.state.editedBlog.author} onChange={this.handleChange} required /><br></br>
                    <div className='update-form-button-update'>
                        <button className='updateButton' onClick={(e) => {
                            for (let i = 0; i < this.state.editedBlogs.length; i++) {
                                if(this.state.editedBlogs[i].id===this.props.blog.id){
                                    continue;
                                }
                                if (this.state.editedBlogs[i].title === this.state.editedBlog.title) {
                                    alert("Title already exists")
                                    return;
                                }
                            }
                            if (this.state.editedBlog.title === "" || this.state.editedBlog.description === "" || this.state.editedBlog.author === "") {
                                alert("You can't update the blog with empty value")

                            }
                            else {
                                let answer = window.confirm("Do you want to save the changes?")
                                if (answer) {
                                    this.editBlog(e);
                                }
                            }

                        }}>Update</button>
                    </div>   
                </div>
            </div>
            
        )
    }
}
export default EditComponent;