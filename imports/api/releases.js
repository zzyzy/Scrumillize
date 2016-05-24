import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Releases = new Mongo.Collection('releases');

if (Meteor.isServer) {
  Meteor.publish('releases', function () {
    // Publish releases that belongs to the user and project
    return Releases.find({});
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
      status: 'unreleased',
      createdAt: new Date()
      // createdBy
    });
  }
});
