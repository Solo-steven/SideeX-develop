import React from 'react';
import './asset/loader.css';

export class LoadingWindow extends React.Component{
    constructor(props){
        super(props);
        let circle_number = 20 , circleList=[];
        for(let i=1;i<=circle_number;++i){
            let style = {
                '--i' : i
            }
            circleList.push(<span style={style} key={i}></span>)
        }
        this.state={
            circleList
        }
    }

    render() {
        return (
            <div className='loader-wrap'>
                <div className='loader'>
                    <p className='loader-title'>Login</p>
                    {this.state.circleList}
                </div>
            </div>
        )
    }
}