module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //next is same as err=>next(err)
  };
};
