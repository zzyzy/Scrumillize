import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Issues = new Mongo.Collection('issues');

if (Meteor.isServer) {
  Meteor.publish('issues', function () {
    return Issues.find();
  });
}

Meteor.methods({
  'createNewIssue'(summary, projectId) {
    check(summary, String);
    check(projectId, String);

    Issues.insert({
      summary,
      projectId,
      releaseId: 'None',
      estimate: 'Unestimated',
      sprintId: 'None',
      epicId: 'None',
      description: 'None',
      type: 'Story',
      priority: 'Medium',
      affectedVersion: 'None',
      status: 'Todo',
      resolution: 'Unresolved',
      assignee: 'Unassigned',
      reporter: '', // this.userId
      createdAt: new Date(),
      lastModified: new Date()
    });
  },
  'moveToRelease'(issueId, releaseId) {
    check(issueId, String);
    check(releaseId, String);

    Issues.update({_id: issueId}, {$set: {releaseId: releaseId}});
  },
  'moveToSprint'(issueId, sprintId) {
    check(issueId, String);
    check(sprintId, String);

    Issues.update({_id: issueId}, {$set: {sprintId}});
  }
});
