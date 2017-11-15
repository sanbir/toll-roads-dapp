import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';

import RegulatorPage from './components/regulator/RegulatorPage';
import TollBoothOperatorPage from './components/tollBoothOperator/TollBoothOperatorPage';
import RegistrationPage from './components/registration/RegistrationPage'; //eslint-disable-line import/no-named-as-default


export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="registration" component={RegistrationPage} />
        <Route path="regulator" component={RegulatorPage} />
        <Route path="tollBoothOperator" component={TollBoothOperatorPage} />
    </Route>
);
