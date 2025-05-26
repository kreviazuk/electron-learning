const btn = document.getElementById('btn');
const reply = document.getElementById('reply');

btn.addEventListener('click', () => {
  window.electronAPI.sendMessage('你好，主进程');
});

window.electronAPI.onReply((msg) => {
  reply.textContent += '\n主进程回复：' + msg;
});
