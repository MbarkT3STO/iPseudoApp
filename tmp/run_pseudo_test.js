const fs = require('fs');
const vm = require('vm');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname,'..','assets','sample.pseudo'),'utf8');

function translatePseudoToJs(src) {
    const lines = src.replace(/\t/g, '    ').split(/\r?\n/);
    const out = [];
    for (let raw of lines) {
        let line = raw.trim();
        if (!line) continue;
        if (line.startsWith('#')) { out.push('// ' + line.slice(1).trim()); continue; }
        let m = line.match(/^var\s+([a-zA-Z_$][\w$]*)\s*=\s*(.*)$/i);
        if (m) { out.push(`let ${m[1]} = ${m[2]};`); continue; }
        m = line.match(/^print\s+(.+)$/i);
        if (m) { out.push(`print(${m[1]});`); continue; }
        m = line.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+)$/i);
        if (m) { out.push(`for (let ${m[1]} = ${m[2]}; ${m[1]} <= ${m[3]}; ${m[1]}++) {`); continue; }
        if (/^endfor$/i.test(line)) { out.push('}'); continue; }
        if (!line.endsWith(';')) line = line + ';';
        out.push(line);
    }
    return out.join('\n');
}

const translated = translatePseudoToJs(src);
const outputs = [];

function runTranslated(js) {
    const sandbox = {
        print: (...args) => { outputs.push(args.join(' ')); },
        console: { log: (...a)=>{} },
        require, setTimeout, clearTimeout
    };
    try {
        const script = new vm.Script(`(async function(){ ${js} })()`);
        const ctx = vm.createContext(sandbox);
        return script.runInContext(ctx);
    } catch (e) {
        outputs.push('ERROR: ' + (e && e.message));
    }
}

runTranslated(translated);

// print outputs one per line (raw)
for (const line of outputs) {
    console.log(line);
}
