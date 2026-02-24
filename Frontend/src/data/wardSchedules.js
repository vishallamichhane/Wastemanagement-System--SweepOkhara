// Ward-based waste collection schedules for all 33 wards of Pokhara
// Each ward has unique collection days and times

// Days: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday

export const WARD_SCHEDULES = {
  'Ward 1': {
    name: 'Ward 1',
    pickupDays: [0, 2, 4], // Sun, Tue, Thu
    timeSlot: '6:00 AM - 8:00 AM',
    vehicle: 'SW-01',
    driver: 'Ram Bahadur'
  },
  'Ward 2': {
    name: 'Ward 2',
    pickupDays: [1, 3, 5], // Mon, Wed, Fri
    timeSlot: '6:00 AM - 8:00 AM',
    vehicle: 'SW-02',
    driver: 'Hari Prasad'
  },
  'Ward 3': {
    name: 'Ward 3',
    pickupDays: [0, 2, 4], // Sun, Tue, Thu
    timeSlot: '8:00 AM - 10:00 AM',
    vehicle: 'SW-03',
    driver: 'Shyam Kumar'
  },
  'Ward 4': {
    name: 'Ward 4',
    pickupDays: [1, 3, 5], // Mon, Wed, Fri
    timeSlot: '8:00 AM - 10:00 AM',
    vehicle: 'SW-04',
    driver: 'Gopal Thapa'
  },
  'Ward 5': {
    name: 'Ward 5',
    pickupDays: [0, 2, 4], // Sun, Tue, Thu
    timeSlot: '10:00 AM - 12:00 PM',
    vehicle: 'SW-05',
    driver: 'Bikram Gurung'
  },
  'Ward 6': {
    name: 'Ward 6',
    pickupDays: [1, 3, 5], // Mon, Wed, Fri
    timeSlot: '9:00 AM - 11:00 AM',
    vehicle: 'SW-06',
    driver: 'Prakash Rai'
  },
  'Ward 7': {
    name: 'Ward 7',
    pickupDays: [0, 2, 4], // Sun, Tue, Thu
    timeSlot: '12:00 PM - 2:00 PM',
    vehicle: 'SW-07',
    driver: 'Dipak Shrestha'
  },
  'Ward 8': {
    name: 'Ward 8',
    pickupDays: [1, 3, 5], // Mon, Wed, Fri
    timeSlot: '10:00 AM - 12:00 PM',
    vehicle: 'SW-08',
    driver: 'Sujit Tamang'
  },
  'Ward 9': {
    name: 'Ward 9',
    pickupDays: [0, 2, 4], // Sun, Tue, Thu
    timeSlot: '2:00 PM - 4:00 PM',
    vehicle: 'SW-09',
    driver: 'Rajan Magar'
  },
  'Ward 10': {
    name: 'Ward 10',
    pickupDays: [1, 3, 5], // Mon, Wed, Fri
    timeSlot: '12:00 PM - 2:00 PM',
    vehicle: 'SW-10',
    driver: 'Binod KC'
  },
  'Ward 11': {
    name: 'Ward 11',
    pickupDays: [0, 2, 4], // Sun, Tue, Thu
    timeSlot: '4:00 PM - 6:00 PM',
    vehicle: 'SW-11',
    driver: 'Kiran Poudel'
  },
  'Ward 12': {
    name: 'Ward 12',
    pickupDays: [1, 3, 5], // Mon, Wed, Fri
    timeSlot: '2:00 PM - 4:00 PM',
    vehicle: 'SW-12',
    driver: 'Anil Bhattarai'
  },
  'Ward 13': {
    name: 'Ward 13',
    pickupDays: [0, 3, 5], // Sun, Wed, Fri
    timeSlot: '6:00 AM - 8:00 AM',
    vehicle: 'SW-13',
    driver: 'Rajesh Adhikari'
  },
  'Ward 14': {
    name: 'Ward 14',
    pickupDays: [1, 4, 6], // Mon, Thu, Sat
    timeSlot: '4:00 PM - 6:00 PM',
    vehicle: 'SW-14',
    driver: 'Santosh Karki'
  },
  'Ward 15': {
    name: 'Ward 15',
    pickupDays: [2, 4, 6], // Tue, Thu, Sat
    timeSlot: '8:00 AM - 10:00 AM',
    vehicle: 'SW-15',
    driver: 'Mohan Lama'
  },
  'Ward 16': {
    name: 'Ward 16',
    pickupDays: [0, 3, 6], // Sun, Wed, Sat
    timeSlot: '8:00 AM - 10:00 AM',
    vehicle: 'SW-16',
    driver: 'Nabin Dahal'
  },
  'Ward 17': {
    name: 'Ward 17',
    pickupDays: [1, 4, 6], // Mon, Thu, Sat
    timeSlot: '8:00 AM - 10:00 AM',
    vehicle: 'SW-17',
    driver: 'Prem Bahadur'
  },
  'Ward 18': {
    name: 'Ward 18',
    pickupDays: [2, 5, 0], // Tue, Fri, Sun
    timeSlot: '9:00 AM - 11:00 AM',
    vehicle: 'SW-18',
    driver: 'Krishna Rijal'
  },
  'Ward 19': {
    name: 'Ward 19',
    pickupDays: [1, 4, 6], // Mon, Thu, Sat
    timeSlot: '6:00 AM - 8:00 AM',
    vehicle: 'SW-19',
    driver: 'Jeevan Sapkota'
  },
  'Ward 20': {
    name: 'Ward 20',
    pickupDays: [2, 5, 0], // Tue, Fri, Sun
    timeSlot: '2:00 PM - 4:00 PM',
    vehicle: 'SW-20',
    driver: 'Suresh Panta'
  },
  'Ward 21': {
    name: 'Ward 21',
    pickupDays: [0, 2, 5], // Sun, Tue, Fri
    timeSlot: '6:00 AM - 8:00 AM',
    vehicle: 'SW-21',
    driver: 'Deepak Basnet'
  },
  'Ward 22': {
    name: 'Ward 22',
    pickupDays: [1, 3, 6], // Mon, Wed, Sat
    timeSlot: '10:00 AM - 12:00 PM',
    vehicle: 'SW-22',
    driver: 'Uttam Sharma'
  },
  'Ward 23': {
    name: 'Ward 23',
    pickupDays: [2, 4, 0], // Tue, Thu, Sun
    timeSlot: '4:00 PM - 6:00 PM',
    vehicle: 'SW-23',
    driver: 'Manoj Giri'
  },
  'Ward 24': {
    name: 'Ward 24',
    pickupDays: [1, 3, 5], // Mon, Wed, Fri
    timeSlot: '12:00 PM - 2:00 PM',
    vehicle: 'SW-24',
    driver: 'Puskar Neupane'
  },
  'Ward 25': {
    name: 'Ward 25',
    pickupDays: [0, 3, 5], // Sun, Wed, Fri
    timeSlot: '12:00 PM - 2:00 PM',
    vehicle: 'SW-25',
    driver: 'Roshan Thapa'
  },
  'Ward 26': {
    name: 'Ward 26',
    pickupDays: [2, 4, 6], // Tue, Thu, Sat
    timeSlot: '8:00 AM - 10:00 AM',
    vehicle: 'SW-26',
    driver: 'Sunil Shakya'
  },
  'Ward 27': {
    name: 'Ward 27',
    pickupDays: [1, 4, 6], // Mon, Thu, Sat
    timeSlot: '2:00 PM - 4:00 PM',
    vehicle: 'SW-27',
    driver: 'Bhim Tamang'
  },
  'Ward 28': {
    name: 'Ward 28',
    pickupDays: [0, 2, 5], // Sun, Tue, Fri
    timeSlot: '10:00 AM - 12:00 PM',
    vehicle: 'SW-28',
    driver: 'Lokendra Oli'
  },
  'Ward 29': {
    name: 'Ward 29',
    pickupDays: [1, 3, 6], // Mon, Wed, Sat
    timeSlot: '4:00 PM - 6:00 PM',
    vehicle: 'SW-29',
    driver: 'Arjun Bhandari'
  },
  'Ward 30': {
    name: 'Ward 30',
    pickupDays: [2, 5, 0], // Tue, Fri, Sun
    timeSlot: '6:00 AM - 8:00 AM',
    vehicle: 'SW-30',
    driver: 'Ganesh Acharya'
  },
  'Ward 31': {
    name: 'Ward 31',
    pickupDays: [1, 4, 6], // Mon, Thu, Sat
    timeSlot: '8:00 AM - 10:00 AM',
    vehicle: 'SW-31',
    driver: 'Tek Bahadur'
  },
  'Ward 32': {
    name: 'Ward 32',
    pickupDays: [0, 3, 5], // Sun, Wed, Fri
    timeSlot: '9:00 AM - 11:00 AM',
    vehicle: 'SW-32',
    driver: 'Dinesh Pandey'
  },
  'Ward 33': {
    name: 'Ward 33',
    pickupDays: [2, 4, 6], // Tue, Thu, Sat
    timeSlot: '10:00 AM - 12:00 PM',
    vehicle: 'SW-33',
    driver: 'Ramesh Gurung'
  }
};

// Get schedule for a ward
export const getWardSchedule = (wardName) => {
  return WARD_SCHEDULES[wardName] || WARD_SCHEDULES['Ward 1'];
};

// Get pickup days for a month based on ward schedule
export const getPickupDaysForMonth = (wardName, year, month) => {
  const schedule = getWardSchedule(wardName);
  const pickupDays = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (schedule.pickupDays.includes(dayOfWeek)) {
      pickupDays.push(day);
    }
  }

  return pickupDays;
};

// Get day names
export const getDayName = (dayNumber) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

// Check if today is a pickup day
export const isTodayPickupDay = (wardName) => {
  const schedule = getWardSchedule(wardName);
  const today = new Date().getDay();
  return schedule.pickupDays.includes(today);
};

