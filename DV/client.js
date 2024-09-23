const height = 250;
const width = 500;
const ymax = 100;
const ymin = 0;
const timeInterval = 50;
const maxDataPoints = 100;

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

function insertRandomDatapoints()
{
    graph.series.addData({ one: Math.floor(Math.random() * (ymax/2)) + 10, two: (ymax + 50) / 2 });
    graph.render();
}

let int;

document.querySelector('button').addEventListener('click', () =>
{
    if (int === undefined) return int = setInterval(insertRandomDatapoints, timeInterval);

    clearInterval(int);

    int = undefined;    
});