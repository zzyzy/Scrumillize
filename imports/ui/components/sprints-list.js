import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Issues } from '../../api/issues.js';
import { Sprints } from '../../api/sprints.js';

import './sprint-start-form';
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
  },
  isTopSprint() {
    const instanceData = Template.instance().data;
    const projectId = instanceData.projectId;
    const position = instanceData.position;
    const sprint = Sprints.findOne({projectId: projectId, status: null}, {sort: {position: 1}});
    const sprintPosition = sprint.position;
    return position == sprintPosition;
  },
  isLastSprint() {
    const instanceData = Template.instance().data;
    const projectId = instanceData.projectId;
    const position = instanceData.position;
    const sprint = Sprints.findOne({projectId: projectId, status: null}, {sort: {position: -1}});
    const sprintPosition = sprint.position;
    return position == sprintPosition;
  },
  isTheOnlySprint() {
    const projectId = Template.instance().data.projectId;
    return Sprints.find({projectId}).count() === 1;
  },
  isActive() {
    return Template.instance().data.status === true;
  },
  todoCount() {
    if (Issues.find({sprintId: Template.instance().data._id, status: 'todo'}).count() === 0) return 0;
    return Issues.find({sprintId: Template.instance().data._id, status: 'todo'})
      .fetch()
      .map(issue => issue.estimate)
      .reduce((a, b) => a + b);
  },
  inProgressCount() {
    if (Issues.find({ sprintId: Template.instance().data._id, status: 'inprogress' }).count() === 0) return 0;
    return Issues.find({sprintId: Template.instance().data._id, status: 'inprogress'})
      .fetch()
      .map(issue => issue.estimate)
      .reduce((a, b) => a + b);
  },
  doneCount() {
    if (Issues.find({ sprintId: Template.instance().data._id, status: 'done' }).count() === 0) return 0;
    return Issues.find({sprintId: Template.instance().data._id, status: 'done'})
      .fetch()
      .map(issue => issue.estimate)
      .reduce((a, b) => a + b);
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
  },
  'click .moveSprintUp' (event) {
    event.preventDefault();

    Meteor.call('moveSprintUp', Template.instance().data._id, Template.instance().data.projectId);
  },
  'click .moveSprintDown' (event) {
    event.preventDefault();

    Meteor.call('moveSprintDown', Template.instance().data._id, Template.instance().data.projectId);
  }
});
