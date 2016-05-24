import { Template } from 'meteor/templating';

import './issue-item.html';

Template.issueItem.helpers({
  projectId() {
    return this.projectId;
  }
});
