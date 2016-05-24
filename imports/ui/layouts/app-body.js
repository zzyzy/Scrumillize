import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './app-body.html';

Template.appBody.onCreated(function() {
  Meteor.subscribe('projects');
  Meteor.subscribe('issues');
  Meteor.subscribe('releases');
});
