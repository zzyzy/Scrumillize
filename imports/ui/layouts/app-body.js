import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveVar } from 'meteor/reactive-var';

import { Projects } from '../../api/projects.js';

import './app-body.html';

Template.appBody.onCreated(function () {
  this.projectId = new ReactiveVar();
  this.projectId.set(Router.current().params.project_id);
  this.autorun(function () {
    const projectId = Router.current().params.project_id;
    Template.instance().projectId.set(projectId);
  });
  if (!Meteor.user()) {
    // Router.go('signin');
  }
});

Template.appBody.helpers({
  projectId () {
    return Template.instance().projectId.get();
  },
  isCurrentRoute (name) {
    return name === Router.current().route.getName();
  },
  projectName () {
    const currentProject = Projects.findOne({_id: Template.instance().projectId.get()});
    if (currentProject === null || currentProject === undefined) return '';
    else return currentProject.projectName;
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
