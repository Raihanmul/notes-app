export const sayHello = (req, res) => {
  res.status(200).json({
    status: "succes",
    message: "Hello, Raihan",
  });
};
