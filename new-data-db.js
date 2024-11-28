import mongoose from 'mongoose';
import Route from './models/route.js';  
import Driver from './models/driver.js';
import Transport from './models/transport.js';

mongoose.connect('mongodb+srv://user:user@cluster1.tyjnv.mongodb.net/Transport?retryWrites=true&w=majority&appName=Cluster1', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});
 

const routesData = [
    { name: 'Хмельницький - Дунаївці', distance: 120, cost: 70 },
    { name: 'Хмельницький - Тернопіль', distance: 200, cost: 120 },
    { name: 'Хмельницький - Віниця', distance: 150, cost: 90 },
    { name: 'Хмельницький - Житомир', distance: 180, cost: 110 },
    { name: 'Хмельницький - Камʼянець-Подільський', distance: 100, cost: 60 },
    { name: 'Хмельницький - Нетішин', distance: 140, cost: 85 },
    { name: 'Хмельницький - Львів', distance: 220, cost: 130 },
    { name: 'Хмельницький - Умань', distance: 160, cost: 100 },
    { name: 'Хмельницький - Чернівці', distance: 130, cost: 75 },
    { name: 'Хмельницький - Івано-Франківськ', distance: 190, cost: 115 }
];

const driversData = [
    { surname: 'Іваненко', name: 'Петро', patronymic: 'Миколайович', experience: 5 },
    { surname: 'Шевченко', name: 'Тарас', patronymic: 'Іванович', experience: 8 },
    { surname: 'Коваленко', name: 'Олег', patronymic: 'Сергійович', experience: 6 },
    { surname: 'Мельник', name: 'Андрій', patronymic: 'Васильович', experience: 9 },
    { surname: 'Петренко', name: 'Володимир', patronymic: 'Ігорович', experience: 3 },
    { surname: 'Захаренко', name: 'Богдан', patronymic: 'Юрійович', experience: 7 },
    { surname: 'Демченко', name: 'Максим', patronymic: 'Андрійович', experience: 10 },
    { surname: 'Сидоренко', name: 'Дмитро', patronymic: 'Олександрович', experience: 4 },
    { surname: 'Гнатенко', name: 'Сергій', patronymic: 'Борисович', experience: 2 },
    { surname: 'Федоренко', name: 'Юрій', patronymic: 'Петрович', experience: 1 }
];

async function seedDatabase() {
    try {
        await Route.deleteMany({});
        await Driver.deleteMany({});
        await Transport.deleteMany({});

        const routes = await Route.insertMany(routesData);
        const drivers = await Driver.insertMany(driversData);

        const transportsData1 = Array.from({ length: 5 }, (_, i) => ({
            route: routes[i % routes.length]._id,
            drivers: [drivers[i % drivers.length]._id, drivers[(i + 1) % drivers.length]._id],
            startDate: new Date(),
            endDate: new Date(),
            bonus: 1500 + i * 200
        }));

         const transportsData2 = Array.from({ length: 10 }, (_, i) => ({
            route: routes[i % routes.length]._id,
            drivers: [drivers[i % drivers.length]._id],
            startDate: new Date(),
            endDate: new Date(),
            bonus: 2000 + i * 150
        }));

        await Transport.insertMany([...transportsData1, ...transportsData2]);

        console.log('Базу даних успішно заповнено!');
    } catch (err) {
        console.error('Помилка при заповненні бази даних:', err);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
