import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';

import { Issues } from '../../api/issues.js';

import './sprint-start-form.html';

Template.sprintStartForm.onCreated(function () {
  this.projectId = Router.current().params.project_id;
  this.selectedDuration = new ReactiveVar();
  this.startDate = new ReactiveVar();
});

Template.sprintStartForm.onRendered(function () {
  const instance = Template.instance();
  const duration = document.getElementById('duration');
  const startDate = instance.$('#startDate');
  const endDate = instance.$('#endDate');

  instance.selectedDuration.set(duration.value);
  startDate.datetimepicker();
  endDate.datetimepicker({
    useCurrent: false
  });
  startDate.on('dp.change', function (e) {
    endDate.data("DateTimePicker").minDate(e.date);
  });
  endDate.on('dp.change', function (e) {
    startDate.data('DateTimePicker').maxDate(e.date);
  });
  instance.startDate.set(moment());
  startDate.data('DateTimePicker').date(instance.startDate.get());
  instance.autorun(function () {
    switch (instance.selectedDuration.get()) {
      case '1':
        endDate.data('DateTimePicker').date(instance.startDate.get().clone().add(1, 'w'));
        break;
      case '2':
        endDate.data('DateTimePicker').date(instance.startDate.get().clone().add(2, 'w'));
        break;
      case '3':
        endDate.data('DateTimePicker').date(instance.startDate.get().clone().add(3, 'w'));
        break;
      case '4':
        endDate.data('DateTimePicker').date(instance.startDate.get().clone().add(4, 'w'));
        break;
    }
  });
});

Template.sprintStartForm.helpers({
  issueCount() {
    return Issues.find({sprintId: Template.instance().data._id}).count();
  },
  isTheOnlySprint() {
    return Issues.find({sprintId: Template.instance().data._id}).count() == 1;
  },
  isNotCustom () {
    return Template.instance().selectedDuration.get() !== 'c';
  },
});

Template.sprintStartForm.events({
  'submit .startSprint' (event) {
    event.preventDefault();
  },
  'click .startSprintButton' () {
    const sprintName = document.getElementById('sprintName').value;
    // const duration = document.getElementById('duration').value;
    const startDate = Template.instance().$('#startDate').data('DateTimePicker').date().clone().toDate();
    const endDate = Template.instance().$('#endDate').data('DateTimePicker').date().clone().toDate();

    Meteor.call('startSprint', Template.instance().data._id, Template.instance().projectId, sprintName, startDate, endDate);

    document.getElementById('sprintName').value = "";
    document.getElementById('duration').value = "";
    document.getElementById('startDate').value = "";
    document.getElementById('endDate').value = "";
  },
  'change #duration' (event) {
    const target = event.target;
    const value = target.value;
    Template.instance().selectedDuration.set(value);
  },
  'dp.change #startDate' (event) {
    const date = event.date;
    Template.instance().startDate.set(date);
  }
});
