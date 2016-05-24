import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Issues = new Mongo.Collection('issues');

if (Meteor.isServer) {
  Meteor.publish('issues', function () {
    return Issues.find({});
  });
}

Meteor.methods({
  'issues.insert'(description, projectId) {
    check(description, String);
    check(projectId, String);

    // Some logic here

    Issues.insert({
      description,
      projectId,
      status: 'open',
      releaseId: '',
      sprintId: '',
      createdAt: new Date()
      // createdBy: this.userId
    });
  },
  'moveToRelease'(issueId, releaseId) {
    check(issueId, String);
    check(releaseId, String);

    Issues.update({_id: issueId}, {$set: {releaseId}});
  },
  'moveToSprint'(issueId, sprintId) {
    check(issueId, String);
    check(releaseId, String);

    Issues.update({_id: issueId}, {$set: {sprintId}});
  }
});
