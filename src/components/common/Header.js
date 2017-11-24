import React from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => {
  return (
    <nav>
        <IndexLink to="/regulator" activeClassName="active">Regulator</IndexLink>
        {" | "}
        <Link to="/tollBoothOperator" activeClassName="active">Toll Booth Operator</Link>
        {" | "}
        <Link to="/individualVehicle" activeClassName="active">Individual Vehicle</Link>
        {" | "}
        <Link to="/individualTollBooth" activeClassName="active">Individual Toll Booth</Link>
    </nav>
  );
};

export default Header;
