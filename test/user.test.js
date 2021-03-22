const request = require('supertest')
const app = require('../app');
const User = require('../models/User');
const { connect } = require('../config/mongodb');
const { hashPassword } = require('../helpers/bcrypt');

let data = {
  username: 'asdlasdalsd',
  email: 'hahahahahahaha@mail.com',
  password : 'secrets'
}

let data2 = {
  username: 'hahaha',
  email: 'lalala@mail.com',
  password : 'secrets'
}

describe('User routes', ()=>{
    describe('POST /users/register',()=> {
        afterAll((done) => {
          User.deleteRow({
            username: data.username,
            email: data.email
          })
          done();
        });
        describe('Success process',()=> {
          test('should send an object (id, username, email) with status code 201', async (done)=>{
            await connect();
                request(app)
                    .post('/users/register')
                    .send(data)
                    .end((err,res)=>{
                        expect(err).toBe(null);
                        expect(res.body).toHaveProperty('email', data.email)
                        expect(res.body).toHaveProperty('username', data.username)
                        expect(res.body).toHaveProperty('_id', expect.any(String))
                        expect(res.status).toBe(201)
                        done()
                    })
            })
        })
        describe('Error process',()=>{
            test('should send an error wtih status 400 because of email null validation',async(done)=>{
                const withoutEmail = { ...data }
                delete withoutEmail.email;
                request(app)
                    .post('/users/register')
                    .send(withoutEmail)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body.error).toContain('Email cannot be null');
                        expect(res.body.error.length).toBeGreaterThan(0);
                        expect(res.status).toBe(400);  
                        done()
                    })
            })
            test('should send an error wtih status 400 because of empty email validation',(done)=>{
                const emptyEmail = { ...data, email: '' }
                request(app)
                    .post('/users/register')
                    .send(emptyEmail)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body.error).toContain('Email harus diisi!')
                        expect(res.body.error.length).toBeGreaterThan(0)
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error wtih status 400 because of duplicate email',(done)=>{
                const duplicateEmail = { ...data }
                request(app)
                    .post('/users/register')
                    .send(duplicateEmail)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('error', 'Email is already registered!')
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error wtih status 400 because of invalid email format',(done)=>{
                const invalidEmail = { ...data, email: "arnold.com" }
                request(app)
                    .post('/users/register')
                    .send(invalidEmail)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('error', expect.any(String))
                        expect(res.body.error).toContain('Invalid email format')
                        expect(res.body.error.length).toBeGreaterThan(0)
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error with status 400 because password null validation',(done)=>{
                const withoutPassword = { ...data }
                delete withoutPassword.password
                request(app)
                    .post('/users/register')
                    .send(withoutPassword)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('error', expect.any(String))
                        expect(res.body.error).toContain('Password cannot be null')
                        expect(res.body.error.length).toBeGreaterThan(0)
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error wtih status 400 because of empty password validation',(done)=>{
                const emptyPassword = { ...data, password: '' }
                request(app)
                    .post('/users/register')
                    .send(emptyPassword)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('error', expect.any(String))
                        expect(res.body.error).toContain('Password harus diisi!')
                        expect(res.body.error.length).toBeGreaterThan(0)
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error with status 400 because password min 6 validation',(done)=>{
                const falsePassFormat = { ...data, password: 'hai' }
                request(app)
                    .post('/users/register')
                    .send(falsePassFormat)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('error', expect.any(String))
                        expect(res.body.error).toContain('Password minimal 6 karakter')
                        expect(res.body.error.length).toBeGreaterThan(0)
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
        })
    })
    describe('POST /users/login',()=> {
          beforeAll((done) => {
            User.register({
              username: data2.username,
              email: data2.email,
              password: hashPassword(data2.password)
            })
            .then(_ => {
              done();
            })
            .catch(err => {
              done(err);
            })
          })
          afterAll((done) => {
            User.deleteRow({
              username: data2.username,
              email: data2.email
            })
            .then(_ => {
              done();
            })
            .catch(err => {
              done(err);
            })
          })
        describe('Success process',()=> {
            test('should send an object (access_token,email,username) with status code 200',(done)=>{
                request(app)
                    .post('/users/login')
                    .send(data2)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('email', data2.email);
                        expect(res.body).toHaveProperty('username', data2.username);
                        expect(res.body).toHaveProperty('access_token', expect.any(String));
                        expect(res.status).toBe(200);
                        done()
                    })
            })
        })
        describe('Error process',()=> {
            test('should send an error with status 400 because invalid email',(done)=>{
                const falseEmail = { ...data2, email: 'ziady@mail.com' }
                request(app)
                    .post('/users/login')
                    .send(falseEmail)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('error', 'Email or password is incorrect!')
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error with status 400 because invalid password',(done)=>{
                const falsePassword = { ...data2, password: 'salahhaha' }
                request(app)
                    .post('/users/login')
                    .send(falsePassword)
                    .end((err,res)=>{
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('error', 'Email or password is incorrect!')
                        expect(res.status).toBe(400)  
                        done()
                    })
            })
            test('should send an error wtih status 400 because of email null validation',async(done)=>{
              const withoutEmail = { ...data2 }
              delete withoutEmail.email;
              request(app)
                  .post('/users/login')
                  .send(withoutEmail)
                  .end((err,res)=>{
                      expect(err).toBe(null)
                      expect(res.body.error).toContain('Email cannot be null');
                      expect(res.body.error.length).toBeGreaterThan(0);
                      expect(res.status).toBe(400);  
                      done()
                  })
          })
          test('should send an error wtih status 400 because of empty email validation',(done)=>{
              const emptyEmail = { ...data2, email: '' }
              request(app)
                  .post('/users/login')
                  .send(emptyEmail)
                  .end((err,res)=>{
                      expect(err).toBe(null)
                      expect(res.body.error).toContain('Email harus diisi!')
                      expect(res.body.error.length).toBeGreaterThan(0)
                      expect(res.status).toBe(400)  
                      done()
                  })
          })
          test('should send an error wtih status 400 because of invalid email format',(done)=>{
              const invalidEmail = { ...data2, email: "arnold.com" }
              request(app)
                  .post('/users/login')
                  .send(invalidEmail)
                  .end((err,res)=>{
                      expect(err).toBe(null)
                      expect(res.body).toHaveProperty('error', expect.any(String))
                      expect(res.body.error).toContain('Invalid email format')
                      expect(res.body.error.length).toBeGreaterThan(0)
                      expect(res.status).toBe(400)  
                      done()
                  })
          })
          test('should send an error with status 400 because password null validation',(done)=>{
              const withoutPassword = { ...data2 }
              delete withoutPassword.password
              request(app)
                  .post('/users/login')
                  .send(withoutPassword)
                  .end((err,res)=>{
                      expect(err).toBe(null)
                      expect(res.body).toHaveProperty('error', expect.any(String))
                      expect(res.body.error).toContain('Password cannot be null')
                      expect(res.body.error.length).toBeGreaterThan(0)
                      expect(res.status).toBe(400)  
                      done()
                  })
          })
          test('should send an error wtih status 400 because of empty password validation',(done)=>{
              const emptyPassword = { ...data2, password: '' }
              request(app)
                  .post('/users/login')
                  .send(emptyPassword)
                  .end((err,res)=>{
                      expect(err).toBe(null)
                      expect(res.body).toHaveProperty('error', expect.any(String))
                      expect(res.body.error).toContain('Password harus diisi!')
                      expect(res.body.error.length).toBeGreaterThan(0)
                      expect(res.status).toBe(400)  
                      done()
                  })
          })
          test('should send an error with status 400 because password min 6 validation',(done)=>{
              const falsePassFormat = { ...data2, password: 'hai' }
              request(app)
                  .post('/users/login')
                  .send(falsePassFormat)
                  .end((err,res)=>{
                      expect(err).toBe(null)
                      expect(res.body).toHaveProperty('error', expect.any(String))
                      expect(res.body.error).toContain('Password minimal 6 karakter')
                      expect(res.body.error.length).toBeGreaterThan(0)
                      expect(res.status).toBe(400)  
                      done()
                  })
          })
        })
    })
})
