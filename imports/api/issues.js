import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Projects } from './projects.js';

export const Issues = new Mongo.Collection('issues');

if (Meteor.isServer) {
  Meteor.publish('issues', function () {
    let projects = [];
    Projects.find({users: this.userId}).forEach(function (project) {
      projects.push(project._id);
    });
    return Issues.find({projectId: {$in: projects}});
  });
}

Meteor.methods({
  'createNewIssue'(summary, projectId) {
    check(summary, String);
    check(projectId, String);

    const projectName = Projects.findOne({_id: projectId}).projectName;
    const issueCount = Issues.find().count() + 1;
    const key = projectName.substring(0, 5).toUpperCase() + "-" + issueCount;

    Issues.insert({
      summary,
      projectId,
      key,
      releaseId: null,
      estimate: 0,
      sprintId: null,
      epicId: null,
      description: null,
      type: 'story',
      priority: 'medium',
      affectedVersion: null,
      status: 'todo',
      resolution: null,
      assignee: null,
      reporter: Meteor.userId(),
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
  },
  'createNewIssueInSprint' (summary, projectId, sprintId) {
    check(summary, String);
    check(projectId, String);
    check(sprintId, String);

    const projectName = Projects.findOne({_id: projectId}).projectName;
    const issueCount = Issues.find().count() + 1;
    const key = projectName.substring(0, 5).toUpperCase() + "-" + issueCount;

    Issues.insert({
      summary,
      projectId,
      key,
      releaseId: null,
      estimate: 0,
      sprintId,
      epicId: null,
      description: null,
      type: 'story',
      priority: 'medium',
      affectedVersion: null,
      status: 'todo',
      resolution: null,
      assignee: null,
      reporter: Meteor.userId(), // this.userId
      createdAt: new Date(),
      lastModified: new Date()
    });
  }
});
