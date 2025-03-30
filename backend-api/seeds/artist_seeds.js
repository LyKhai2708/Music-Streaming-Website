const { faker } = require('@faker-js/faker');

exports.seed = function(knex) {
  return knex('Artists').del()
    .then(function () {
      const fakeArtists = [];
      const artistCount = 50;  

      for (let i = 0; i < artistCount; i++) {
        fakeArtists.push({
          artist_name: faker.person.fullName(), 
          bio: faker.lorem.paragraph(),               
          country: faker.location.country(),
          avatar: '/public/images/OIP.jpg'  
        });
      }

      return knex('Artists').insert(fakeArtists);
    });
};
