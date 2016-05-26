import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import '../components/issue-item-view.js';
import './browse-issue.html';

Template.browseIssue.onCreated(function () {
  this.projectId = Router.current().params.project_id;
});

Template.browseIssue.helpers({
  projectId () {
    
    return Template.instance().projectId;
  }
});
