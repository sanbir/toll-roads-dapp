import React, {PropTypes} from 'react';
import RegistrationForm from './RegistrationForm';

export class RegistrationPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      user: Object.assign({}, props.user),
      errors: {},
      saving: false
    };

    this.updateUserState = this.updateUserState.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.id != nextProps.user.id) {
      // Necessary to populate form when existing course is loaded directly.
      this.setState({user: Object.assign({}, nextProps.user)});
    }
  }

  updateUserState(event) {
    const field = event.target.name;
    let user = this.state.user;
    user[field] = event.target.value;
    return this.setState({user});
  }

  userFormIsValid() {
    let formIsValid = true;
    let errors = {};
    let user = this.state.user;
    if (user.phoneNumber.length < 5) {
      errors.phoneNumber = 'phoneNumber must be at least 5 characters.';
      formIsValid = false;
    }
    if (user.password != user.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
      formIsValid = false;
    }
    if (user.password.length < 6) {
      errors.password = 'Password is too short.';
      formIsValid = false;
    }
    this.setState({errors: errors});
    return formIsValid;
  }


  saveUser(event) {
    event.preventDefault();

    if (!this.userFormIsValid()) {
      return;
    }

    this.setState({saving: true});

    this.props.actions.saveUser(this.state.user)
      .then(() => this.redirect())
      .catch(error => {
        this.setState({saving: false});
      });
  }

  redirect() {
    this.setState({saving: false});
    this.context.router.push('/home');
  }

  render() {
    return (
      <div>
        <h1>Registration</h1>
        <p>This application uses React, Redux, React Router and a variety of other helpful libraries.</p>
        <RegistrationForm
          onChange={this.updateUserState}
          onSave={this.saveUser}
          user={this.state.user}
          errors={this.state.errors}
          saving={this.state.saving}
        />
      </div>
    );
  }
}

//Pull in the React Router context so router is available on this.context.router.
RegistrationPage.contextTypes = {
  router: PropTypes.object
};

export default RegistrationPage
