require('dotenv').config();
const { initCalendar, createAvailabilitySlots } = require('../src/calendar');
const dayjs = require('dayjs');
const { log, initLogger } = require('../src/logger');

async function seed() {
    initLogger(); // Initialize logger to avoid errors
    console.log('🌱 Seeding calendar slots...');

    const connected = await initCalendar();
    if (!connected) {
        console.error('❌ Failed to connect to Google Calendar.');
        process.exit(1);
    }

    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const afterTomorrow = dayjs().add(2, 'day').format('YYYY-MM-DD');

    console.log(`📅 Adding slots for: ${today}, ${tomorrow}, ${afterTomorrow}`);

    // 1. Online slots (Today & Tomorrow)
    console.log('... Adding Online slots');
    await createAvailabilitySlots(today, '14:00', '16:00', 'online', 50); // 2 slots
    await createAvailabilitySlots(tomorrow, '09:00', '12:00', 'online', 50); // 3 slots

    // 2. Itapecerica slots (Tomorrow)
    console.log('... Adding Itapecerica slots');
    await createAvailabilitySlots(tomorrow, '14:00', '18:00', 'itapecerica', 50); // 4 slots

    // 3. Taboão slots (After Tomorrow)
    console.log('... Adding Taboão slots');
    await createAvailabilitySlots(afterTomorrow, '10:00', '15:00', 'taboao', 50); // 5 slots

    console.log('✅ Seeding complete! You can now test the bot.');
}

seed();



