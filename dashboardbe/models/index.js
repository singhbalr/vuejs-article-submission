const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Define models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  type: {
    type: DataTypes.ENUM('Writer', 'Editor'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  }
}, {
  timestamps: true
});

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  }
}, {
  timestamps: true
});

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.ENUM('For Edit', 'Published'),
    defaultValue: 'For Edit'
  }
}, {
  timestamps: true
});

// Define associations
User.hasMany(Article, { foreignKey: 'writerId', as: 'writtenArticles' });
User.hasMany(Article, { foreignKey: 'editorId', as: 'editedArticles' });
Company.hasMany(Article, { foreignKey: 'companyId' });

Article.belongsTo(User, { foreignKey: 'writerId', as: 'writer' });
Article.belongsTo(User, { foreignKey: 'editorId', as: 'editor' });
Article.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Add bcrypt methods to User model
const bcrypt = require('bcryptjs');

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Define the comparePassword method
User.prototype.comparePassword = async function(enteredPassword) {
  console.log('Comparing:', enteredPassword, 'with stored hash:', this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Company,
  Article
};