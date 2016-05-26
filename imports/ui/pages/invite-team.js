import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveVar } from 'meteor/reactive-var';

import { Projects } from '../../api/projects';

import './invite-team.html';

Template.inviteTeam.onCreated(function () {
  this.projectId = new ReactiveVar();

  this.autorun(function () {
    Template.instance().projectId.set(Router.current().params.project_id);
  });
});

Template.inviteTeam.helpers({
  users() {
    const project = Projects.findOne({_id: Template.instance().projectId.get()});
    const users = project.users;
    return Meteor.users.find({}, {$in: {_id: users}});
  },
  hasUsers() {
    //TODO project is undefined
    const project = Projects.findOne({_id: Template.instance().projectId.get()});
    console.log(project);
    return project.users.length > 0;
  }
});

Template.inviteTeam.events({
  'submit #createUserInProject' (event) {
    event.preventDefault();
    const target = event.target;
    const email = target.email.value;
    const password = target.password.value;
    Meteor.call('createUserForProject', Template.instance().projectId.get(), email, password);
  }
});
