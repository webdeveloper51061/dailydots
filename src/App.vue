<script setup>
import { computed, ref } from 'vue';
import { state, addHabit, removeHabit, toggle } from './store';

const newName = ref('');
const days = computed(() => {
  const out = [];
  const d = new Date();
  for (let i = 119; i >= 0; i--) {
    const t = new Date(d.getTime() - i * 86400000);
    // local date, not UTC: toISOString() shifts early-morning
    // check-ins (UTC+8) to the previous day
    const y = t.getFullYear();
    const mo = String(t.getMonth() + 1).padStart(2, '0');
    const da = String(t.getDate()).padStart(2, '0');
    out.push(y + '-' + mo + '-' + da);
  }
  return out;
});

function submit() {
  const n = newName.value.trim();
  if (n) addHabit(n);
  newName.value = '';
}
</script>

<template>
  <main class="wrap">
    <h1>Habit grid</h1>
    <form @submit.prevent="submit">
      <input v-model="newName" placeholder="new habit..." />
      <button>Add</button>
    </form>
    <section v-for="h in state.habits" :key="h.id" class="habit">
      <h2>{{ h.name }}<button class="rm" title="delete" @click="removeHabit(h.id)">×</button></h2>
      <div class="grid">
        <span
          v-for="day in days"
          :key="day"
          class="cell"
          :class="{ on: h.days[day] }"
          :title="day"
          @click="toggle(h, day)"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.wrap { max-width: 760px; margin: 2rem auto; font-family: system-ui; }
.grid { display: grid; grid-template-columns: repeat(20, 14px); gap: 3px; }
.cell { width: 14px; height: 14px; background: #ebedf0; border-radius: 2px; cursor: pointer; }
.cell.on { background: #40c463; }
.habit h2 { font-size: 1rem; margin: 1rem 0 .4rem; }
.rm { margin-left: .4rem; border: 0; background: none; color: #999; cursor: pointer; font-size: .8rem; }
.rm:hover { color: #c00; }
form { display: flex; gap: .5rem; }
</style>
