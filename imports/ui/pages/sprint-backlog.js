import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Router } from 'meteor/iron:router';

import { Sprints } from '../../api/sprints.js';
import { Issues } from '../../api/issues.js';

import './sprint-backlog.html';

Template.sprintBacklog.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('projectId', Router.current().params.project_id);
  this.state.set('sprintId', null);
  
  this.autorun(function () {
    const instance = Template.instance();
    const activeSprint = Sprints.findOne({projectId: instance.state.get('projectId'), status: true});
    if (activeSprint !== null && activeSprint !== undefined)
      instance.state.set('sprintId', activeSprint._id);
  });
  // this.projectId = Router.current().params.project_id;
  // this.activeSprint = Sprints.findOne({projectId: this.projectId, status: true});
});

Template.sprintBacklog.helpers({
  activeSprintName () {
    const sprintId = Template.instance().state.get('sprintId');
    return Sprints.findOne({_id: sprintId}).sprintName;
  },
  hasActiveSprint () {
    return Sprints.find({projectId: Template.instance().state.get('projectId'), status: true}).count() == 1;
  },
  todoIssues () {
    return Issues.find({sprintId: Template.instance().state.get('sprintId'), status: 'todo'});
  },
  inProgressIssues () {
    return Issues.find({sprintId: Template.instance().state.get('sprintId'), status: 'inprogress'});
  },
  doneIssues () {
    return Issues.find({sprintId: Template.instance().state.get('sprintId'), status: 'done'});
  },
  projectId () {
    return Template.instance().state.get('projectId');
  }
});

Template.sprintBacklog.events({
  'click .setInProgress' () {
    Meteor.call('setInProgress', this._id);
  },
  'click .setTodo' () {
    Meteor.call('setTodo', this._id);
  },
  'click .setDone' () {
    Meteor.call('setDone', this._id);
  }
});
