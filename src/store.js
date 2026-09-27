import { reactive, watch } from 'vue';

const KEY = 'habit-grid-state';
const SCHEMA = 2;

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.schema === SCHEMA && Array.isArray(raw.habits)) return raw;
    // v1 had no schema field; structure changed, start clean
    return { schema: SCHEMA, seq: 1, habits: [] };
  } catch {
    return { schema: SCHEMA, seq: 1, habits: [] };
  }
}

export const state = reactive(load());

let saveTimer = null;
watch(state, (v) => {
  // debounce: toggling a row of cells shouldn't stringify on every click
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {
      // storage quota exceeded: keep in-memory state, don't crash the page
    }
  }, 300);
}, { deep: true });

export function addHabit(name) {
  const n = (name || '').trim();
  if (!n) return null;
  if (state.habits.some((h) => h.name === n)) return null;
  const habit = { id: state.seq++, name: n, days: {} };
  state.habits.push(habit);
  return habit;
}

export function removeHabit(id) {
  const i = state.habits.findIndex((h) => h.id === id);
  if (i >= 0) state.habits.splice(i, 1);
}

export function toggle(habit, day) {
  if (habit.days[day]) delete habit.days[day];
  else habit.days[day] = 1;
}
