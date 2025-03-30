const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users.route');
const genreRouter = require('./routes/genres.route');
const artistRouter = require('./routes/artists.route');
const songRouter = require('./routes/songs.route');
const songArtistRouter = require('./routes/songs_artist.route');
const AuthRouter = require('./routes/auth.route');
const { authJwtmiddleware, authorizeRoles} = require('./middleware/auth_middleware');
const JSend = require('./jsend');

const {
  resourceNotFound,
  handleError,
} = require('./controllers/errors.controller'); 
const { specs, swaggerUi } = require('./docs/swagger');
const app = express();

app.use(cors());
// Tăng giới hạn kích thước payload lên 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    return res.json(JSend.success());
});

AuthRouter.setup(app);
app.use(authJwtmiddleware());
usersRouter.setup(app);
genreRouter.setup(app);
artistRouter.setup(app);
songRouter.setup(app);
songArtistRouter.setup(app);
app.use(resourceNotFound);
app.use(handleError);

module.exports = app;
