const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../app");
const {User} = require("../models/user");

const {DB_HOST, PORT = 3000} = process.env;

describe("test auth routes", ()=> {
    let server;
    beforeAll(()=> {
        mongoose.connect(DB_HOST)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running. Use our API on port: ${PORT}`)
      });
      console.log("Database connection successful");
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1);
      })
    });
    
    beforeEach((done)=> {
        mongoose.connect(DB_HOST).then(()=> done())
    })

    afterEach((done)=> {
        mongoose.connection.db.dropCollection(()=> {
            mongoose.connection.close(()=> done())
        })
    })

    test("test login route", async()=> {
        const newUser = {
            email: "qwertyytrewq@ukr.net",
            password: "qwertyytrewq"
        };

        const user = await User.create(newUser);

        const loginUser = {
            email: "qwertyytrewq@ukr.net",
            password: "qwertyytrewq"
        };

        const response = await request(app).post("/api/auth/login").send(loginUser);
        expect(response.statusCode).toBe(200);
        const {body} = response;
        expect(body.token).toByTruthy();
        const {token} = await User.findById(user._id);
        expect(body.token).toBe(token);
        
    })

    test("test email and subscription type", async () => {
        const response = await request(app).post('/api/auth/register').send({
            email: 'Annetqwerty@gmail.com',
            password: 'annetqwerty',
        })
        const { email, subscription } = response.body
        expect(response.status).toBe(201)
        
        expect(typeof email).toBe('string')
        expect(typeof subscription).toBe('string')
    })


})



