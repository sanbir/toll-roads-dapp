import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';

import RegulatorPage from './components/regulator/RegulatorPage';
import TollBoothOperatorPage from './components/tollBoothOperator/TollBoothOperatorPage'; //eslint-disable-line import/no-named-as-default


export default (
    <Route path="/" component={App}>
        <IndexRoute component={RegulatorPage} />
        <Route path="regulator" component={RegulatorPage} />
        <Route path="tollBoothOperator" component={TollBoothOperatorPage} />
    </Route>
);
