// Side flip: Side 1 (builder) <-> Side 2 (five moves). Purely visual,
// in-memory state only — nothing is saved or sent anywhere.
document.addEventListener('DOMContentLoaded', function () {
  var sides = document.querySelectorAll('.side');
  var tabs = document.querySelectorAll('.side-tab');

  function showSide(n) {
    sides.forEach(function (side) {
      side.hidden = side.id !== 'side-' + n;
    });
    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === String(n));
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-side]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showSide(btn.getAttribute('data-side'));
    });
  });
});

// Request builder: 4 fields assemble into one live preview sentence.
document.addEventListener('DOMContentLoaded', function () {
  var role = document.getElementById('b-role');
  var context = document.getElementById('b-context');
  var task = document.getElementById('b-task');
  var format = document.getElementById('b-format');
  var preview = document.getElementById('prompt-preview');
  var fields = [role, context, task, format];

  function update() {
    var r = role.value.trim() || '___';
    var c = context.value.trim() || '___';
    var t = task.value.trim() || '___';
    var f = format.value.trim() || '___';
    preview.textContent = 'You are ' + r + '. For ' + c + ', ' + t + '. Format it as ' + f + '.';
  }

  fields.forEach(function (field) {
    field.addEventListener('input', update);
  });

  var examples = {
    workshop: {
      role: 'a workshop teacher',
      context: 'new trainees, before the practical',
      task: 'write a short safety reminder',
      format: '3 points for the noticeboard'
    },
    campus: {
      role: 'the class representative',
      context: 'a project submission due Friday (practice date)',
      task: 'write a reminder message for the group',
      format: 'one short message for the class chat'
    }
  };

  document.querySelectorAll('.chip-btn').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var data = examples[chip.getAttribute('data-example')];
      if (!data) return;
      role.value = data.role;
      context.value = data.context;
      task.value = data.task;
      format.value = data.format;
      update();
    });
  });

  // Copy the assembled request to the clipboard.
  var copyBtn = document.getElementById('copy-btn');
  var copyBtnOriginal = copyBtn.innerHTML;

  function showCopied() {
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied';
    setTimeout(function () {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = copyBtnOriginal;
    }, 1500);
  }

  function fallbackCopy(text) {
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(temp);
  }

  copyBtn.addEventListener('click', function () {
    var text = preview.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        fallbackCopy(text);
        showCopied();
      });
    } else {
      fallbackCopy(text);
      showCopied();
    }
  });
});
