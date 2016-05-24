import { Router } from 'meteor/iron:router';

import { Projects } from '../../api/projects.js';
import { Issues } from '../../api/issues.js';
import { Releases } from '../../api/releases.js';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/user-dashboard.js';
import '../../ui/pages/project-dashboard.js';
import '../../ui/pages/product-backlog.js'
import '../../ui/pages/release-backlog.js';
import '../../ui/pages/sprint-backlog.js';
import '../../ui/pages/browse-issue.js';
import '../../ui/components/release-versions.js';
import '../../ui/components/release-item-view.js';

Router.configure({
  waitOn: function () {
    return [Meteor.subscribe('projects'), Meteor.subscribe('issues'), Meteor.subscribe('releases')];
  }
});

Router.route('/', {
  name: 'root',
  action: function () {
    Router.go('/projects/');
  }
});

Router.route('/projects/', {
  name: 'userDashboard',
  template: 'userDashboard',
  layoutTemplate: 'appBody'
});

Router.route('/projects/:project_id', {
  name: 'projectDashboard',
  template: 'projectDashboard',
  layoutTemplate: 'appBody',
  data:function() {
    return Projects.findOne({_id: this.params.project_id});
  }
});

Router.route('/projects/:project_id/issues/', {
  name: 'productBacklog',
  template: 'productBacklog',
  layoutTemplate: 'appBody',
  data: function () {
    return Projects.findOne({_id: this.params.project_id});
  }
});

Router.route('/projects/:project_id/releases/', {
  name: 'releaseBacklog',
  template: 'releaseBacklog',
  layoutTemplate: 'appBody',
  data: function() {
    return Projects.findOne({_id: this.params.project_id});
  }
});

Router.route('/projects/:project_id/sprints/', {
  name: 'sprintBacklog',
  template: 'sprintBacklog',
  layoutTemplate: 'appBody',
  data: function () {
    return Projects.findOne({_id: this.params.project_id});
  }
});

Router.route('/projects/:project_id/releases/manage', {
  name: 'manageReleases',
  template: 'releaseVersions',
  layoutTemplate: 'appBody'
});

Router.route('projects/:project_id/releases/:release_id', {
  name: 'release',
  template: 'releaseItemView',
  layoutTemplate: 'appBody',
  data: function() {
    return Releases.findOne({_id: this.params.release_id});
  }
});

Router.route('/projects/:project_id/issues/:issue_id', {
  name: 'issue',
  template: 'browseIssue',
  layoutTemplate: 'appBody',
  data: function() {
    return Issues.findOne({_id: this.params.issue_id});
  }
});
