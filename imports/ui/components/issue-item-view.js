import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Releases } from '../../api/releases.js';

import './issue-item-view.html';

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
  releaseName (releaseId) {
    return Releases.findOne({ _id: releaseId }).releaseName;
  }
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
