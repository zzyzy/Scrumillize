import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Issues } from '../../api/issues.js';

import '../items/issue-item.js';
import './sprints-list.html';

Template.sprintsList.onCreated(function () {
  this.projectId = Router.current().params.project_id;
});

Template.sprintsList.helpers({
  issues () {
    return Issues.find({ sprintId: Template.instance().data._id });
  },
  issueCount () {
    return Issues.find({ sprintId: Template.instance().data._id }).count();
  },
  noIssues () {
    return Issues.find({ sprintId: Template.instance().data._id }).count() == 0;
  },
  estimate () {
    if (Issues.find({ sprintId: Template.instance().data._id }).count() == 0) return 0;
    return Issues.find({ sprintId: Template.instance().data._id })
      .fetch()
      .map(issue => issue.estimate)
      .reduce((a, b) => a + b);
  },
  moreThanOneIssue () {
    return Issues.find({ sprintId: Template.instance().data._id }).count() != 1;
  }
});

Template.sprintsList.events({
  'submit .newIssue'(event) {
    event.preventDefault();

    const target = event.target;
    const summary = target.summary.value;

    Meteor.call('createNewIssueInSprint', summary, Template.instance().projectId, Template.instance().data._id);

    target.summary.value = "";
  },
  'click .deleteSprint' () {
    Meteor.call('deleteSprint', Template.instance().data._id);
  }
});
