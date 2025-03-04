// seeders/seed.js
const bcrypt = require('bcryptjs');
const { sequelize } = require('../models/index');
const { User, Company, Article } = require('../models');

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Sync database (force: true will drop tables if they exist)
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create editor user
    const editor = await User.create({
      firstname: 'Admin',
      lastname: 'Editor',
      email: 'editor@archintel.com',
      password: 'editor123',
      type: 'Editor',
      status: 'Active'
    });
    console.log('Editor user created');

    // Create writer user
    const writer = await User.create({
      firstname: 'John',
      lastname: 'Writer',
      email: 'writer@archintel.com',
      password: 'writer123',
      type: 'Writer',
      status: 'Active'
    });
    console.log('Writer user created');

    // Create companies
    const companies = await Company.bulkCreate([
      {
        name: 'Archintel Technologies',
        logo: 'https://via.placeholder.com/150x50?text=Archintel',
        status: 'Active'
      },
      {
        name: 'Google',
        logo: 'https://via.placeholder.com/150x50?text=Google',
        status: 'Active'
      },
      {
        name: 'Microsoft',
        logo: 'https://via.placeholder.com/150x50?text=Microsoft',
        status: 'Active'
      }
    ]);
    console.log('Companies created');

    // Create sample articles
    const articles = await Article.bulkCreate([
      {
        title: 'The Future of AI in Business',
        image: 'https://placehold.co/800x400/png',
        link: 'https://example.com/ai-business',
        date: new Date(),
        content: '<p>This is a sample article about AI in business. It discusses the impacts of artificial intelligence on modern business practices.</p>',
        status: 'Published',
        writerId: writer.id,
        editorId: editor.id,
        companyId: companies[0].id
      },
      {
        title: 'Cloud Computing Trends for 2025',
        image: 'https://placehold.co/800x400/png',
        link: 'https://example.com/cloud-trends',
        date: new Date(),
        content: '<p>This article explores the emerging trends in cloud computing that will shape the industry in the coming years.</p>',
        status: 'For Edit',
        writerId: writer.id,
        companyId: companies[1].id
      },
      {
        title: 'The Impact of Web 3.0 on Digital Marketing',
        image: 'https://placehold.co/800x400/png',
        link: 'https://example.com/web3-marketing',
        date: new Date(),
        content: '<p>An analysis of how Web 3.0 technologies are changing the landscape of digital marketing.</p>',
        status: 'For Edit',
        writerId: writer.id,
        companyId: companies[2].id
      }
    ]);
    console.log('Sample articles created');

    console.log('Seed completed successfully!');
    console.log('Login credentials:');
    console.log('Editor: email=editor@archintel.com, password=editor123');
    console.log('Writer: email=writer@archintel.com, password=writer123');


    const testLogin = async () => {
        try {
          const testUser = await User.findOne({ where: { email: 'editor@archintel.com' } });
          if (testUser) {
            const passwordMatch = await testUser.comparePassword('editor123');
            console.log('Password test match:', passwordMatch);
          } else {
            console.log('Test user not found');
          }
        } catch (error) {
          console.error('Test login error:', error);
        }
      };
      
      await testLogin();

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
};

// Run the seed function
seedDatabase();