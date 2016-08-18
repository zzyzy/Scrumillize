import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Issues } from '../../api/issues.js';

import '../items/issue-item.js';
import './backlog-list.html';

Template.backlogList.helpers({
  issues() {
    return Issues.find({projectId: Template.instance().data._id, sprintId: null});
  },
  issueCount() {
    return Issues.find({projectId: Template.instance().data._id, sprintId: null}).count();
  },
  noIssues() {
    return Issues.find({projectId: Template.instance().data._id, sprintId: null}).count() == 0;
  },
  moreThanOneIssue () {
    return Issues.find({projectId: Template.instance().data._id, sprintId: null}).count() != 1;
  }
});

Template.backlogList.events({
  'submit .newIssue'(event) {
    event.preventDefault();

    const target = event.target;
    const summary = target.summary.value;

    Meteor.call('createNewIssue', summary, Template.instance().data._id);

    target.summary.value = "";
  },
  'click .createSprint' () {
    Meteor.call('createSprint', Template.instance().data._id);
  }
});
