import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Projects } from './projects.js';

export const Releases = new Mongo.Collection('releases');

if (Meteor.isServer) {
  Meteor.publish('releases', function () {
    let projects = [];
    Projects.find({users: this.userId}).forEach(function (project) {
      projects.push(project._id);
    });
    return Releases.find({projectId : {$in: projects}});
  });
}

Meteor.methods({
  'releases.insert'(projectId, releaseName, description, startDate, endDate) {
    check(projectId, String);
    check(releaseName, String);
    check(description, String);
    check(startDate, Date);
    check(endDate, Date);

    // Some logic here

    Releases.insert({
      projectId,
      releaseName,
      description,
      startDate,
      endDate,
      status: null,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });
  }
});
