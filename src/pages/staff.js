import React from 'react';
import Helmet from 'react-helmet';
import BannerLanding from '../components/BannerLanding/'
import { Redirect } from "react-router-dom"

const Staff = (props) => {
    return(
    !props.location.state?<Redirect to="/"/>:
        <div>
            <Helmet>
                <title>Summer In The Woods</title>
                <meta name="description" content="About Us" />
            </Helmet>
            <BannerLanding bannerClass="contactBanner" />
            <div id="main">
                <div className="inner">
                    To Do
                </div>
            </div>
        </div>
    )
}

export default Staff
