import React from 'react';

import "./../../asset/UI/introduction.css"

const Introduction = ()=>{
    return (
        <div className="introduction">
            <div className="time-block">
                <h2 className="heading">Get User Owne Personal Aceess Token</h2>
                <div className="body">
                    <p>Go to Your Github or GitLab account settings and register your token</p>
                    <p>There is document about personal token</p>
                    <p> 
                        <a href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token">Registered Your Github Token</a>
                    </p>
                    <p>
                        <a  href="https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html">Registered Your Gitlab Token</a>
                    </p>
                </div>
            </div>
            <div className="time-block">
                <h2 className="heading">Input Your Token and User Name</h2>
                <div className="body">
                    <p>Click Lock Icon and Input Your Personal Token</p>
                    <p>Make Sure you get your token enough right to login.</p>
                    <ul>
                       <li>get your user info</li>
                       <li>get your repository info</li>
                       <li>create or updatefile to your repository</li>
                    </ul>
                </div>
            </div>
            <div className="time-block">
                <h2 className="heading">Start Your Work</h2>
                <div className="body">
                    <p>After success connect to your account.You can Satrt your work !</p>
                </div>
            </div>
        </div>
    )
}

export default Introduction;