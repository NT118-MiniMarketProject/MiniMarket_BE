const { PrismaClient } = require('@prisma/client');

const logging = false;

// logging function
const logQuery = (instance) => {
  instance.$on('query', (e) => {
    console.log('🚀🚀🚀----------------------------------');
    console.log('Query: ' + e.query + '\n');
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
  instance.$on('error', (e) => {
    console.log('❌❌❌----------------------------------');
    console.log('Error: ' + e.message + '\n');
  });
  instance.$on('info', (e) => {
    console.log('❗❗❗----------------------------------');
    console.log('Infor: ' + e.message + '\n');
  });
  instance.$on('warn', (e) => {
    console.log('⚠️⚠️⚠️----------------------------------');
    console.log('Warning: ' + e.message + '\n');
  });
};

// create an Prisma instance
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

if (logging) {
  logQuery(prisma);
}

module.exports = prisma