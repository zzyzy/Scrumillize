import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';

import './release-item.html';

Template.releaseItem.helpers({
  formatDate(date) {
    return moment(date).format('DD/MMM/YY');
  }
});
