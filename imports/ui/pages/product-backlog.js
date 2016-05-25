import { Template } from 'meteor/templating';

import { Sprints } from '../../api/sprints.js';

import '../components/sprints-list.js';
import '../components/backlog-list.js';
import './product-backlog.html';

Template.productBacklog.helpers({
  sprintLists () {
    return Sprints.find({ projectId: Template.instance().data._id }, {sort: {position: 1}});
  }
});
