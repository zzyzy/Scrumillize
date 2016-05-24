import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Issues } from '../../api/issues.js';

import '../items/issue-item.js';
import './issues-list.html';

Template.issuesList.helpers({
  issues() {
    return Issues.find({projectId: Template.instance().data._id});
  }
});

Template.issuesList.events({
  'submit .newIssue'(event) {
    event.preventDefault();

    const target = event.target;
    const description = target.description.value;

    Meteor.call('issues.insert', description, Template.instance().data._id);

    target.description.value = "";
  }
});
