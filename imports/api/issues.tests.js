/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import { Releases } from './releases.js';
import { Projects } from './projects.js';
import { Issues } from './issues.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DDP } from 'meteor/ddp-client';
import { faker } from 'meteor/practicalmeteor:faker';

if (Meteor.isServer) {
  require('./server/publications.js');

  describe('issues', function () {
    describe('methods', () => {
      let userId = Random.id();
      let projectId;
      let issueId;
      let releaseId;

      beforeEach(() => {
        Projects.remove({});
        Issues.remove({});
        Releases.remove({});

        projectId = Projects.insert({
          projectName: faker.lorem.sentence(),
          createdAt: new Date(),
          createdBy: userId,
          users: [userId],
        });

        issueId = Issues.insert({
          summary: faker.lorem.sentence(),
          projectId: projectId,
          createdAt: new Date(),
          reporter: userId
        });

        releaseId = Releases.insert({
          projectId: projectId
        })
      });

      it('can delete issue', () => {
        const deleteIssue = Meteor.server.method_handlers['deleteIssue'];
        const invocation = { userId };
        deleteIssue.apply(invocation, [issueId]);
        assert.equal(Issues.find().count(), 0);
      });

      it('can create issue', () => {
        Meteor.call('createNewIssue', faker.lorem.sentence(), projectId);
        assert.equal(Issues.find().count(), 2);
      })

      it('can move to release', () => {
        Meteor.call('moveToRelease', releaseId);
        assert.equal(Issues.find({releaseId: releaseId}).count(), 1);
      })
    });
  });
}
