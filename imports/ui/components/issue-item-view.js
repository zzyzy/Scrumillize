import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Sprints } from '../../api/sprints.js';
import { Releases } from '../../api/releases.js';

import './issue-item-view.html';

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
    return status.charAt(0).toUpperCase() + status.substring(1);
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
    const reporter = Template.instance().data.assignee;
    if (reporter === null || reporter === undefined) return 'None';
    else {
      const user = Meteor.users.findOne({_id: reporter});
      return user.emails[0].address;
    }
  },
  formatDate (date) {
    return moment(date).format('DD/MMM/YY');
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
