const express = require('express');
const cors = require('cors');
const session = require('express-session')
const { connectDB, setSearchIndexes } = require('./db'); // importer la logique de connexion à la base de données de db.js

const authRoutes = require('./routes/auth.js');
const postRoutes = require('./routes/posts.js');
const usersRoutes = require('./routes/users.js');
const messagesRoutes = require('./routes/messages.js');
const adminRoutes = require('./routes/admin.js');
const searchRoutes = require('./routes/search.js');
const imageRoutes = require('./routes/images.js');

require('dotenv').config();

const app = express();

// utiliser CORS for all routes
app.use(cors({  // permettre des requêtes cross-origin
  origin: 'http://localhost:5173',
  methods: ['GET','POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.options('*', cors()); // handle preflight requests

// Optionally, parse JSON bodies:
app.use(express.json());

// créer des sessions
app.use(session({
  secret: 'KingdomHearts_is_LIGHT',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}));

// Connect to MongoDB (For a persistent connection, consider adjusting the connectDB function to not close immediately) -- pas besoin de faire 'await client.connect()' dans chaque méthode
connectDB().then(() => {
  setSearchIndexes(); // créer des indexes, pas besoin de le faire à chaque appel de méthode de recherche
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
