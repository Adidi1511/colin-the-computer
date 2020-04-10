import React, { Component } from 'react';
import Loading from './loading'

const API_ROOT = "http://127.0.0.1:8000"

class Users extends Component {
  state = {users: null}
  render() {
    if (!this.state.users) {
      return (
        <Loading />
        );
    }

    return (
      <div>
        <nav class="navbar navbar-light bg-light">
          <a class="navbar-brand" href="#">
            <img src="/docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30" class="d-inline-block align-top" alt=""/>
            Bootstrap
          </a>
        </nav>
      <div class='jumbotron' style={{display: 'flex', height: '100vh'}}>
        <div class="col text-center">
          <h2>Users</h2>
          <div class="list-groups">
            {this.state.users.map(user =>
              (<a href={'/users/' + user.user_id} class="list-group-item list-group-item-action" key={user.user_id}>
                <img src="/icons/user.PNG" alt="" width="45px"/>
                {" "} {user.user_id} {user.username}
                </a>))}
          </div>
        </div>
      </div>
      </div>
      );
  }

  componentDidMount = () => {
    fetch(API_ROOT + '/users', {
      method: 'GET',
      mode:'cors',
      dataType: 'json'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({users: data});
    });
  }
}
export default Users;