import { Meteor } from 'meteor/meteor';

import { Projects } from '../projects.js';
import { Issues } from '../issues.js';
import { Releases } from '../releases.js';
import { Sprints } from '../sprints.js';

Meteor.publishComposite("everything", {
  find: function() {
    return Projects.find({users: {$elemMatch: {userId: this.userId}}});
  },
  children: [
    {
      find: function(project) {
        return Sprints.find({projectId: project._id});
      }
    },
    {
      find: function(project) {
        return Issues.find({projectId: project._id});
      }
    },
    {
      find: function(project) {
        return Releases.find({projectId: project._id});
      }
    }
  ]
});
