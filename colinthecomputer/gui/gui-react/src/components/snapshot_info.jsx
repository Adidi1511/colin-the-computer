import React, { Component } from 'react';
import Loading from './loading';
import Pose from './pose';
import Image from './image';
import Feelings from './feelings';
import {Link} from "react-router-dom";
import _ from 'lodash';

const API_ROOT = "http://127.0.0.1:8000"

class SnapshotInfo extends Component {
  state = {loaded: null, user_id: null, datetime: null, snapshot_id: null, results: null}

  renderField(field, component) {
    console.log(field, this.state.results, this.state.results.includes(field));
    if (!this.state.results.includes(field)) {
      return (
        <div class="m-2 container" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <div class="jumbotron" style={{display: 'flex',  justifyContent:'center', alignItems:'center', width:'42vh', height: '40vh'}}>
            <p class="text-center"> {`${field.replace("_", " ")} is not available`} </p>
          </div>
        </div>
        );
    }
    return (
      <div class="m-2 container" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        {component}
      </div>
      );
  }

  renderNav(direction) {
    var snapshots = this.props.location.state.snapshots;
    var index = Number(this.props.location.state.index);
    var toIndex, arrow;
    if (direction == "prev") {
      toIndex = index - 1;
      arrow = "/arrows/left.PNG";
    }
    else if (direction == "next") {
      toIndex = index + 1;
      arrow = "/arrows/right.PNG";
    }

    if (toIndex < 0 || toIndex > snapshots.length) {
      return (<a/>);
    }

    return (
      <div class="container" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <Link to={{
            pathname: `${snapshots[toIndex].snapshot_id}`,
            state: {
              snapshots: snapshots,
              index: toIndex
            }
          }}>
          <img src={arrow} alt={direction} title={direction} width="40px"/>
        </Link>
      </div>
      );
  }



  render() {
    if (!this.state.loaded) {
      return (
        <Loading />
        );
    }
    //console.log(this.state, index)
    //console.log(snapshots, index+1, index, snapshots[index+1])
    return (
      <div class="mt-3 container" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div class="col">
          {this.renderNav("prev")}
        </div>
        <div class="col">
          <div class="row">
              {this.renderField("pose", <Pose user_id={this.state.user_id} snapshot_id={this.state.snapshot_id}/>)}
          </div>
          <div class="row">
              {this.renderField("feelings", <Feelings user_id={this.state.user_id} snapshot_id={this.state.snapshot_id}/>)}
          </div>
        </div>
        <div class="col">
          <div class="row">
            {this.renderField("color_image", <Image user_id={this.state.user_id} snapshot_id={this.state.snapshot_id} type='color_image'/>)}
          </div>
          <div class="row">
            {this.renderField("depth_image", <Image user_id={this.state.user_id} snapshot_id={this.state.snapshot_id} type='depth_image'/>)}
          </div>
        </div>
        <div class="col">
          <div class="container" style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            {this.renderNav("next")}
          </div>
        </div>
      </div>
      );
  }

  fetch_results = (results) => {
    var fetched_results = {};
    for (var i = 0; i < results.length; i++) {
      fetched_results[results[i]] = this.fetch_result(results[i]);
    }
    return fetched_results;
  }

  componentDidMount = () => {
    // console.log(this.props);
    var user_id = this.props.match.params.user_id;
    var snapshot_id = this.props.match.params.snapshot_id;
    fetch(API_ROOT + '/users/' + user_id + '/snapshots/' + snapshot_id, {
      method: 'GET',
      mode:'cors',
      dataType: 'json'
    })
    .then(response => {
      if (!response.ok) {
        console.log(response);
        throw Error(response.statusText);
      }
      return response;
    })
    .then(response => response.json())
    .then(data => {
      this.state.user_id = user_id;
      this.state.snapshot_id = snapshot_id;
      console.log(data);
      this.setState({loaded: true,
                    user_id: user_id,
                    datetime: data.datetime,
                    snapshot_id: snapshot_id, 
                    results: data.results});
      
    })
    .catch(error => {
      console.log(error); // todo
    });
  }
}


export default SnapshotInfo;