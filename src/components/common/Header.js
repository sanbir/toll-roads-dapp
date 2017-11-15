import React from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => {
  return (
    <nav>
      <IndexLink to="/" activeClassName="active">Home</IndexLink>
      {" | "}
      <Link to="/registration" activeClassName="active">Registration</Link>
        {" | "}
        <Link to="/regulator" activeClassName="active">Regulator</Link>
        {" | "}
        <Link to="/tollBoothOperator" activeClassName="active">Toll Booth Operator</Link>
    </nav>
  );
};

export default Header;
