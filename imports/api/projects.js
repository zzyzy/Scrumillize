import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Projects = new Mongo.Collection('projects');

Meteor.methods({
  'projects.insert'(projectName) {
    check(projectName, String);

    // Some logic here

    Projects.insert({
      projectName,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      users: [Meteor.userId()]
    });
  }
});
