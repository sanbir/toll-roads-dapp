import React from 'react';
import { Link, IndexLink } from 'react-router';
import LoadingDots from './LoadingDots';

const Header = ({loading}) => {
  return (
    <nav>
      <IndexLink to="/" activeClassName="active">Home</IndexLink>
      {" | "}
      <Link to="/registration" activeClassName="active">Registration</Link>
        {" | "}
        <Link to="/regulator" activeClassName="active">Regulator</Link>
    </nav>
  );
};

export default Header;
