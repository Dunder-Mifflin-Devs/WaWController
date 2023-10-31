const request = require("supertest");
const data = require("./mediaRoutes.data");

// test suite for media route integration tests
describe("Media Routes Tests", () => {

    test("if proper results are returned from a title search call", async () => {
        await request(app)
            .get(data.omdbTitleRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(JSON.stringify(response.body))
                    .toBe(JSON.stringify(data.omdbTitleExpected));
            })

    });

    test("if proper results are returned from a parameterized title search call", async () => {
        await request(app)
            .get(data.omdbTitleParamsRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(JSON.stringify(response.body))
                    .toBe(JSON.stringify(data.omdbTitleParamsExpected));
            })

    });

    test("if proper results are returned from a failed title search call", async () => {
        await request(app)
            .get(data.omdbTitleErrorRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(JSON.stringify(response.body))
                    .toBe(JSON.stringify(data.omdbTitleErrorExpected));
            })

    });

    test("if proper results are returned from an id search call", async () => {
        await request(app)
            .get(data.omdbIdRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(JSON.stringify(response.body))
                    .toBe(JSON.stringify(data.omdbIdExpected));
            })

    });

    test("if proper results are returned from a failed id search call", async () => {
        await request(app)
            .get(data.omdbIdErrorRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(JSON.stringify(response.body))
                    .toBe(JSON.stringify(data.omdbIdErrorExpected));
            })

    });

    test("if proper results are returned from a random search", async () => {
        await request(app)
            .get(data.omdbRandomRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                let body = response.body;

                expect(body.success)
                    .toBe(true);

                expect(body.results.length)
                    .toBe(data.omdbRandomAmount);
                
                for (let item of body.results) {
                    let properties = ["Title", "Year", "imdbID", "Type", "Poster"];

                    for (let property of properties) {
                        expect(item)
                            .toHaveProperty(property);

                    }
                }
            })

    });

    test("if proper results are returned from a paramaterized random search", async () => {
        await request(app)
            .get(data.omdbRandomParamsRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                let body = response.body;

                expect(body.success)
                    .toBe(true);

                expect(body.results.length)
                    .toBe(data.omdbRandomParamsAmount);
                
                for (let item of body.results) {
                    let properties = ["Title", "Year", "imdbID", "Type", "Poster"];

                    for (let property of properties) {
                        expect(item)
                            .toHaveProperty(property);

                    }
                }
            })

    });

    test("if proper results are returned from a failed random search", async () => {
        await request(app)
            .get(data.omdbRandomErrorRoute)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(JSON.stringify(response.body))
                    .toBe(JSON.stringify(data.omdbRandomErrorExpected));
            })

    });
});