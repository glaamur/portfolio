function convertCSS() {
    var input = document.getElementById('input-css').value.trim();
    if (!input) { showStatus('Вставьте CSS-код'); return; }

    var colors = {};
    var counter = 1;
    var colorPattern = /#([0-9a-fA-F]{3,8})\b|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*[\d.]+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*\)/g;

    var matches = input.match(colorPattern) || [];
    matches.forEach(function(color) {
        if (!colors[color]) colors[color] = '--color-' + counter++;
    });

    var result = input.replace(colorPattern, function(color) {
        return 'var(' + colors[color] + ')';
    });

    var rootBlock = ':root {\n';
    Object.keys(colors).forEach(function(color) {
        rootBlock += '  ' + colors[color] + ': ' + color + ';\n';
    });
    rootBlock += '}\n\n';

    document.getElementById('output-css').value = rootBlock + result;
    renderVars(colors);

    var count = Object.keys(colors).length;
    showStatus('Найдено ' + count + ' ' + pluralize(count, 'цвет', 'цвета', 'цветов'));
}

function renderVars(colors) {
    var list = document.getElementById('vars-list');
    var block = document.getElementById('vars-block');
    list.innerHTML = '';

    Object.keys(colors).forEach(function(color) {
        var chip = document.createElement('div');
        chip.className = 'var-chip';

        var swatch = document.createElement('div');
        swatch.className = 'var-swatch';
        swatch.style.background = color;

        var text = document.createElement('span');
        text.textContent = colors[color] + ': ' + color;

        chip.appendChild(swatch);
        chip.appendChild(text);
        list.appendChild(chip);
    });

    block.classList.add('visible');
}

function copyResult() {
    var output = document.getElementById('output-css').value;
    if (!output) { showStatus('Нечего копировать'); return; }
    navigator.clipboard.writeText(output).then(function() {
        showStatus('Скопировано ✓');
    }).catch(function() {
        document.getElementById('output-css').select();
        document.execCommand('copy');
        showStatus('Скопировано ✓');
    });
}

function clearAll() {
    document.getElementById('input-css').value = '';
    document.getElementById('output-css').value = '';
    document.getElementById('vars-block').classList.remove('visible');
    document.getElementById('vars-list').innerHTML = '';
    showStatus('Очищено');
}

function showStatus(msg) {
    var el = document.getElementById('cv-status');
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(function() { el.style.opacity = '0'; }, 2500);
}

function pluralize(n, one, two, five) {
    var mod10 = n % 10, mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return five;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return two;
    return five;
}