import { useForkRef } from "@material-ui/core";
import React, { Component } from "react"
import Child from "./EditComponent"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,

} from "react-router-dom";

import EditComponent from "./EditComponent";
import Stylesheet from "./Stylesheets";


class Example extends React.Component {

    constructor(props) {

        super(props);
        this.state = {

            users: [],
            blogs: [],
            blog: null,
            user: null,
            titleFound: [],
            blogText: "",
            title: "",
            description: "",
            author: "",
            id: "",
            name: "",
            firstName: "",
            lastName: "",
            username: "",
            phone: "",
            email: "",
            password: "",
            flag: false,
            editId: "",
            editName: "",
            editUsername: "",

            editEmail: "",
            openEdit: false,
            updateBlog: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.fetchUserData = this.fetchUserData.bind(this);
        // this.fullBlog = this.fullBlog.bind(this)


    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    handleRowChange = (id, title, description, author) => {
        this.setState({
            flag: true,
            editId: id,
            editTitle: title,
            editDescription: description,
            editAuthor: author,

        })
    }

    componentDidMount() {
        this.fetchUserData();
        this.fetchBlogData();
    }





    fetchBlogData = () => {
        fetch(`http://localhost:8080/blog/get_blog`)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    blogs: res
                })
            })
    }

    fetchUserData() {
        let user = localStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
            this.setState({ user });
        }
        fetch('http://localhost:8080/person/get_people')
            .then(response => response.json())
            .then(res => {
                this.setState({ users: res })
            })
            .catch(error => {
                console.log(error)
            })
    }


    login = (email, password) => {


        let userFound = this.state.users ? this.state.users.filter(user => user.email === email) : [];



        if (userFound.length) {
            userFound = userFound[0];
            if (userFound.password === password) {
                console.log(userFound);
                localStorage.setItem("user", JSON.stringify(userFound));
                this.setState({ user: userFound });
                window.location.href = "/blog";
            }
            if (userFound.email === email && userFound.password !== password) {
                alert("Wrong password")
            }


        }
        else {
            if (email && password) {
                alert("Account doesn't exist. Try and register first")
            }
        }






    }


    logout = () => {
        localStorage.removeItem("user");
        this.setState({ user: null })
        localStorage.removeItem("blog")
        this.setState({ blog: null })
        window.location.href = "/";
    }


    addBlog = () => {
        fetch("http://localhost:8080/blog/add_blog", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ title: this.state.title, description: this.state.description, author: this.state.author })
        })
            .then(response => response.json())
            .then(res => {
                this.setState({
                    blogs: res
                })
                window.location.href = "/blog"

            })


    }

    addUser = () => {
        fetch("http://localhost:8080/person/add_person", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ name: this.state.firstName, lastname: this.state.lastName, username: this.state.username, password: this.state.password, email: this.state.email })
        })
            .then(response => response.json())
            .then(res => {

                this.setState({
                    users: res,
                });

            })
    }

    removeBlog = (id) => {
        fetch(`http://localhost:8080/blog/delete_blog?id=${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",

            },
            body: null,

        })
            .then(() => {

                this.fetchBlogData();
            },
                err => {
                    console.error(err);
                })
    }

    removeUser = (id) => {
        fetch(`http://localhost:8080/person/delete_person?id=${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",

            },
            body: null,
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ users: res })
            })

    }

    editUser = () => {
        fetch(`http://localhost:8080/person/edit_person`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                id: this.state.editId,
                name: this.state.editName,
                username: this.state.editUsername,
                phone: this.state.editPhone,
                email: this.state.editEmail

            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ users: res, flag: false })
            })
    }

    editBlog = () => {

        fetch(`http://localhost:8080/blog/edit_blog`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                id: this.state.editId,
                title: this.state.editTitle,
                description: this.state.editDescription,
                author: this.state.author

            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({ blogs: res, flag: false })
            })

    }
    openForm = () => {
        window.location.href = "/bloginfo"
    }

    refreshBlogs = () => {
        this.fetchBlogData();
    }

    changeColor = color => {
        this.setState({ color });
    };
    sendBlogData(res) {
        this.setState({
            blogs: res
        })
    }

    render() {
        return (

            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/bloginfo" >

                            <div className='blog-info'>
                                <div className='header-position'>
                                    <h1 >Create your blog here :)</h1>
                                </div>
                                <div className='blog-info-positions'>
                                    <label className='blogLabels'>Title: </label>
                                    <input className='blogInputs' type="text" name="title" value={this.state.title} onChange={this.handleChange} required /><br></br>
                                    <label className='blogLabels' >Description: </label>
                                    <textarea className="description" type="text" name="description" value={this.state.description} onChange={this.handleChange} required /><br></br>
                                    <label className='blogLabels'>Author: </label>
                                    <input className='blogInputs' type="text" name="author" value={this.state.author} onChange={this.handleChange} required /><br></br>
                                </div>
                                <div className='blog-button-position'>
                                    <button className='saveBlogButton' onClick={(event) => {
                                        event.preventDefault();
                                        for (let i = 0; i < this.state.blogs.length; i++) {
                                            if (this.state.blogs[i].title === this.state.title) {
                                                this.setState({ title: "" })
                                                alert("Title already exists")
                                                return;
                                            }
                                        }
                                        event.preventDefault();
                                        this.setState({
                                            description: this.state.description,
                                            author: this.state.author
                                        })

                                        if (this.state.title === "" || this.state.description === "" || this.state.author === "") {
                                            alert("All fields are required")
                                        }

                                        else {
                                            event.preventDefault();
                                            this.addBlog();
                                        }
                                    }

                                    }>Save</button>
                                </div>
                                <Link to="/blog" className={'link-position'} >Blog</Link>
                            </div>

                        </Route>

                        <Route path="/blog" >


                            <div className='addButtonPosition'>
                                <button className='logInButton' onClick={this.openForm}>Add new blog</button>
                            </div>
                            <div className='blogpost-container'>
                                {this.state.blogs.map((blog) => (
                                    <article className='blogpost' key={blog.id}>
                                        <span style={{ fontSize: '0.7em' }}>Author: {blog.author}</span>
                                        <h2 className='title'>{blog.title}</h2>
                                        <p className='descriptionText' style={{ fontSize: '1em' }}>{blog.description}</p>
                                        <button className='readMoreButton' onClick={(event) => {
                                            event.preventDefault();
                                            this.setState({ openEdit: blog })
                                            console.log("stateInFunction", this.state)
                                        }}
                                        >Read more</button>
                                        <button className={'deleteButton'} onClick={(event) => {
                                            let answer = window.confirm("Are you sure you want to delete this blog?")
                                            if (answer) {
                                                this.removeBlog(blog.id);
                                            }
                                        }}>Delete</button>
                                    </article>
                                ))}

                            </div>
                            <div>
                                <button className='logOutButton' onClick={() => {
                                    let answer = window.confirm("Are you sure you want to log out?")
                                    if (answer) {
                                        this.logout();
                                    }
                                }}>Logout</button>
                            </div>

                            <Blog />

                        </Route>


                        <Route path="/register" >
                            <div className='formLogin'>
                                <form>

                                    <h2 className='registerHeader'>Register</h2>
                                    <input className='registerInputs' type="text" name="firstName" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} required /><br></br>
                                    <input className='registerInputs' type="text" name="lastName" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} required /><br></br>
                                    <input className='registerInputs' type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange} required /><br></br>
                                    <input className='registerInputs' type="text" name="email" placeholder="E-mail" value={this.state.email} onChange={this.handleChange} required /><br></br>
                                    <input className='registerInputs' type='password' name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required /><br></br>

                                    <button className='saveAccButton' onClick={(event) => {
                                        for (let i = 0; i < this.state.users.length; i++) {
                                            if (this.state.users[i].email === this.state.email) {

                                                alert("Email already exists!");
                                                this.setState({ email: "" })
                                                return;
                                            }
                                        }
                                        for (let i = 0; i < this.state.users.length; i++) {
                                            if (this.state.users[i].username === this.state.username) {

                                                alert("Username already exists!");
                                                this.setState({ username: "" })
                                                return;
                                            }
                                        }
                                        event.preventDefault();
                                        this.setState({
                                            firstName: this.state.firstName,
                                            lastName: this.state.lastName,
                                            password: this.state.password,
                                            username: this.state.username
                                        })

                                        if (this.state.firstName === "" || this.state.lastName === "" || this.state.username === ""
                                            || this.state.email === "" || this.state.password === "") {
                                            alert("All fields are required!")
                                        }

                                        else {
                                            alert("Account successfully saved!")
                                            this.addUser();
                                            window.location.href = "/"


                                        }

                                    }


                                    }>Save account</button>
                                </form>
                                <div className='linkToLogin'>
                                    <Link to='/' className='linkColor'>Login</Link>
                                </div>



                            </div>
                        </Route>
                        <Route path="/" >

                            <div className='form-login'>
                                <h1 className='loginHeader'>Fetch</h1>

                                <p className='ele1'>
                                    Join
                                </p>
                                <p className='ele2'> Learn

                                </p>
                                <p className='ele3'>Share</p>


                                <div className='login-inputs'>
                                    <div className='login-form-positions'>
                                        <h2 className='headerLogin'>Log in</h2>

                                        <input className='loginInputs' type="text" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} required /><br></br>
                                        <input className='loginInputs' type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} required /><br></br>

                                        <button className='logInButton' onClick={(event) => {

                                            if (this.state.email === "") {
                                                alert("Please insert email")
                                            }
                                            if (this.state.password === "") {
                                                alert("Please insert password")
                                            }
                                            event.preventDefault();
                                            this.login(this.state.email, this.state.password);
                                        }
                                        }>Log in</button>
                                    </div>

                                    <div className='linkToRegister'>
                                        Don't have an account yet? Try and register here <Link to="/register" className='linkColor'>Register</Link>
                                    </div>

                                </div>


                            </div>

                        </Route>

                    </Switch>
                </div>
                {this.state.openEdit && (
                    <div className='shadow-opened'>
                        <div className='editComponent'>
                            <EditComponent blogs={this.state.blogs} refreshParentBlogs={this.refreshBlogs} blog={this.state.openEdit} onClose={() => {
                                this.setState({
                                    openEdit: false
                                })
                            }} />
                        </div>
                    </div>
                )
                }


            </Router >
        )

    }
}

function Blog() {
    return (
        <div> </div>
    );
}

export default Example;