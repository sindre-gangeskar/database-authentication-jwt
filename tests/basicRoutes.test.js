const express = require('express');
const request = require('supertest');
const app = express();
require('dotenv').config();

const addRoutes = require('../routes/add');
const subtractRoutes = require('../routes/subtract');
const multiplyRoutes = require('../routes/multiply');
const divideRoutes = require('../routes/divide');

app.use('/add', addRoutes);
app.use('/subtract', subtractRoutes);
app.use('/multiply', multiplyRoutes);
app.use('/divide', divideRoutes);


describe("testing-guest-routes", () => {
    test("GET /add/1/2 - success", async () => {
        const { body } = await request(app).get("/add/1/2");
        expect(body).toEqual({
            "status": "success",
            "data": 3
        });
    });

    test("GET /add/1/a - fail", async () => {
        const { body } = await request(app).get("/add/1/a");
        expect(body).toEqual({
            "status": "fail",
            "data": {
                "number2": "number2 is not in correct format"
            }
        });
    });

    test("GET /subtract/4/2 - success", async () => {
        const { body } = await request(app).get('/subtract/4/2');
        expect(body).toEqual({
            "status": "success",
            "data": 2
        })
    })

    test("GET /subtract/4/a - fail", async () => {
        const { body } = await request(app).get('/subtract/4/a');
        expect(body).toEqual({
            "status": "fail",
            "data": {
                "number2": "number2 is not in correct format"
            }
        })
    })

    test("GET /multiply/2/2 - success", async () => {
        const { body } = await request(app).get('/multiply/2/2');
        expect(body).toEqual({
            "status": "success",
            "data": 4
        })
    })
    test("GET /multiply/2/2 - fail", async () => {
        const { body } = await request(app).get('/multiply/2/a');
        expect(body).toEqual({
            "status": "fail",
            "data": {
                number2: "number2 is not in correct format"
            }
        })
    })
    test("GET /divide/4/2 - success", async () => {
        const { body } = await request(app).get('/divide/4/2');
        expect(body).toEqual({
            "status": "success",
            "data": 2
        })
    })
    test("GET /divide/4/a - fail", async () => {
        const { body } = await request(app).get('/divide/4/a');
        expect(body).toEqual({
            "status": "fail",
            "data": {
                number2: "number2 is not in correct format"
            }
        })
    })
});