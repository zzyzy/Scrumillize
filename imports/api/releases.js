import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Releases = new Mongo.Collection('releases');

if (Meteor.isServer) {
  Meteor.publish('releases', function () {
    return Releases.find({});
  });
}

Meteor.methods({
  'releases.insert'(releaseName, projectId) {
    check(releaseName, String);
    check(projectId, String);

    // Some logic here

    Releases.insert({
      releaseName,
      projectId,
      createdAt: new Date()
      // createdBy
    });
  }
});
