import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { clearUser, clearVideo } from '../Redux/Reducers/reducer';
import '../Styles/sideBar.scss'

class SideBar extends Component {
    handleLogout = () => {
        axios.get('/api/logout')
        .then(() => this.props.clearUser())
        .catch(err => console.log(err))
    }

    toAccount = () => {
        // console.log(this.props)
        this.props.clearVideo();
        this.props.history.push('/account');
    }

    toCreate = () => {
        this.props.history.push('/creator')
    }

    render(){
        return (
            <div className='sideBar-page'>
                <button id='create-button' onClick={() => this.toCreate()}> Create </button>
                <button id='account-button' onClick={() => this.toAccount()}> Account </button>
                <button id='logout-button' onClick={() => this.handleLogout()}> Logout </button>
            </div>
        )
    }
}
const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, { clearUser, clearVideo })(withRouter(SideBar));