import React from 'react';
import ReactDOM from 'react-dom';
import MainSelect from './component/MainSelect';

class App extends React.Component{
    render(){
        return(
            <MainSelect/>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));