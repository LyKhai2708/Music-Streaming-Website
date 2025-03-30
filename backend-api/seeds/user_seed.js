const { faker } = require('@faker-js/faker');

exports.seed = function(knex) {
  return knex('Users').del()
    .then(function () {
      const fakeUsers = [];
      const userCount = 100;  

      for (let i = 0; i < userCount; i++) {
        
        fakeUsers.push({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(), 
          full_name: faker.person.fullName(), 
          signup_date: faker.date.past(),

          avatar: '/public/images/OIP.jpg'

        });
      }

      return knex('Users').insert(fakeUsers);
    });
};
