const fs = require('fs');
const path = require('path');
const src = `var n = 5\nfor i = 1 to n\n    fact = fact * i\nendfor\nprint fact\n`; // note: fact undefined and for is ok, but let's introduce broken line

function translatePseudoToJs(src) {
    const lines = src.replace(/\t/g, '    ').split(/\r?\n/);
    const out = [];
    const mapping = [];
    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const srcLineNum = i + 1;
        let line = raw.trim();
        if (!line) continue;
        if (line.startsWith('#')) { out.push('// ' + line.slice(1).trim()); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }
        let m = line.match(/^var\s+([a-zA-Z_$][\w$]*)\s*=\s*(.*)$/i);
        if (m) { out.push(`let ${m[1]} = ${m[2]};`); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }
        m = line.match(/^print\s+(.+)$/i);
        if (m) { out.push(`print(${m[1]});`); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }
        m = line.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+)$/i);
        if (m) { out.push(`for (let ${m[1]} = ${m[2]}; ${m[1]} <= ${m[3]}; ${m[1]}++) {`); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }
        if (/^endfor$/i.test(line)) { out.push('}'); mapping.push({ srcLine: srcLineNum, srcText: raw }); continue; }
        if (!line.endsWith(';')) line = line + ';';
        out.push(line);
        mapping.push({ srcLine: srcLineNum, srcText: raw });
    }
    return { code: out.join('\n'), mapping };
}

const res = translatePseudoToJs(src);
console.log('Translated:\n', res.code);
try {
    new Function(res.code);
    console.log('No syntax error');
} catch (e) {
    // simulate worker mapping
    const match = String(e.stack || e.message || '').match(/:(\d+):\d+/);
    let original = null;
    if (match) {
        const errLine = parseInt(match[1],10);
        if (!Number.isNaN(errLine) && res.mapping[errLine-1]) original = res.mapping[errLine-1];
    }
    console.log('SyntaxError:', e.message);
    console.log('Mapped original line:', original);
}
