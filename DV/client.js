const { derivative, lusolve, parse, rationalize, evaluate } = math;

const height = 250;
const width = 500;
const ymax = 100;
const ymin = 0;
const timeInterval = 50;
const maxDataPoints = 100;

let totalLoad = parseFloat(document.getElementById('totalLoad').value);

const graph = new Rickshaw.Graph(
{
    element: document.querySelector("#demo_chart"),
    width,
    height,
    renderer: "line",
    min: ymin,
    max: ymax,
    series: new Rickshaw.Series.FixedDuration(
    [
        {
            name: "one",
            color: "#EC644B"
        },

        {
            name: "two",
            color: "#000000"
        }
    ],
    undefined,
    {
        timeInterval,
        maxDataPoints
    })
});

new Rickshaw.Graph.Axis.Y(
{
    graph,
    orientation: "left",
    tickFormat: (x) => x,
    ticks: 6,
    element: document.getElementById("y_axis"),
    width: 50
});

new Rickshaw.Graph.Axis.X(
{
    graph,
    orientation: "bottom",
    tickFormat: (x) => new Date(x * 1000).toLocaleTimeString(),
    ticks: 6,
    element: document.getElementById("x_axis"),
    width
});

const globalValues = {P1MAX: 200, P2MAX: 200};

function redoCalculations({P1Value, P2Value})
{
    const P1 = 'P1';
    const P2 = 'P2';
    const F1 = `8*${P1} + 0.024*${P1}^2 + 80`;
    const F2 = `6*${P2} + 0.04*${P2}^2 + 120`;
    
    const df1 = derivative(F1, P1).toString();
    const df2 = derivative(F2, P2).toString();
    
    // eqt in format => p1 + p2 + l = const

    if (P1Value === undefined)
    {
        globalValues.P2 = P2Value;
        globalValues.lambda = evaluate(df2, {P2: P2Value});
        globalValues.P1 = totalLoad - P2Value;
    }

    if (P2Value === undefined)
    {
        globalValues.P1 = P1Value;
        globalValues.lambda = evaluate(df1, {P1: P1Value});
        globalValues.P2 = totalLoad - P1Value;
    }

    constraintCheck();
};

function constraintCheck()
{
    if (globalValues.P1 === 0 && globalValues.P2 === 0) globalValues.lambda = 0;
    if (globalValues.P1 < 0) redoCalculations({P1Value: 0});
    if (globalValues.P2 < 0) redoCalculations({P2Value: 0});
    if (globalValues.P1 > globalValues.P1MAX) redoCalculations({P1Value: globalValues.P1MAX});
    if (globalValues.P2 > globalValues.P2MAX) redoCalculations({P2Value: globalValues.P2MAX});
};

function calculateData()
{
    if (totalLoad > (globalValues.P1MAX + globalValues.P2MAX)) return;

    const P1 = 'P1';
    const P2 = 'P2';
    const F1 = `8*${P1} + 0.024*${P1}^2 + 80`;
    const F2 = `6*${P2} + 0.04*${P2}^2 + 120`;
    
    const df1 = derivative(F1, P1).toString();
    const df2 = derivative(F2, P2).toString();
    
    // eqt in format => p1 + p2 + l = const
    
    const eq1 = rationalize(df1, true).coefficients;
    const eq2 = rationalize(df2, true).coefficients;
    
    const constants = [-1 * eq1[0], -1 * eq2[0], totalLoad];
    
    const coefficients = [ [eq1[1], 0, -1], [0, eq2[1], -1], [1, 1, 0] ];
    
    const solutions = lusolve(coefficients, constants);
    
    globalValues.P1 = parseFloat(solutions[0][0].toFixed(4));
    globalValues.P2 = parseFloat(solutions[1][0].toFixed(4));
    globalValues.lambda = parseFloat(solutions[2][0].toFixed(4));

    constraintCheck();

    return globalValues;
};

function insertRandomDatapoints()
{
    calculateData();

    const { P1, P2 } = globalValues;

    graph.series.addData({ one: P1, two: P2 });
    // graph.series.addData({ one: Math.floor(Math.random() * (ymax/2)) + 10, two: (ymax + 50) / 2 });
    graph.render();
};


setInterval(insertRandomDatapoints, timeInterval);

document.querySelector('button').addEventListener('click', () =>
{
    totalLoad = parseFloat(document.getElementById('totalLoad').value);  
});