import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Sprints } from '../../api/sprints.js';
import { Releases } from '../../api/releases.js';

import './issue-item-view.html';

Template.issueItemView.onCreated(function () {
  this.commentMode = new ReactiveVar();
  this.commentMode.set(false);
});

Template.issueItemView.helpers({
  releaseName (releaseId) {
    const release = Releases.findOne({_id: releaseId});
    if (release === null || release === undefined) return 'None';
    else return release.releaseName;
  },
  getType () {
    const type = Template.instance().data.type;
    return type.charAt(0).toUpperCase() + type.substring(1);
  },
  getStatus () {
    const status = Template.instance().data.status;
    return status.toUpperCase();
  },
  getPriority () {
    const priority = Template.instance().data.priority;
    return priority.charAt(0).toUpperCase() + priority.substring(1);
  },
  getResolution() {
    const resolution = Template.instance().data.resolution;
    if (resolution === false) return 'Unresolved';
    else return 'Done';
  },
  sprintName (sprintId) {
    const sprint = Sprints.findOne({_id: sprintId});
    if (sprint === null || sprint === undefined) return 'None';
    else return sprint.sprintName;
  },
  getAssignee () {
    const assignee = Template.instance().data.assignee;
    if (assignee === null || assignee === undefined) return 'Unassigned';
    else {
      const user = Meteor.users.findOne({_id: assignee});
      return user.emails[0].address;
    }
  },
  getReporter () {
    const reporter = Template.instance().data.reporter;
    if (reporter === null || reporter === undefined) return 'None';
    else {
      const user = Meteor.users.findOne({_id: reporter});
      return user.emails[0].address;
    }
  },
  formatDate (date) {
    return moment(date).format('DD/MMM/YY');
  },
  ifHasComments () {
    return Template.instance().data.comments.length > 0;
  },
  ifCommentMode () {
    return Template.instance().commentMode.get() === true;
  }
});

Template.issueItemView.events({
  'click #editIssue' () {

  },
  'click #commentIssue' () {

  },
  'click #assignIssue' () {

  },
  'click #deleteIssue' () {
    Meteor.call('deleteIssue', Template.instance().data._id);
  },
  'click #setTodo' () {
    Meteor.call('setTodo', Template.instance().data._id);
  },
  'click #setInProgress' () {
    Meteor.call('setInProgress', Template.instance().data._id);
  },
  'click #setDone' () {
    Meteor.call('setDone', Template.instance().data._id);
  },
  'click #setToStory' () {
    Meteor.call('setIssueToStory', Template.instance().data._id);
  },
  'click #setToTask' () {
    Meteor.call('setIssueToTask', Template.instance().data._id);
  },
  'click #setToEpic' () {
    Meteor.call('setIssueToEpic', Template.instance().data._id);
  },
  'click #setToBug' () {
    Meteor.call('setIssueToBug', Template.instance().data._id);
  },
  'click #setPriorityHighest' () {
    Meteor.call('setIssuePriorityHighest', Template.instance().data._id);
  },
  'click #setPriorityHigh' () {
    Meteor.call('setIssuePriorityHigh', Template.instance().data._id);
  },
  'click #setPriorityMedium' () {
    Meteor.call('setIssuePriorityMedium', Template.instance().data._id);
  },
  'click #setPriorityLow' () {
    Meteor.call('setIssuePriorityLow', Template.instance().data._id);
  },
  'click #setPriorityLowest' () {
    Meteor.call('setIssuePriorityLowest', Template.instance().data._id);
  },
  'change #storyPoints' (event) {
    const target = event.target;
    const estimate = target.value;
    Meteor.call('setEstimate', Template.instance().data._id, estimate);
  },
  'click #gotoCommentMode' (event) {
    const instance = Template.instance();
    instance.commentMode.set(true);
  },
  'click #addComment' (event) {
    const instance = Template.instance();
    const textarea = instance.$('#comment');
    const comment = textarea.val();
    Meteor.call('addComment', instance.data._id, comment);
    instance.commentMode.set(false);
  },
  'click #cancelComment'() {
    Template.instance().commentMode.set(false);
  },
  'change #description' (event) {
    const instance = Template.instance();
    const target = event.target;
    const value = event.target.value;
    Meteor.call('setDescription', instance.data._id, value);
  }
});

Template.addToReleaseModal.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('chosenRelease', this.data.releaseId);
});

Template.addToReleaseModal.helpers({
  releases () {
    return Releases.find();
  },
  isChosenRelease (releaseId) {
    return Template.instance().state.get('chosenRelease') === releaseId;
  },
});

Template.addToReleaseModal.events({
  'click .chooseRelease' () {
    Template.instance().state.set('chosenRelease', this._id);
  },
  'click .confirmRelease' () {
    Meteor.call('moveToRelease', Template.instance().data._id, Template.instance().state.get('chosenRelease'));
  },
  'click .openReleaseChooser' () {
    Template.instance().state.set('chosenRelease', Template.instance().data.releaseId);
  }
});
