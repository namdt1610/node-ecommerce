const request = require('supertest')
const app = require('../../app')
const env = require('@/configs/env')
const { prisma } = require('@/configs/database')

let validPayload

beforeEach(async () => {
    validPayload = {
        email: `testuser_${Date.now()}@mail.com`,
        password: 'N@m12345',
        confirmPassword: 'N@m12345',
    }

    await prisma.user.deleteMany({
        where: { email: validPayload.email },
    })
})

describe('/auth/register – destructive test', () => {
    const endpoint = `${env.BASE_API}/auth/register`
    console.log('[TEST] Target endpoint:', endpoint)

    it('should register successfully', async () => {
        const res = await request(app).post(endpoint).send(validPayload)
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('email', validPayload.email)
    })

    it('should fail when email is missing', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({ ...validPayload, email: undefined })
        expect(res.statusCode).toBe(400)
    })

    it('should fail when password is missing', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({ ...validPayload, password: undefined })
        expect(res.statusCode).toBe(400)
    })

    it('should fail when password is too short', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({ ...validPayload, password: 'abc', confirmPassword: 'abc' })
        expect(res.statusCode).toBe(400)
    })

    it('should fail when password does not match', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({ ...validPayload, confirmPassword: 'WrongPass123' })
        expect(res.statusCode).toBe(400)
    })

    it('should fail when email format is invalid', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({ ...validPayload, email: 'invalid-email' })
        expect(res.statusCode).toBe(400)
    })

    it('should reject duplicate email', async () => {
        await request(app).post(endpoint).send(validPayload)
        const res = await request(app).post(endpoint).send(validPayload)
        expect(res.statusCode).toBe(409)
    })

    it('should protect against SQL injection', async () => {
        const res = await request(app).post(endpoint).send({
            email: "test'; DROP TABLE users; --",
            password: 'N@m12345',
            confirmPassword: 'N@m12345',
        })
        expect(res.statusCode).toBeGreaterThanOrEqual(400)
    })

    it('should reject XSS payloads in email', async () => {
        const res = await request(app).post(endpoint).send({
            email: '<script>alert(1)</script>',
            password: 'N@m12345',
            confirmPassword: 'N@m12345',
        })
        expect(res.statusCode).toBe(400)
    })

    it('should reject unexpected fields', async () => {
        const res = await request(app)
            .post(endpoint)
            .send({
                ...validPayload,
                role: 'admin',
                isAdmin: true,
            })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'role',
                    message: '"role" is not allowed',
                }),
                expect.objectContaining({
                    field: 'isAdmin',
                    message: '"isAdmin" is not allowed',
                }),
            ])
        )
    })

    it('should handle multiple /register requests concurrently', async () => {
        const concurrentRequests = 200
        const requests = []

        for (let i = 0; i < concurrentRequests; i++) {
            const payload = {
                email: `stressuser_${Date.now()}_${i}@mail.com`,
                password: 'N@m12345',
                confirmPassword: 'N@m12345',
            }

            requests.push(request(app).post(endpoint).send(payload))
        }

        const results = await Promise.all(requests)

        results.forEach((res) => {
            expect([201, 409, 400]).toContain(res.statusCode)
            if (res.statusCode === 201) {
                expect(res.body.data.email).toBeDefined()
            }
        })

        const summary = results.reduce((acc, res) => {
            acc[res.statusCode] = (acc[res.statusCode] || 0) + 1
            return acc
        }, {})

        console.log('[RESULT] Load test summary:', summary)
    }, 15000)
})
