import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Projects } from './projects.js';

export const Issues = new Mongo.Collection('issues');

Meteor.methods({
  'createNewIssue'(summary, projectId) {
    check(summary, String);
    check(projectId, String);

    const projectName = Projects.findOne({_id: projectId}).projectName;
    const lastIssue = Issues.findOne({projectId: projectId}, {sort: {position: -1}});
    let lastPosition = 0;
    if (lastIssue !== null && lastIssue !== undefined) lastPosition = lastIssue.position;
    const position = lastPosition + 1;
    const key = projectName.substring(0, 5).toUpperCase() + "-" + position;

    Issues.insert({
      summary,
      projectId,
      key,
      position,
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
      lastModified: new Date(),
      finishedAt: null,
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
    const lastIssue = Issues.findOne({projectId: projectId}, {sort: {position: -1}});
    let lastPosition = 0;
    if (lastIssue !== null && lastIssue !== undefined) lastPosition = lastIssue.position;
    const position = lastPosition + 1;
    const key = projectName.substring(0, 5).toUpperCase() + "-" + position;

    Issues.insert({
      summary,
      projectId,
      key,
      position,
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
      lastModified: new Date(),
      finishedAt: null,
    });
  }
});
