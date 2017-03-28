import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Lazyload, { Pool } from '../src/index.js';
import { defaultImg } from './placehold-img';

console.log(Pool);
Pool.onLoad = function (component) {
    console.log(component.node);
}
class Root extends Component {
    state = {
        recommends: []
    }
    componentDidMount() {
        fetch('/cgi-bin/now/web/user/get_personal_live_rcmd_read?_=0.05668416304943613&bkn=&num=19&tab_id=2', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.setState({
                    recommends: data.result.data
                })
            })
    }
    render() {
        return (
            <div>
                {
                   this.state.recommends.map((recommend) => {
                       return (
                           <Lazyload 
                                className={'item'}
                                key={recommend.hall_room_id} 
                                src={recommend.room_logo_url} 
                                placeholder={defaultImg} 
                            />
                       )
                   })     
                }
            </div>
        )
    }
}

ReactDOM.render(<Root />, document.querySelector("#root"));