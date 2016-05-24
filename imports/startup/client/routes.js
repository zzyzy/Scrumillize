import { Router } from 'meteor/iron:router';

import { Projects } from '../../api/projects.js';
import { Issues } from '../../api/issues.js';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/dashboard.js';
import '../../ui/pages/product-backlog.js'
import '../../ui/components/issue-item-view.js';

Router.route('/', function () {
  this.layout('appBody');
  this.render('dashboard');
});

Router.route('/projects/', function () {
  this.layout('appBody');
  this.render('dashboard');
});

Router.route('/projects/:project_id', function () {
  this.layout('appBody');
  this.render('productBacklog', {
    data: function () {
      return Projects.findOne({_id: this.params.project_id});
    }
  });
});

Router.route('/projects/:project_id/issues/:issue_id', {
  name: 'issue',
  template: 'issueItemView',
  layoutTemplate: 'appBody',
  data: function() {
    return Issues.findOne({_id: this.params.issue_id});
  }
});
