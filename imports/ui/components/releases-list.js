import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Releases } from '../../api/releases.js';

import '../items/release-item.js';
import './releases-list.html';

Template.releasesList.helpers({
  releases() {
    return Releases.find({});
  }
});

Template.releasesList.events({
  'submit .newRelease'(event) {
    event.preventDefault();

    const target = event.target;
    const releaseName = target.releaseName.value;

    Meteor.call('releases.insert', releaseName, Template.instance().data._id);

    target.releaseName.value = "";
  }
});
