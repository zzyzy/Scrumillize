import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Projects } from '../../api/projects.js';

import '../items/project-item.js';
import './projects-list.html';

Template.projectsList.helpers({
  projects() {
    return Projects.find();
  }
});

Template.projectsList.events({
  'submit .newProject'(event) {
    event.preventDefault();

    const target = event.target;
    const projectName = target.projectName.value;

    Meteor.call('projects.insert', projectName);

    target.projectName.value = "";
  }
});
