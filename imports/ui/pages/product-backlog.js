import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../components/issues-list.js';
import './product-backlog.html';

Template.productBacklog.onCreated(function () {
  this.projectId = Router.current().params.project_id;
});

Template.productBacklog.events({
  'submit .newIssue'(event) {
    event.preventDefault();

    const target = event.target;
    const summary = target.summary.value;

    Meteor.call('createNewIssue', summary, Template.instance().projectId);

    target.summary.value = "";
  }
});
