import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Releases } from '../../api/releases.js';

import '../items/release-item.js';
import './releases-list.html';

Template.releasesList.onCreated(function () {
  this.projectId = Router.current().params.project_id;
});

Template.releasesList.helpers({
  releases () {
    return Releases.find({ projectId: Template.instance().projectId });
  }
});
