import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Issues } from './issues.js';

export const Sprints = new Mongo.Collection('sprints');

if (Meteor.isServer) {
  Meteor.publish('sprints', function () {
    return Sprints.find();
  });
}

Meteor.methods({
  'createSprint'(projectId) {
    check(projectId, String);

    const sprintName = "Sample Sprint " + (Sprints.find().count() + 1);

    Sprints.insert({
      projectId,
      sprintName,
      duration: null,
      startDate: null,
      endDate: null,
      status: null,
      createdAt: new Date()
    });
  },
  'startSprint' (sprintId, sprintName, duration, startDate, endDate) {
    check(sprintId, String);
    check(sprintName, String);
    check(duration, String);
    check(startDate, Date);
    check(endDate, Date);

    Sprints.update({_id: sprintId}, {$set: {sprintName,duration, startDate, endDate, status: 'started'}});
  },
  'deleteSprint' (sprintId) {
    check(sprintId, String);
    
    Issues.update({sprintId: sprintId}, {$set: {sprintId: null}});
    Sprints.remove({_id: sprintId});
  }
});
