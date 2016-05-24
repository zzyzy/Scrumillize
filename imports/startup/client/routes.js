import { Router } from 'meteor/iron:router';

import '../../ui/layouts/app-body.js';
import '../../ui/components/projects-list.js';

Router.route('/', function() {
  this.layout('appBody');
  this.render('projectsList');
});
