    import express from 'express';
    import Driver from './models/driver.js';
    import Route from './models/route.js';
    import Transport from './models/transport.js';
    import jwt from 'jsonwebtoken';
    import bcrypt from 'bcryptjs';
    import User from './models/user.js';


    const router = express.Router();
    const JWT_SECRET = '084e766707dc49da6fd9c484926c30286877318ba5c66222c8672c55d6fff40b';


    //---Маршрути---
    router.get('/routes', async (req, res) => {
        try {
            const routes = await Route.find();
            res.status(200).json(routes);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    router.post('/routes', async (req, res) => {
        try {
            const route = await Route.create(req.body);
            res.status(201).json(route);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });

    router.put('/routes/:id', async (req, res) => {
        try {
            const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!route) return res.status(404).json({ error: 'Маршрут не знайдено' });
            res.status(200).json(route);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });

    router.delete('/routes/:id', async (req, res) => {
        try {
            const route = await Route.findByIdAndDelete(req.params.id);
            if (!route) return res.status(404).json({ error: 'Маршрут не знайдено' });
            res.status(200).json({ message: 'Маршрут видалено' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });


    //---Водії---
    router.get('/drivers', async (req, res) => {
        try {
            const drivers = await Driver.find();
            res.status(200).json(drivers);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    router.post('/drivers', async (req, res) => {
        try {
            const driver = await Driver.create(req.body);
            res.status(201).json(driver);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });

    router.put('/drivers/:id', async (req, res) => {
        try {
            const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!driver) return res.status(404).json({ error: 'Водій не знайдений' });
            res.status(200).json(driver);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });

    router.delete('/drivers/:id', async (req, res) => {
        try {
            const driver = await Driver.findByIdAndDelete(req.params.id);
            if (!driver) return res.status(404).json({ error: 'Водій не знайдений' });
            res.status(200).json({ message: 'Водія видалено' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });


    //---Перевезення---
    router.get('/transports', async (req, res) => {
        try {
            const transports = await Transport.find().populate('route').populate('drivers');
            res.status(200).json(transports);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    router.post('/transports', async (req, res) => {
        try {
            const transport = await Transport.create(req.body);
            res.status(201).json(transport);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });

    router.put('/transports/:id', async (req, res) => {
        try {
            const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('route').populate('drivers');
            if (!transport) return res.status(404).json({ error: 'Перевезення не знайдено' });
            res.status(200).json(transport);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });

    router.delete('/transports/:id', async (req, res) => {
        try {
            const transport = await Transport.findByIdAndDelete(req.params.id);
            if (!transport) return res.status(404).json({ error: 'Перевезення не знайдено' });
            res.status(200).json({ message: 'Перевезення видалено' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });


    //---Вартість-перевезення---
    router.get('/transport/:id/cost', async (req, res) => {
        try {
            const transport = await Transport.findById(req.params.id).populate('route').populate('drivers');
            if (!transport) return res.status(404).json({ error: 'Перевезення не знайдено' });

            let totalCost = transport.route.cost;

            transport.drivers.forEach(driver => {
                totalCost += driver.experience * 100;
            });

            res.status(200).json({ totalCost });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });


    //---Реєстрація---
    router.post('/register', async (req, res) => {
        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });

            if (existingUser) {
                return res.status(400).json({ error: 'Користувач вже існує' });
            }

            const user = new User({ username, password });
            await user.save();

            res.status(201).json({ message: 'Користувача успішно зареєстровано' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });


    //---Авторизація---
    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(400).json({ error: 'Неправильні дані' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Неправильні дані' });
            }

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ token });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    export default router;




