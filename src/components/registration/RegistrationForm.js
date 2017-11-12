import React from 'react';
import TextInput from '../common/TextInput';

const RegistrationForm = ({user, onSave, onChange, saving, errors}) => {
  return (
    <form>
      <h1>Register User</h1>
      <TextInput
        name="email"
        label="Email"
        value={user.email}
        onChange={onChange}
        error={errors.email}/>

      <TextInput
        name="phoneNumber"
        label="Phone Number"
        value={user.phoneNumber}
        onChange={onChange}
        error={errors.phoneNumber}/>

      <TextInput
      name="password"
      label="Password"
      type = "password"
      value={user.password}
      onChange={onChange}
      error={errors.password}/>

      <TextInput
      name="confirmPassword"
      label="Confirm password"
      type = "password"
      value={user.confirmPassword}
      onChange={onChange}
      error={errors.confirmPassword}/>

      <button
        className="btn btn-primary"
        onClick={onSave}></button>
    </form>
  );
};

RegistrationForm.propTypes = {
  user: React.PropTypes.object.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  saving: React.PropTypes.bool,
  errors: React.PropTypes.object
};

export default RegistrationForm;
