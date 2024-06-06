const request = require('supertest');
const url = 'localhost:3000'

describe('testing-guest-routes', () => {
    let token;
    test('POST /login - success', async () => {
        const { body } = await request(url).post('/login').send({ Email: 'john@doe.com', Password: 'P@ssword' });
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('token');
        token = body.data.token;
    })
    test('GET /previous/add - success', async () => {
        await request(url).get('/add/1/2').set('Authorization', 'Bearer ' + token);
        const { body } = await request(url).get('/previous/add/1').set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) + 1);
    });
    test('GET /previous/multiply - success', async () => {
        const { body } = await request(url).get('/previous/multiply/2').set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) * 2);
    })
    test('GET /previous/subtract - success', async () => {
        const { body } = await request(url).get('/previous/subtract/2').set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) - 2);
    })
    test('GET /previous/divide - success', async () => {
        const { body } = await request(url).get('/previous/divide/2').set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) / 2);
    })
    test('GET /previous/sqrt - success', async () => {
        const { body } = await request(url).get('/previous/sqrt/2').set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(Math.sqrt(body.data.previousValue)));
    })
})