import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Issues } from './issues.js';

export const Sprints = new Mongo.Collection('sprints');

if (Meteor.isClient) {
  Sprints.deny({
    insert() {
      return true;
    },
    update() {
      return true;
    },
    remove() {
      return true;
    },
  });
}

Meteor.methods({
  'createSprint'(projectId) {
    check(projectId, String);

    const lastSprint = Sprints.findOne({projectId: projectId}, {sort: {position: -1}});
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
      createdBy: Meteor.userId(),
      closedAt: null,
    });
  },
  'startSprint' (sprintId, projectId, sprintName, duration, startDate, endDate) {
    check(sprintId, String);
    check(projectId, String);
    check(sprintName, String);
    check(duration, String);
    check(startDate, Date);
    check(endDate, Date);

    const numberOfActiveSprints = Sprints.find({projectId, status: true}).count();
    if (numberOfActiveSprints > 1) {
      throw new Meteor.Error('There is already an active sprint in project ' + projectId);
    }

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
  'moveSprintUp' (sprintId, projectId) {
    check(sprintId, String);
    check(projectId, String);

    const me = Sprints.findOne({_id: sprintId});
    const myPosition = me.position;
    const target = Sprints.findOne({projectId: projectId, position: {$lt: myPosition}, status: null}, {sort: {position: -1}});
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
  'moveSprintDown' (sprintId, projectId) {
    check(sprintId, String);
    check(projectId, String);
    
    const me = Sprints.findOne({_id: sprintId});
    const myPosition = me.position;
    const target = Sprints.findOne({projectId: projectId, position: {$gt: myPosition}, status: null}, {sort: {position: 1}});
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
  'completeSprint' (sprintId) {
    check(sprintId, String);

    Sprints.update({_id: sprintId}, {$set: {status: false, closedAt: new Date()}});
    Issues.update({sprintId: sprintId, status: {$ne: 'done'}}, {$set: {sprintId: null}});
  }
});
