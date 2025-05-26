const
    height = 200,
    width = height * 2,
    ymax = 100,
    ymin = 0,
    timeInterval = 5,
    maxDataPoints = 750;

const powerGraph = new Rickshaw.Graph(
{
    element: document.getElementById("power"),
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
    graph: powerGraph,
    orientation: "left",
    tickFormat: (x) => x,
    ticks: 5,
    element: document.getElementById("powerY"),
    width: 50
});

new Rickshaw.Graph.Axis.X(
{
    graph: powerGraph,
    tickFormat: (x) => new Date(x * 1000).toLocaleTimeString(),
    ticks: 5,
    element: document.getElementById("powerX"),
    width
});

new Rickshaw.Graph.Legend({ graph: powerGraph, element: document.getElementById("powerLegend") });

const speedGraph = new Rickshaw.Graph(
{
    element: document.getElementById("speed"),
    width,
    height,
    renderer: "line",
    min: 1350,
    max: 1550,
    series: new Rickshaw.Series.FixedDuration(
    [
        {
            name: 'N1Inst',
            color: "#EC644B"
        },

        {
            name: 'N2Inst',
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
    graph: speedGraph,
    orientation: "left",
    tickFormat: (x) => x,
    ticks: 5,
    element: document.getElementById("speedY"),
    width: 50
});

new Rickshaw.Graph.Axis.X(
{
    graph: speedGraph,
    tickFormat: (x) => new Date(x * 1000).toLocaleTimeString(),
    ticks: 5,
    element: document.getElementById("speedX"),
    width
});

new Rickshaw.Graph.Legend({ graph: speedGraph, element: document.getElementById("speedLegend") });

const frequencyGraph = new Rickshaw.Graph(
{
    element: document.getElementById("frequency"),
    width,
    height,
    renderer: "line",
    min: 49.9,
    max: 50.1,
    series: new Rickshaw.Series.FixedDuration(
    [
        {
            name: 'F',
            color: "#EC644B"
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
    graph: frequencyGraph,
    orientation: "left",
    tickFormat: (x) => x,
    ticks: 10,
    element: document.getElementById("fY"),
    width: 50
});

new Rickshaw.Graph.Axis.X(
{
    graph: frequencyGraph,
    tickFormat: (x) => new Date(x * 1000).toLocaleTimeString(),
    ticks: 5,
    element: document.getElementById("fX"),
    width
});

let F1, F2, P1MIN, P1MAX, P2MIN, P2MAX, totalLoad, P1, P2, LAMBDA, t, P1Inst, P2Inst, N1Inst, N2Inst, f1, f2, I1, I2;

let N1 = parseInt(document.getElementById('N1Ref').value);
let N2 = parseInt(document.getElementById('N2Ref').value);

const solver = new LoadDispatch();

const prevPower = [[0, 0], [0, 0]];

function controlResponse(inertiaFactor)
{
    const
        A = 5,
        ts = 100,
        w = 2 * Math.PI * inertiaFactor / 10,
        z = 0.75;

    return A * (w * Math.exp(-1*t*w*z/ts) * Math.sin(t*w*Math.pow(1 - Math.pow(z, 2), 0.5))/ts) / Math.pow(1 - Math.pow(z, 2), 0.5);
};

setInterval(() =>
{
    // P = P target + A.e^-daming*t . cos(w*t)

    // (5*6^(1/2)*exp(-t/5)*sin((2*6^(1/2)*t)/5))/12

    // C * exp(-t/C) * sin(w * t)

    // (w*exp(-t*w*z)*sin(t*w*(1 - z^2)^(1/2)))/(1 - z^2)^(1/2)

    const
        tou = 1,
        riseFx = 1 - Math.exp(-1 * Math.pow(t, 10) / tou),
        P1old = prevPower[0][0],
        P2old = prevPower[0][1];

    P1Inst = P1old + ((P1 - P1old) * riseFx);
    P2Inst = P2old + ((P2 - P2old) * riseFx);

    powerGraph.series.addData({ P1Inst, P2Inst });

    if ((P1old + P2old) > (P1 + P2))
    {
        N1Inst = N1 + controlResponse(I1) || N1;
        N2Inst = N2 + controlResponse(I2) || N2;
    }

    else
    {
        N1Inst = N1 - controlResponse(I1) || N1;
        N2Inst = N2 - controlResponse(I2) || N2;
    }

    speedGraph.series.addData({ N1Inst, N2Inst });

    f1 = N1Inst * 50 / N1;
    f2 = N2Inst * 50 / N2;
    F = (f1 + f2) / 2;

    frequencyGraph.series.addData({F});

    powerGraph.render();
    speedGraph.render();
    frequencyGraph.render();

    document.getElementById('P1').innerHTML = P1Inst.toFixed(2);
    document.getElementById('P2').innerHTML = P2Inst.toFixed(2);
    document.getElementById('P1+P2').innerHTML = (P1Inst + P2Inst).toFixed(2);
    document.getElementById('lambda').innerHTML = LAMBDA;
    document.getElementById('N1').innerHTML = N1Inst.toFixed(2);
    document.getElementById('N2').innerHTML = N2Inst.toFixed(2);
    document.getElementById('F').innerHTML = F.toFixed(4);

    t += (timeInterval / maxDataPoints);
}, timeInterval);

function resizeYaxis()
{
    const
        decrement = powerGraph.max > totalLoad,
        scaleRate = totalLoad > 200 ? 0.01 * totalLoad : 0.01 * 50;
    
    const int = setInterval(() =>
    {
        if (decrement)
        {
            if (powerGraph.max <= (totalLoad + 10)) return clearInterval(int);

            powerGraph.max -= scaleRate;
        }

        else
        {
            if (powerGraph.max >= (totalLoad + 10)) return clearInterval(int);
            
            powerGraph.max += scaleRate;
        }
    }, timeInterval);
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

    if (totalLoad > (P1MAX + P2MAX)) return alert('Load demand is greater than maximum generation');

    N1 = parseFloat(document.getElementById('N1Ref').value);
    N2 = parseFloat(document.getElementById('N2Ref').value);
    I1 = parseFloat(document.getElementById('I1').value.split('/')[1]);
    I2 = parseFloat(document.getElementById('I2').value.split('/')[1]);

    solver.setCostFunctions({ F1, F2 }).setLimits({ P1MIN, P1MAX, P2MIN, P2MAX }).setLoad(totalLoad);

    const data = solver.solve();

    P1 = data.P1;
    P2 = data.P2;
    LAMBDA = data.lambda;

    resizeYaxis();

    prevPower[0] = prevPower[1];
    prevPower[1] = [P1, P2];

    t = 0;
});