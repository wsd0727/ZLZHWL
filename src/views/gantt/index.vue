<template>
  <GanttElastic :options="options" :tasks="tasks">
      <template v-slot:header>
        <GanttElasticHeader2 ></GanttElasticHeader2>
      </template>

    </GanttElastic>
</template>

<script setup name="gantt">
import dayjs from "dayjs";
import {GanttElastic, GanttElasticHeader2} from "gantt-elastic-wrapvue3"
import "gantt-elastic-wrapvue3/dist/style.css"

// console.log(GanttElastic);

let tasks = [
  {
    id: 1,
    label: "大任务1",
    user: '<a href="https://www.google.com/search?q=John+Doe" target="_blank" style="color:#0077c0;">进行中</a>',
    start: getDate(-24 * 5),
    duration: 15 * 24 * 60 * 60 * 1000,
    percent: 85,
    type: "project",
    //collapsed: true,
  },
  {
    id: 2,
    label: "大任务1的分解任务一",
    user: '<a href="https://www.google.com/search?q=Peter+Parker" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    start: getDate(-24 * 4),
    duration: 4 * 24 * 60 * 60 * 1000,
    percent: 50,
    type: "milestone",
    collapsed: true,
    style: {
      base: {
        fill: "#1EBC61",
        stroke: "#0EAC51",
      },
    },
  },
  {
    id: 3,
    label: "大任务3",
    user: '<a href="https://www.google.com/search?q=John+Wayne" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    start: getDate(-24 * 3),
    duration: 2 * 24 * 60 * 60 * 1000,
    percent: 100,
    type: "task",
  },
  {
    id: 4,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Clark+Kent" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    start: getDate(-24 * 2),
    duration: 2 * 24 * 60 * 60 * 1000,
    percent: 50,
    type: "task",
    dependentOn: [3],
  },
  {
    id: 5,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Austin+Powers" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    start: getDate(0),
    duration: 2 * 24 * 60 * 60 * 1000,
    percent: 10,
    type: "milestone",
    style: {
      base: {
        fill: "#0287D0",
        stroke: "#0077C0",
      },
    },
  },
  {
    id: 6,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Mario+Bros" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    start: getDate(24),
    duration: 1 * 24 * 60 * 60 * 1000,
    percent: 50,
    type: "task",
    collapsed: true,
    style: {
      base: {
        fill: "#8E44AD",
        stroke: "#7E349D",
      },
    },
  },
  {
    id: 7,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Knight+Rider" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    dependentOn: [6],
    start: getDate(24 * 2),
    duration: 4 * 60 * 60 * 1000,
    percent: 20,
    type: "task",
    collapsed: true,
  },
  {
    id: 8,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Johhny+Bravo" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    dependentOn: [7],
    start: getDate(24 * 3),
    duration: 1 * 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
  },
  {
    id: 9,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Dexter\'s+Laboratory" target="_blank" style="color:#0077c0;">等待</a>',
    parentId: 1,
    dependentOn: [8, 7],
    start: getDate(24 * 4),
    duration: 4 * 60 * 60 * 1000,
    percent: 20,
    type: "task",
    style: {
      base: {
        fill: "#8E44AD",
        stroke: "#7E349D",
      },
    },
  },
  {
    id: 10,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">等待</a>',
    start: getDate(24 * 5),
    duration: 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
  },
  {
    id: 11,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">等待</a>',
    start: getDate(24 * 6),
    duration: 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
  },
  {
    id: 12,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">等待</a>',
    start: getDate(24 * 7),
    duration: 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
    parentId: 11,
  },
  {
    id: 13,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">等待</a>',
    start: getDate(24 * 8),
    duration: 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
  },
  {
    id: 14,
    label: "大任务",
    user: '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">等待</a>',
    start: getDate(24 * 9),
    duration: 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
  },
  {
    id: 15,
    label: "test task",
    user: '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">等待</a>',
    start: getDate(24 * 16),
    duration: 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
  },

  {
    id: 15,
    label: "test task",
    user: '<a href="https://www.google.com/search?q=Johnattan+Owens" target="_blank" style="color:#0077c0;">等待</a>',
    start: getDate(24 * 1),
    duration: 24 * 60 * 60 * 1000,
    percent: 0,
    type: "task",
  },
];
let options = {
  taskMapping: {
    progress: "percent",
  },
  maxRows: 100,
  maxHeight: 500,
  title: {
    label: "Your project title as html (link or whatever...)",
    html: false,
  },
  row: {
    height: 24,
  },
  calendar: {
    hour: {
      display: true,
    },
  },
  chart: {
    progress: {
      bar: false,
    },
    expander: {
      display: true,
    },
  },
  taskList: {
    expander: {
      straight: false,
    },
    columns: [
      {
        id: 1,
        label: "ID",
        value: "id",
        width: 40,
      },
      {
        id: 2,
        label: "生产类型",
        value: "label",
        width: 200,
        expander: true,
        html: true,
        events: {
          click({ data, column }) {
            // alert("description clicked!\n" + data.label);
          },
        },
      },
      {
        id: 3,
        label: "状态",
        value: "user",
        width: 130,
        html: true,
      },
      {
        id: 3,
        label: "结束时间",
        value: (task) => dayjs(task.start).format("YYYY-MM-DD"),
        width: 78,
      },
     
      // {
      //   id: 5,
      //   label: "%",
      //   value: "progress",
      //   width: 35,
      //   style: {
      //     "task-list-header-label": {
      //       "text-align": "center",
      //       width: "100%",
      //     },
      //     "task-list-item-value-container": {
      //       "text-align": "center",
      //       width: "100%",
      //     },
      //   },
      // },
    ],
  },
  // locale: {
  //   name: "en",
  //   Now: "Now",
  //   "X-Scale": "Zoom-X",
  //   "Y-Scale": "Zoom-Y",
  //   "Task list width": "Task list",
  //   "Before/After": "Expand",
  //   "Display task list": "Task list",
  // },

  locale: {
        weekdays:["周日","周一","周二","周三","周四","周五","周六"],
        months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
  },



};

function getDate(hours) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const timeStamp = new Date(
    currentYear,
    currentMonth,
    currentDay,
    0,
    0,
    0
  ).getTime();
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}
</script>

<style scoped></style>
