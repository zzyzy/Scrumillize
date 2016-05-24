import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Issues } from '../../api/issues.js';

import '../items/issue-item.js';
import './issues-list.html';

Template.issuesList.onCreated(function () {
  this.projectId = Router.current().params.project_id;
});

Template.issuesList.helpers({
  issues() {
    return Issues.find({projectId: Template.instance().projectId});
  },
  noIssues() {
    return Issues.find({projectId: Template.instance().projectId}).count() == 0;
  }
});
