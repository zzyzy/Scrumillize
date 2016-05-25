import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './app-body.html';

Template.appBody.onCreated(function () {
  console.log(Meteor.user());
  if (!Meteor.user()) {
    // Router.go('signin');
  }
});

Template.appBody.events({
  'click .logout' () {
    event.preventDefault();
    Meteor.logout(function (error) {
      if (error) {
        alert(error.reason);
      } else {
        Router.go('signin');
      }
    });
  }
});
