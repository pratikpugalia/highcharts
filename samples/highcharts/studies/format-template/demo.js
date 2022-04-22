// Todo:
// - Error handling (missing helpers, missing config etc. Silent errors?)
// - Conflicts with the a11y module? How to handle #each?
// - Sub-expressions?
// - Non-block helpers (like ucfirst)


const pick = Highcharts.pick;

const input = document.getElementById('input').textContent;
const output = document.getElementById('output');

const helpers = {};

function format(str, ctx) {
    const regex = /\{([a-zA-Z0-9\.\/# ]+)\}/g;
    const matches = [];
    let match;
    let currentMatch;
    let depth = 0;

    // Parse and create tree
    while ((match = regex.exec(str)) !== null) {
        if (!currentMatch || !currentMatch.fn) {
            currentMatch = {
                expression: match[1],
                find: match[0],
                start: match.index,
                startInner: match.index + match[0].length,
                length: match[0].length
            };
        }

        // Block helper, only one level at the time
        if (match[1].charAt(0) === '#') {
            const fn = match[1].split(' ')[0].replace('#', '');
            if (fn === currentMatch.fn) {
                depth++;
            }
            if (!currentMatch.fn) {
                currentMatch.fn = fn;
            }
        }

        // Closing a block helper
        const startingElseSection = match[1] === 'else';
        if (
            currentMatch.fn && (
                match[1] === `/${currentMatch.fn}` ||
                startingElseSection
            )
        ) {
            if (!depth) { // === 0

                const start = currentMatch.startInner,
                    body = str.substr(
                        start,
                        match.index - start
                    );

                // Either closing without an else section, or when encountering
                // an else section
                if (!currentMatch.body) {
                    currentMatch.body = body;
                    currentMatch.startInner = match.index + match[0].length;

                // The body exists already, so this is the else section
                } else {
                    currentMatch.elseBody = body;
                }
                currentMatch.find += body + match[0];

                if (!startingElseSection) {
                    matches.push(currentMatch);
                    currentMatch = void 0;
                }
            } else {
                depth--;
            }

        // Common expression
        } else if (!currentMatch.fn) {
            matches.push(currentMatch);
        }
    }

    // Execute
    matches.forEach(match => {
        const { elseBody, expression, fn } = match;
        let replacement;
        if (fn) {
            replacement = helpers[fn].call(
                ctx,
                ctx[match.expression.split(' ')[1]],
                match
            ) || (elseBody && format(elseBody, ctx));

        // Simple variable replacement
        } else {
            replacement = expression === 'this' ? ctx : ctx[expression];
        }
        str = str.replace(match.find, pick(replacement, ''));
    });
    return str;
}

helpers.foreach = function (arg, match) {
    return arg.map(item => format(match.body, item)).join('');
};
helpers.if = function (arg, match) {
    if (arg) {
        return format(match.body, this);
    }
};


output.innerHTML = format(input, {
    header: 'Hello header',
    items: ['Ein', 'To', 'Tre'],
    persons: [{
        firstName: 'Mick',
        lastName: 'Jagger'
    }, {
        firstName: 'Keith',
        lastName: 'Richards'
    }],
    condition: true,
    innerCondition: true,
    falseCondition: false,
    footer: 'Hello footer'
});