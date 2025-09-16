const fs = require('fs');
const path = require('path');
const valid = fs.readFileSync(path.join(__dirname,'..','assets','sample.pseudo'),'utf8');
const invalid = `var n\nfor i = 1 to n\n  fact = fact * i\n# missing endfor`;

function validatePseudo(src) {
    const lines = src.split(/\r?\n/);
    const issues = [];
    const forStack = [];
    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const lineNum = i + 1;
        const t = raw.trim();
        if (!t) continue;
        if (t.startsWith('#')) continue;
        const lower = t.toLowerCase();
        if (lower.startsWith('for')) {
            const m = t.match(/^for\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+?)\s+to\s+(.+)$/i);
            if (!m) {
                issues.push({ line: lineNum, text: raw, message: 'Malformed for-loop. Expected: for <var> = <start> to <end>' });
            } else {
                forStack.push({ var: m[1], line: lineNum });
            }
            continue;
        }
        if (/^endfor$/i.test(t)) {
            if (forStack.length === 0) {
                issues.push({ line: lineNum, text: raw, message: 'Unexpected endfor (no matching for)' });
            } else {
                forStack.pop();
            }
            continue;
        }
        if (lower.startsWith('var')) {
            const m = t.match(/^var\s+([a-zA-Z_$][\w$]*)\s*=\s*(.+)$/i);
            if (!m) issues.push({ line: lineNum, text: raw, message: 'Malformed var declaration. Expected: var <name> = <expression>' });
            continue;
        }
        if (lower.startsWith('print')) {
            const m = t.match(/^print\s+(.+)$/i);
            if (!m) issues.push({ line: lineNum, text: raw, message: 'Malformed print. Expected: print <expression>' });
            continue;
        }
    }
    if (forStack.length > 0) {
        const open = forStack[forStack.length-1];
        issues.push({ line: open.line, text: lines[open.line-1], message: 'Missing endfor for this for-loop' });
    }
    return issues;
}

console.log('Valid sample issues:', validatePseudo(valid));
console.log('Invalid sample issues:', validatePseudo(invalid));
