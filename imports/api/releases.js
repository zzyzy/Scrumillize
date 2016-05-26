import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Releases = new Mongo.Collection('releases');

if (Meteor.isClient) {
  Releases.deny({
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
      status: null,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });
  }
});
