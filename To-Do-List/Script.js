const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const countSpan = document.getElementById('count');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');

let tasks = [];

const save = () => localStorage.setItem('todo.tasks', JSON.stringify(tasks));
const load = () => JSON.parse(localStorage.getItem('todo.tasks') || '[]');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function render() {
  taskList.innerHTML = '';

  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = t.id;

    li.innerHTML = `
      <div class="task-left">
        <div class="checkbox" data-action="toggle"></div>
        <div class="task-text ${t.done ? 'completed' : ''}">${escapeHtml(t.text)}</div>
      </div>
      <button class="btn-delete" data-action="delete">🗑️</button>
    `;

    if (t.done) {
      const box = li.querySelector('.checkbox');
      box.textContent = '✔';
      box.style.borderColor = 'rgba(52,211,153,0.9)';
    }

    taskList.appendChild(li);
  });

  countSpan.textContent = tasks.length;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.unshift({ id: uid(), text: trimmed, done: false });
  save();
  render();
}

function toggleTask(id) {
  const t = tasks.find(task => task.id === id);
  if (!t) return;

  t.done = !t.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[tag]));
}

addBtn.addEventListener('click', () => {
  addTask(input.value);
  input.value = '';
  input.focus();
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addTask(input.value);
    input.value = '';
  }
});

taskList.addEventListener('click', e => {
  const action = e.target.dataset.action;
  const li = e.target.closest('li');
  if (!li) return;

  const id = li.dataset.id;

  if (action === 'toggle') toggleTask(id);
  else if (action === 'delete') deleteTask(id);
  else if (e.target.classList.contains('task-text')) toggleTask(id);
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Delete all tasks?')) {
    tasks = [];
    save();
    render();
  }
});

(function init() {
  tasks = load();
  render();
})();
