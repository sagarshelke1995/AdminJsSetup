import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose'
import { dark, light, noSidebar } from '@adminjs/themes'
import express from 'express'
import mongoose from 'mongoose'
import nunjucks from 'nunjucks'
import session from 'express-session'
import flash from 'connect-flash'
import dotenv from 'dotenv'
import MongoDBStore from 'connect-mongodb-session'
import bodyParser from 'body-parser'
import Category from './models/Category.js';



dotenv.config()
const app = express()


AdminJS.registerAdapter({ Database, Resource })
const MongoDBStoreInstance = MongoDBStore(session)
const store = new MongoDBStoreInstance({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
})

// Handle errors
store.on('error', function (error) {
  console.error(error)
})


// Set up Nunjucks templating
function setUpNunjucks() {
  nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,
  })
}

setUpNunjucks()
app.set('view engine', 'html')
app.use(express.static("public"));
app.use('/admin-assets', express.static('admin/assets'))

// Express session configuration (should be applied before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    resave: false, // Better for performance
    saveUninitialized: false, // Avoid storing empty sessions
    store: store,
  })
)

// Connect flash messages
app.use(flash());

// register middleware to log flash
app.use((req, res, next) => {
  const getFlashMessage = (key) => {
    const messages = req.flash(key);
    return messages.length > 0 ? messages[0] : null;
  };
  res.locals.success_msg = getFlashMessage('success_msg');
  res.locals.error_msg = getFlashMessage('error_msg');
  res.locals.error = getFlashMessage('error');
  res.locals.user = req.user || null;
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))

  //////////////////////admin js set up start////////////////////
// Authenticate AdminJS
const DEFAULT_ADMIN = {
  email: 'admin@gmail.com',
  password: '123456',
}

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

import { getdropDownCategoryOptions } from './admin/dropdown.js'; // path as per your folder

  const dropDownCategory = await getdropDownCategoryOptions();

  const admin = new AdminJS({
    rootPath: '/admin',
    defaultTheme: light.id,
    availableThemes: [dark, light, noSidebar],
    assets: {
      styles: ['/admin/admin.css'],
      scripts: ['/admin/custom.js'],
    },
     resources: [ 
      dropDownCategory,           
      { resource: Category }, 
    ],
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.COOKIE_SECRET || 'sessionsecret',
    },
    null,
    {
      store: store,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || 'sessionsecret',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );

  app.use(admin.options.rootPath, adminRouter);

//////////////////////admin js set up end////////////////////
// Body-parser middleware AFTER AdminJS router
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
import routes from './routes/index.js'
app.use('/', routes)

// Start the server
app.listen(3000, () => {
  console.log('Listening on port 3000')
})
