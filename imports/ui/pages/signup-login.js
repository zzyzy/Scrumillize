import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Accounts } from 'meteor/accounts-base';
import { ReactiveDict } from 'meteor/reactive-dict';

import './signup-login.html';

Template.signUpLogin.onCreated(function () {
  if (Meteor.user())
    Router.go('root');

  this.state = new ReactiveDict();
  this.state.set('mode', Router.current().route.getName());
  this.state.set('error', null);
});

Template.signUpLogin.helpers({
  isRegister () {
    return Template.instance().state.get('mode') == 'register';
  },
  hasError () {
    return Template.instance().state.get('error') !== null;
  },
  errorReason () {
    return Template.instance().state.get('error');
  },
  isSignIn() {
    return Template.instance().state.get('mode') == 'signin';
  }
});

Template.signUpLogin.events({
  'submit .form-signin' (event) {
    event.preventDefault();

    const target = event.target;
    const email = target.email.value;
    const password = target.password.value;

    if (Template.instance().state.get('mode') == 'register') {
      let errorReason = null;
      Accounts.createUser({
        email: email,
        password: password
      }, function (error) {
        if (error) {
          alert(error.reason);
        } else {
          Router.go('root');
        }
      });
      Template.instance().state.set('error', errorReason);
    } else {
      let errorReason = null;
      Meteor.loginWithPassword(email, password, function (error) {
        if (error) {
          alert(error.reason);
        } else {
          Router.go('root');
        }
      });
      Template.instance().state.set('error', errorReason);
    }
  },
  'click .goToRegister' (event) {
    event.preventDefault();
    Template.instance().state.set('mode', 'register');
    Router.go(Template.instance().state.get('mode'));
  },
  'click .goToSignIn' (event) {
    event.preventDefault();
    Template.instance().state.set('mode', 'signin');
    Router.go(Template.instance().state.get('mode'));
  }
});
