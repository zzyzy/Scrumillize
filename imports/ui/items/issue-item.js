import { Template } from 'meteor/templating';

import { Releases } from '../../api/releases.js';

import './issue-item.html';

Template.issueItem.helpers({
  projectId() {
    return this.projectId;
  },
  issueType (type) {
    return type.toLowerCase();
  },
  toLowerCase (string) {
    return string.toLowerCase();
  },
  isEstimated (estimate) {
    return estimate !== 'Unestimated';
  },
  isInRelease (releaseId) {
    return releaseId !== 'None';
  },
  releaseName (releaseId) {
    return Releases.findOne({ _id: releaseId }).releaseName;
  }
});
