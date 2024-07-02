<template>
  <div class="box">
    <FullCalendar v-model="data">
      <template v-slot:eventContent='arg'>
        <b>{{ arg.event.title }}</b>
      </template>
    </FullCalendar>
  </div>
</template>

<script setup>
import FullCalendar from "@/components/FullCalendar"
const data = ref([
  { title: 'event 1', date: '2023-04-01', color: 'purple' },
  { title: 'event 134', date: '2023-04-18' },
  { title: 'event 134', date: '2023-04-18' },
  { title: 'event 134', date: '2023-04-18' },
  { title: 'event 134', date: '2023-04-18' },
  { title: 'event 134', date: '2023-04-18' },

  { title: 'event 3', start: '2023-04-02' },
  { title: 'event 3', start: '2023-04-02' },
  { title: 'event 3', start: '2023-04-02' },
  { title: 'event 3', start: '2023-04-02' },
  { title: 'event 3', start: '2023-04-02' },
  { title: 'event 3', start: '2023-04-02' },
  { title: 'event 3', start: '2023-04-02' },

  { title: 'event 4', start: '2023-04-03' },
  { title: 'event 5', start: '2023-04-04' },
  { title: 'event 6', start: '2023-04-08', color: 'purple' },
  { title: 'event 7', start: '2023-04-09' },
  {
    id: 3,
    title: 'event 6',
    start: '2023-04-18 06:00:00',
    end: '2023-04-19 12:00:00',
    color: 'purple',
    extendedProps: {
      description: 'asdasdasdasdasdasdasdasds',
    },
    allDay: false,
  },
])
</script>

<style lang="scss" scoped>
.box {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}
</style>