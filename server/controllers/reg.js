module.exports.post = (req, res) => {
    console.log('начало работы контролера')
    console.log(process.cwd())
    console.log('---', req.url);
    console.log(req.body)
    res.send('вы зарегистрированы')
  };