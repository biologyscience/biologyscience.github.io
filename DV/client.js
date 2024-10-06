const height = 250;
const width = 500;
const ymax = 100;
const ymin = 0;
const timeInterval = 50;
const maxDataPoints = 100;

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
            name: 'P1',
            color: "#EC644B"
        },

        {
            name: 'P2',
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

let F1, F2, P1MIN, P1MAX, P2MIN, P2MAX, totalLoad, int;

const solver = new LoadDispatch();

function insertRandomDatapoints()
{
    const { P1, P2, lambda } = solver.solve();

    document.getElementById('P1').innerHTML = P1;
    document.getElementById('P2').innerHTML = P2;
    document.getElementById('lambda').innerHTML = lambda;

    graph.series.addData({ P1, P2 });

    graph.render();
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
    
    if (int !== undefined) return;

    int = setInterval(insertRandomDatapoints, timeInterval);
});