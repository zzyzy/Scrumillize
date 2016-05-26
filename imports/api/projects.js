import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Factory } from 'meteor/dburles:factory';
import { faker } from 'meteor/practicalmeteor:faker';

export const Projects = new Mongo.Collection('projects');

if (Meteor.isClient) {
  Projects.deny({
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
  'projects.insert'(projectName) {
    check(projectName, String);

    // Some logic here

    Projects.insert({
      projectName,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      users: [Meteor.userId()]
    });
  },
  'createUserForProject' (projectId, email, password) {
    check(projectId, String);
    check(email, String);
    check(password, String);

    const newUserId = Accounts.createUser({
      email: email,
      password: password
    });

    Projects.update({_id: projectId}, {$push: {users: newUserId}});
  }
});
