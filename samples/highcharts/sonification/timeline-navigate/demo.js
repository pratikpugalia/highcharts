// Set up an extra instrument for playing notification when
// attempting to navigate beyond chart.
var ax, instr;
try {
    ax = new AudioContext();
    instr = new Highcharts.sonification.SynthPatch(
        ax,
        Highcharts.sonification.InstrumentPresets.step
    );
    instr.startSilently();
    instr.connect(ax.destination);
// eslint-disable-next-line no-unused-vars
} catch (e) { /* ignore sonification unsupported */ }


var chart = Highcharts.chart('container', {
    sonification: {
        order: 'simultaneous',
        duration: 4000,
        masterVolume: 0.5,
        events: {
            onBoundaryHit: function () {
                // Play a sound effect on navigation boundary hit
                if (instr) {
                    instr.playFreqAtTime(0, 1, 300);
                }
            }
        },
        defaultInstrumentOptions: {
            mapping: {
                pitch: {
                    min: 'c3',
                    max: 'c5'
                }
            }
        }
    },
    tooltip: {
        shared: true
    },
    series: [{
        sonification: {
            tracks: [{
                mapping: {
                    pan: -1
                }
            }]
        },
        data: [1, 5, 8, 13, 17, 20, 25, 24, 25]
    }, {
        sonification: {
            tracks: [{
                mapping: {
                    pan: 1
                }
            }]
        },
        data: [null, 8, 13, 17, 17, 17, 13]
    }]
});

document.addEventListener('keydown', function (e) {
    var timeline = chart.sonification.timeline;
    if (e.code === 'KeyS') {
        if (chart.sonification.isPlaying()) {
            timeline.pause();
        } else if (timeline && timeline.isPaused) {
            timeline.resume();
        } else {
            chart.sonify();
        }
    } else if (e.code === 'KeyA') {
        if (timeline) {
            timeline.playAdjacent(false);
        }
    } else if (e.code === 'KeyD') {
        if (timeline) {
            timeline.playAdjacent(true);
        }
    }
});

setInterval(function () {
    var timeline = chart.sonification.timeline;
    if (timeline) {
        document.getElementById('currentTime').textContent = Math.round(timeline.getCurrentTime() / 3700 * 100);
    }
}, 200);