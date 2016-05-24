import { Router } from 'meteor/iron:router';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/dashboard.js';

Router.route('/', function() {
  this.layout('appBody');
  this.render('dashboard');
});
