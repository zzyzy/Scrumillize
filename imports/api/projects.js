import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Projects = new Mongo.Collection('projects');

if (Meteor.isServer) {
  Meteor.publish('projects', function () {
    return Projects.find({users: this.userId});
  });
}

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
