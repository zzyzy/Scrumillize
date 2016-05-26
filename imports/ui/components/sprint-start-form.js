import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Router } from 'meteor/iron:router';

import { Sprints } from '../../api/sprints.js';
import { Issues } from '../../api/issues.js';

import './sprint-start-form.html';

Template.sprintStartForm.onCreated(function () {
  this.projectId = Router.current().params.project_id;
});

Template.sprintStartForm.helpers({
  issueCount() {
    return Issues.find({sprintId: Template.instance().data._id}).count();
  },
  isTheOnlySprint() {
    return Issues.find({sprintId: Template.instance().data._id}).count() == 1;
  },
  todayDate() {
    return moment().format('YYYY-MM-DD');
  }
});

Template.sprintStartForm.events({
  'submit .startSprint' (event) {
    event.preventDefault();
  },
  'click .startSprintButton' () {
    const sprintName = document.getElementById('sprintName').value;
    const duration = document.getElementById('duration').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    Meteor.call('startSprint', Template.instance().data._id, Template.instance().projectId, sprintName, duration, startDate, endDate);

    document.getElementById('sprintName').value = "";
    document.getElementById('duration').value = "";
    document.getElementById('startDate').value = "";
    document.getElementById('endDate').value = "";
  }
});
