import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Issues } from './issues.js';

export const Sprints = new Mongo.Collection('sprints');

Meteor.methods({
  'createSprint'(projectId) {
    check(projectId, String);

    const lastSprint = Sprints.findOne({}, {sort: {position: -1}});
    let lastPosition = 0;
    if (lastSprint !== null && lastSprint !== undefined) lastPosition = lastSprint.position;
    const position = lastPosition + 1;
    const sprintName = "Sample Sprint " + position;

    Sprints.insert({
      projectId,
      sprintName,
      position,
      duration: null,
      startDate: null,
      endDate: null,
      status: null,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });
  },
  'startSprint' (sprintId, sprintName, duration, startDate, endDate) {
    check(sprintId, String);
    check(sprintName, String);
    check(duration, String);
    check(startDate, Date);
    check(endDate, Date);

    Sprints.update({_id: sprintId}, {$set: {
      sprintName,
      duration,
      startDate,
      endDate,
      status: true
    }});
  },
  'deleteSprint' (sprintId) {
    check(sprintId, String);
    
    Issues.update({sprintId: sprintId}, {$set: {sprintId: null}});
    Sprints.remove({_id: sprintId});
  },
  'moveSprintUp' (sprintId) {
    check(sprintId, String);

    const me = Sprints.findOne({_id: sprintId});
    const myPosition = me.position;
    const target = Sprints.findOne({position: {$lt: myPosition}, status: null}, {sort: {position: -1}});
    const myNewPosition = target.position;
    const targetNewPosition = myPosition;

    // Update my position to before my position
    Sprints.update({_id: me._id}, {$set: {
      position: myNewPosition
    }});
    Sprints.update({_id: target._id}, {$set: {
      position: targetNewPosition
    }});
  },
  'moveSprintDown' (sprintId) {
    check(sprintId, String);
    
    const me = Sprints.findOne({_id: sprintId});
    const myPosition = me.position;
    const target = Sprints.findOne({position: {$gt: myPosition}, status: null}, {sort: {position: 1}});
    const myNewPosition = target.position;
    const targetNewPosition = myPosition;

    // Update my position to before my position
    Sprints.update({_id: me._id}, {$set: {
      position: myNewPosition
    }});
    Sprints.update({_id: target._id}, {$set: {
      position: targetNewPosition
    }});
  }
});
