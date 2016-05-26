import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Projects } from './projects.js';

export const Issues = new Mongo.Collection('issues');

if (Meteor.isClient) {
  Issues.deny({
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
      resolution: false,
      assignee: null,
      reporter: Meteor.userId(),
      createdAt: new Date(),
      lastModified: new Date(),
      finishedAt: null,
      comments: [],
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
      resolution: false,
      assignee: null,
      reporter: Meteor.userId(), // this.userId
      createdAt: new Date(),
      lastModified: new Date(),
      finishedAt: null,
      comments: [],
    });
  },
  'setTodo' (sprintId) {
    check(sprintId, String);

    Issues.update({_id: sprintId}, {$set: {
      status: 'todo',
      resolution: false,
      lastModified: new Date(),
      finishedAt: null,
    }});
  },
  'setInProgress' (sprintId) {
    check(sprintId, String);

    Issues.update({_id: sprintId}, {$set: {
      status: 'inprogress',
      resolution: false,
      lastModified: new Date(),
      finishedAt: null,
    }});
  },
  'setDone' (sprintId) {
    check(sprintId, String);

    Issues.update({_id: sprintId}, {$set: {
      status: 'done',
      resolution: true,
      lastModified: new Date(),
      finishedAt: new Date(),
    }});
  },
  'deleteIssue' (issueId) {
    check(issueId, String);
    
    Issues.remove({_id: issueId});
  },
  'assignIssue' (issueId, assignee) {
    check(issueId, String);
    check(assignee, String);
    
    Issues.update({_id: issueId}, {$set: {assignee}});
  },
  'setIssueToStory' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {type: 'story'}});
  },
  'setIssueToTask' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {type: 'task'}});
  },
  'setIssueToEpic' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {type: 'epic'}});
  },
  'setIssueToBug' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {type: 'bug'}});
  },
  'setIssuePriorityHighest' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {priority: 'highest'}});
  },
  'setIssuePriorityHigh' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {priority: 'high'}});
  },
  'setIssuePriorityMedium' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {priority: 'medium'}});
  },
  'setIssuePriorityLow' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {priority: 'low'}});
  },
  'setIssuePriorityLowest' (issueId) {
    check(issueId, String);
    Issues.update({_id: issueId}, {$set: {priority: 'lowest'}});
  },
  'setEstimate' (issueId, estimate) {
    check(issueId, String);
    check(estimate, String);
    
    Issues.update({_id: issueId}, {$set: {estimate: parseInt(estimate)}});
  },
  'addComment' (issueId, comment) {
    check(issueId, String);
    check(comment, String);
    const commentObj = {
      content: comment,
      author: Meteor.users.findOne({_id: Meteor.userId()}).emails[0].address
    };

    Issues.update({_id: issueId}, {$push: {comments: commentObj}});
  },
  'setDescription' (issueId, description) {
    check(issueId, String);
    check(description, String);
    
    Issues.update({_id: issueId}, {$set: {description: description}});
  }
});
