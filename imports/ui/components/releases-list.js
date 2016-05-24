import { Template } from 'meteor/templating';

import { Releases } from '../../api/releases.js';

import '../items/release-item.js';
import './releases-list.html';

Template.releasesList.helpers({
  releases() {
    return Releases.find({projectId: this._id});
  }
});

