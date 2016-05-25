import { Template } from 'meteor/templating';

import { Issues } from '../../api/issues.js';

import './sprint-start-form.html';

Template.sprintStartForm.helpers({
  noIssues () {
    return Issues.find({ sprintId: Template.instance().data._id }).count() == 0;
  }
});
