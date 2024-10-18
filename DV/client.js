const height = 250;
const width = 500;
let ymax = 100;
let ymin = 0;
const timeInterval = 5;
const maxDataPoints = 1000;

// graph sizes need to change

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
            name: 'P1Inst',
            color: "#EC644B"
        },

        {
            name: 'P2Inst',
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
    ticks: 10,
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

let F1, F2, P1MIN, P1MAX, P2MIN, P2MAX, totalLoad, int;

const solver = new LoadDispatch();

const prevPower = [[0, 0], [0, 0]];

let P1, P2, LAMBDA, t, P1Inst, P2Inst;

let check = false;

function insertValues()
{
    // P = P target + A.e^-daming*t . cos(w*t)

    // (5*6^(1/2)*exp(-t/5)*sin((2*6^(1/2)*t)/5))/12

    // C * exp(-t/C) * sin(w * t)

    const
        A = 0.1,
        damping = 0.75,
        w = 2 * Math.PI * 50 / 25,
        phaseShift = Math.PI / 2,
        K = 1,
        tou = 1,
        riseFx = 1 - Math.exp(-1 * Math.pow(t, 4) / tou),
        P1old = prevPower[0][0],
        P2old = prevPower[0][1];

    if ((P1Inst >= (1 + A) * P1) && !check) check = true;

    if (check)
    {
        P1Inst = P1 + (A * P1 * Math.exp(-1 * damping * t) * Math.cos(w * t + (phaseShift)));
        P2Inst = P2 + (A * P2 * Math.exp(-1 * damping * t) * Math.cos(w * t));
    }

    else
    {
        P1Inst = P1old + ((1 + A) * (P1 - P1old) * riseFx);
        P2Inst = P2old + ((1 + A) * (P2 - P2old) * riseFx);
    }

    document.getElementById('P1').innerHTML = P1Inst.toFixed(2);
    document.getElementById('P2').innerHTML = P2Inst.toFixed(2);
    document.getElementById('P1+P2').innerHTML = (P1Inst + P2Inst).toFixed(2);
    document.getElementById('lambda').innerHTML = LAMBDA;

    graph.series.addData({ P1Inst, P2Inst });

    graph.render();

    t += (timeInterval / 1000);
};

document.querySelector('button').addEventListener('click', () =>
{
    F1 = document.getElementById('F1').value;
    F2 = document.getElementById('F2').value;
    
    P1MIN = parseFloat(document.getElementById('P1MIN').value);
    P1MAX = parseFloat(document.getElementById('P1MAX').value);
    P2MIN = parseFloat(document.getElementById('P2MIN').value);
    P2MAX = parseFloat(document.getElementById('P2MAX').value);
    
    totalLoad = parseFloat(document.getElementById('totalLoad').value);

    solver.setCostFunctions({ F1, F2 }).setLimits({ P1MIN, P1MAX, P2MIN, P2MAX }).setLoad(totalLoad);

    const data = solver.solve();

    P1 = data.P1;
    P2 = data.P2;
    LAMBDA = data.lambda;

    t = 0;

    ymax = totalLoad;

    graph.max = ymax;

    prevPower[0] = prevPower[1];
    prevPower[1] = [P1, P2];

    check = false;
    
    if (int !== undefined) return;

    int = setInterval(insertValues, timeInterval);
});