import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import './releases-list.js';
import './release-versions.html';

Template.releaseVersions.events({
  'submit .newVersion'(event) {
    event.preventDefault();

    const target = event.target;
    const projectId = Router.current().params.project_id;
    const releaseName = target.releaseName.value;
    const description = target.description.value;
    const startDate = new Date(target.startDate.value);
    const endDate = new Date(target.endDate.value);

    Meteor.call('releases.insert', projectId, releaseName, description, startDate, endDate);

    target.releaseName.value = "";
    target.description.value = "";
    target.startDate.value = "";
    target.endDate.value = "";
  }
});
