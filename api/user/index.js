module.exports = (app, apiBase) => {
  
    app.use(apiBase, require('./routes/user.routes'));
  }