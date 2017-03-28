import React, { Component } from 'react';
import Pool from './pool';

class Image extends Component {
    defaultProps = {
        width: 'auto',
        height: 'auto',
        placeholder: '',
        forceShow: false //是否直接显示
    }

    state = {
        visable: false
    }

    getImageUrl = () => {
        let imageUrl = '';

        if(this.props.forceShow) {
            imageUrl = this.props.src; //强制显示
        } else if(this.state.visable) {
            imageUrl = this.props.src ? this.props.src : this.props.placeholder;
        } else {
            imageUrl = this.props.placeholder; 
        }

        if(!imageUrl) {
            console.warn('lazyload src was empty');
        }

        return imageUrl;
    }

    getAttrs = () => {
        const attrs = Object.assign({
            style: {
                backgroundImage: `url(${this.getImageUrl()})`
            }
        }, this.props, {
            ref: (c) => {
                this.node = c;
            }
        });

        return attrs;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.src !== this.props.src) {
            this.state.visable = false;
            Pool.add(this);
        }
    }

    componentDidMount() {
        if(this.props.src) {
            Pool.add(this);
        }
    }

    setVisable(visable) {
        this.setState({
            visable: visable
        });
    }

    render() {

        const attrs = this.getAttrs(this.props);

        return (
            <div {...attrs}></div>
        )
    }
}

export default Image;

exports.Pool = Pool;