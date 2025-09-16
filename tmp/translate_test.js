const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../assets/sample.pseudo');
const s = fs.readFileSync(file, 'utf8');
function translatePseudoToJS(pseudo){
    const lines = pseudo.split(/\r?\n/);
    const out = [];
    for (let raw of lines) {
        let line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const varMatch = line.match(/^var\s+([a-zA-Z_]\w*)(?:\s*=\s*(.+))?$/i);
        if (varMatch) {
            const name = varMatch[1];
            const val = varMatch[2] || 'undefined';
            out.push(`let ${name} = ${val};`);
            continue;
        }
        const printMatch = line.match(/^print\s+(.+)$/i);
        if (printMatch) {
            out.push(`print(${printMatch[1]});`);
            continue;
        }
        const forMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s*=\s*(\d+)\s+to\s+([a-zA-Z_]\w*)$/i);
        if (forMatch) {
            const v = forMatch[1], start = forMatch[2], end = forMatch[3];
            out.push(`for (let ${v} = ${start}; ${v} <= ${end}; ${v}++) {`);
            continue;
        }
        if (/^endfor$/i.test(line)) { out.push('}'); continue; }
        out.push(line + (line.endsWith(';') ? '' : ';'));
    }
    const header = `const print = (...args)=>{postMessage({type:'stdout',text: args.join(' ')});};\n`;
    return header + out.join('\n');
}

try {
    const js = translatePseudoToJS(s);
    console.log('---TRANSLATED JS START---');
    console.log(js);
    console.log('---TRANSLATED JS END---');
} catch (e) {
    console.error('TRANSLATION_FAILED', e && e.stack || e);
    process.exit(2);
}
