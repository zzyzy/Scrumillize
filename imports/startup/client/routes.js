import { Router } from 'meteor/iron:router';

import { Projects } from '../../api/projects.js';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/dashboard.js';
import '../../ui/pages/product-backlog.js'

Router.route('/', function() {
  this.layout('appBody');
  this.render('dashboard');
});

Router.route('/projects/', function() {
  this.layout('appBody');
  this.render('dashboard');
});

Router.route('/projects/:_id', function() {
  this.layout('appBody');
  this.render('productBacklog', {
    data: function() {
      return Projects.findOne({_id: this.params._id});
    }
  });
});
