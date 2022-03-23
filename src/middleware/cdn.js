module.exports = (app) => {
  return async function cdn(req, res, next) {
    const { service, id, col } = req.params;
    let mime = 'image/jpeg';
    try {
      const data = await app.service(service).get(id);
      console.log(data);
      if (data.filename)
        res.setHeader('Content-Disposition', 'attachment; filename=' + data.filename);
      res.setHeader('Content-type', data.file_mime ? data.file_mime : mime);
      res.send(data[col]);
    } catch (e) {
      res.status(404);
      res.json({ message: 'File not found' });
    }
  };
};
