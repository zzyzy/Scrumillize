import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { moment } from 'meteor/momentjs:moment';

import Chart from 'chart.js';

import { Sprints } from '../../api/sprints.js';
import { Issues } from '../../api/issues.js';

import './reports.html';

Template.reports.onCreated(function () {
  this.projectId = Router.current().params.project_id;
  this.timeFormat = 'MM/DD/YYYY HH:mm';
  this.config = {
    type: 'line',
    data: {
      labels: [], // Date Objects
      datasets: [{
        label: "Guideline",
        data: [],
        fill: false,
        borderColor: '#999',
        backgroundColor: '#999',
        pointBorderColor: '#999',
        pointBackgroundColor: '#999',
        pointBorderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      title:{
        display:true,
        // text:"Chart.js Time Scale"
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            format: this.timeFormat,
            // round: 'day'
            tooltipFormat: 'll HH:mm'
          },
          scaleLabel: {
            display: true,
            labelString: 'TIME'
          }
        }, ],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'STORY POINTS'
          }
        }]
      },
    }
  };
  this.updateChartConfig = function (sprint, totalEstimate) {
    const instance = Template.instance();

    instance.config.data.datasets[0].data = [];
    instance.config.data.labels = [];
    instance.config.data.datasets[0].data.push({
      x: sprint.startDate,
      y: totalEstimate,
    });
    instance.config.data.datasets[0].data.push({
      x: sprint.endDate,
      y: 0,
    });
    for (let i = moment(sprint.startDate); i.isBefore(sprint.endDate); i.add(1, 'days')) {
      instance.config.data.labels.push(i.clone().toDate());
    }

    instance.config.data.datasets[1] = {
      label: 'Remaining Values' ,
      data: [],
      fill: false,
      borderColor: '#d04437',
      backgroundColor: '#d04437',
      pointBorderColor: '#d04437',
      pointBackgroundColor: '#d04437',
      pointBorderWidth: 1,
    };
    Issues.find({sprintId: sprint._id, status: 'done', finishedAt: {$ne: null}}, {sort: {finishedAt: 1}}).forEach(function(issue) {
      instance.config.data.datasets[1].data.push({
        x: issue.finishedAt,
        y: totalEstimate - issue.estimate,
      });
    });

    instance.chart.update();
  };
});

Template.reports.onRendered(function () {
  const hasFinishedSprints = Sprints.find({projectId: Template.instance().projectId, status: {$ne: null}}).count() > 0;
  if (!hasFinishedSprints) return;
  
  this.canvas = this.find('#burndownChart');
  this.ctx = this.canvas.getContext('2d');
  this.chart = new Chart(this.ctx, this.config);

  const sprintId = this.find('#selectedSprint').value;
  const sprint = Sprints.findOne({_id: sprintId});
  if (sprint !== null && sprint !== undefined) {
    const totalEstimate = Issues.find({sprintId: sprintId})
      .fetch()
      .map(issue => issue.estimate)
      .reduce((a, b) => a + b);
    Template.instance().updateChartConfig(sprint, totalEstimate);
  }

  // const sprints = Sprints.find({projectId: Template.instance().project_id, status: {$ne: false}}, {sort: {position: 1}});
  //
  //
  // const momentStart = moment();
  // const momentEnd = moment().add(7, 'days');
  //
  // config.data.datasets[0].data.push({
  //   x: momentStart.toDate(),
  //   y: sprint.estimate
  // });
  // config.data.datasets[0].data.push({
  //   x: momentEnd.toDate(),
  //   y: 0
  // });
  // for (let i = moment(momentStart); i.isBefore(momentEnd); i.add(1, 'days')) {
  //   config.data.labels.push(i.clone().toDate());
  // }

  // const chart = new Chart(ctx, config);
});

Template.reports.helpers({
  sprints () {
    return Sprints.find({projectId: Template.instance().projectId, status: {$ne: null}}, {sort: {position: 1}});
  },
  hasFinishedSprints () {
    return Sprints.find({projectId: Template.instance().projectId, status: {$ne: null}}).count() > 0;
  },
  projectId () {
    return Template.instance().projectId;
  }
});

Template.reports.events({
  'change #selectedSprint' (event) {
    const target = event.target;
    const sprintId = target.value;

    const sprint = Sprints.findOne({_id: sprintId});
    const totalEstimate = Issues.find({sprintId: sprintId})
      .fetch()
      .map(issue => issue.estimate)
      .reduce((a, b) => a + b);

    Template.instance().updateChartConfig(sprint, totalEstimate);
  }
});
