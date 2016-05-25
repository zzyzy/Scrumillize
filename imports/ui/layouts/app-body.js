import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import './app-body.html';

Template.appBody.onCreated(function () {
  this.projectId = Router.current().params.project_id;
  console.log(Meteor.user());
  if (!Meteor.user()) {
    // Router.go('signin');
  }
});

Template.appBody.helpers({
  projectId () {
    return Template.instance().projectId;
  },
  isCurrentRoute (name) {
    return name === Router.current().route.getName();
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
