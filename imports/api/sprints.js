import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Projects } from './projects.js';
import { Issues } from './issues.js';

export const Sprints = new Mongo.Collection('sprints');

if (Meteor.isServer) {
  Meteor.publish('sprints', function () {
    let projects = [];
    Projects.find({users: this.userId}).forEach(function (project) {
      projects.push(project._id);
    });
    return Sprints.find({projectId: {$in: projects}});
  });
}

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

    Sprints.update({_id: sprintId}, {$set: {sprintName,duration, startDate, endDate, status: 'started'}});
  },
  'deleteSprint' (sprintId) {
    check(sprintId, String);
    
    Issues.update({sprintId: sprintId}, {$set: {sprintId: null}});
    Sprints.remove({_id: sprintId});
  },
  'moveSprint' (sprintId, upDown) {
    check(sprintId, String);
    check(upDown, String);

    const sortOrder = upDown === 'up' ? -1 : 1;
    const me = Sprints.findOne({_id: sprintId});
    const myPosition = me.position;
    const target = Sprints.findOne({position: {$lt: myPosition}}, {sort: {position: sortOrder}});
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
