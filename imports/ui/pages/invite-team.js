import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';

import { Projects } from '../../api/projects';

import './invite-team.html';

Template.inviteTeam.onCreated(function () {
  this.projectId = new ReactiveVar();

  this.autorun(function () {
    Template.instance().projectId.set(Router.current().params.project_id);
    console.log(Template.instance().projectId.get());
  });
});

Template.inviteTeam.helpers({
  users() {
    const project = Projects.findOne({_id: Template.instance().projectId.get()});
    if (project === null || project === undefined) return;
    return project.users;
  },
  hasUsers() {
    //TODO project is undefined
    const project = Projects.findOne({_id: Template.instance().projectId.get()});
    if (project === null || project === undefined) return false;
    return project.users.length > 0;
  },
  userEmail(userId) {
    const user = Meteor.users.findOne({_id: userId});
    return user.emails[0].address;
  },
  formatDate (date) {
    return moment(date).format('DD/MMM/YY');
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
