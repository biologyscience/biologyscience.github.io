const { derivative, lusolve, rationalize, evaluate } = math;

class LoadDispatch
{
    F1;
    F2;
    dF1;
    dF2;
    coef1;
    coef2;
    P1MIN;
    P1MAX;
    P2MIN;
    P2MAX;
    totalLoad;
    values = {};

    constructor()
    {
        return this;
    };

    setCostFunctions({F1, F2})
    {
        if (F1 !== undefined) this.F1 = F1;
        if (F2 !== undefined) this.F2 = F2;
        
        return this;
    };
    
    setLimits({P1MIN, P1MAX, P2MIN, P2MAX})
    {
        if (P1MIN !== undefined) this.P1MIN = P1MIN;
        if (P1MAX !== undefined) this.P1MAX = P1MAX;
        if (P2MIN !== undefined) this.P2MIN = P2MIN;
        if (P2MAX !== undefined) this.P2MAX = P2MAX;
        
        return this;
    };

    setLoad(load)
    {
        this.totalLoad = load;

        return this;
    };

    #updateDerivative()
    {
        this.dF1 = derivative(F1, 'P1').toString();
        this.dF2 = derivative(F2, 'P2').toString();
    };

    #updateCoefficients()
    {
        this.coef1 = rationalize(this.dF1, true).coefficients;
        this.coef2 = rationalize(this.dF2, true).coefficients;
    };

    #redoCalculations({P1Value, P2Value})
    {
        this.#updateDerivative();

        if (P1Value !== undefined)
        {
            this.values.P1 = P1Value;
            this.values.lambda = evaluate(this.dF1, {P1: P1Value});
            this.values.P2 = this.totalLoad - P1Value;
        }

        if (P2Value !== undefined)
        {
            this.values.P2 = P2Value;
            this.values.lambda = evaluate(this.dF2, {P2: P2Value});
            this.values.P1 = this.totalLoad - P2Value;
        }

        this.#constraintCheck();
    };

    #constraintCheck()
    {
        if (this.values.P1 === 0 && this.values.P2 === 0) this.values.lambda = 0;
        if (this.values.P1 < this.P1MIN) this.#redoCalculations({P1Value: this.P1MIN});
        if (this.values.P2 < this.P2MIN) this.#redoCalculations({P2Value: this.P2MIN});
        if (this.values.P1 > this.P1MAX) this.#redoCalculations({P1Value: this.P1MAX});
        if (this.values.P2 > this.P2MAX) this.#redoCalculations({P2Value: this.P2MAX});
    };

    solve()
    {
        this.#updateDerivative();
        this.#updateCoefficients();

        const constants = [ -1 * this.coef1[0], -1 * this.coef2[0], this.totalLoad ];
        const coefficients = [ [this.coef1[1], 0, -1], [0, this.coef2[1], -1], [1, 1, 0] ];

        const solutions = lusolve(coefficients, constants);

        this.values.P1 = parseFloat(solutions[0][0].toFixed(4));
        this.values.P2 = parseFloat(solutions[1][0].toFixed(4));
        this.values.lambda = parseFloat(solutions[2][0].toFixed(4));

        this.#constraintCheck();

        return this.values;
    };
};