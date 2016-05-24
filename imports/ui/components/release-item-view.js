import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Issues } from '../../api/issues.js';

import '../items/issue-item.js';
import './release-item-view.html';

Template.releaseItemView.onCreated(function () {
  this.releaseId = Router.current().params.release_id;
});

Template.releaseItemView.helpers({
  noIssues() {
    return Issues.find({releaseId: Template.instance().releaseId}).count() == 0;
  },
  issues() {
    return Issues.find({releaseId: Template.instance().releaseId});
  }
});
