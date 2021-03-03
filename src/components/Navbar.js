import React from 'react'
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { userSignUp } from '../redux/actions'

class Navbar extends React.Component {

  logOutHandler = (e) => {
    localStorage.removeItem("token")
    this.props.postUser(null)
  }
    render() {
      return (
          <nav>
            <div class="row">
          <h1 class="logo"><a href="#"><NavLink to="/home">Course Matcher</NavLink></a></h1>
          <ul class="main-nav" >
          <li> <a href="#"><NavLink to="/courses" exact>Courses</NavLink></a></li>
          <li><a href="#"><NavLink to="/businesses" exact>Companies</NavLink></a></li>

          {this.props.loggedInUser === null || this.props.loggedInUser === undefined ? <li><a href="#"><NavLink to="/login" exact>Profile</NavLink></a></li> :
          <li><a href="#"><NavLink to={`/users/${this.props.loggedInUser.id}`} exact>Profile</NavLink></a></li> }

          {this.props.loggedInUser != null ? <li onClick={this.logOutHandler}><a href="#"><NavLink to="/login" exact>Logout</NavLink></a></li> :
          <li><a href="#"><NavLink to="/login" exact>Login / Signup</NavLink></a></li>
          }
          </ul>
          </div>
          </nav>
      )
    }
}

const mapStateToProps = (state) => {
  return {
      loggedInUser: state.loggedInUser,
  }
}

const mapDispatchToProps = (dispatch) => {
    return { 
      postUser: (userObj) => dispatch(userSignUp(userObj))
  }
}   

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));