import React from 'react';
import ReactDOM from 'react-dom'
import './asset/layout.css'

import { User} from './user.js';
import { TokenWindow } from './tokenWindow.js'
import { ControllWindow } from './controllWindow.js'

//  bdda46d89c2596eed6419ab00b814e239968ff61  ;
//  709e75f660ae9030eef5a9f852d0cb23eb15d6ae 權限不足

class App extends React.Component{
    constructor(props){
        super(props);
        this.onChangeToUploadsWindow = this.onChangeToUploadsWindow.bind(this);

        this.state={
            user:new User(),
            page : <TokenWindow FlipToUploadsWindow={this.onChangeToUploadsWindow}></TokenWindow>
        }
    }

    onChangeToUploadsWindow(user_data){
        this.setState({
            user : user_data, 
            page : <ControllWindow user={user_data}></ControllWindow>
        }, ()=>{ console.log('Flip to UploadsWindow')})
    }

    render(){
        return (
            <div className='app'>    
                <div className='main-container'>
                   <div className='main-header'>
                        <div className='main-header-title'>Connect to github</div>
                   </div>
                   <div className="main-body">
                        {this.state.page}
                   </div>
                </div>
            </div>
        );
    }
}

const app=<App/>
ReactDOM.render(app, document.getElementById('root'))