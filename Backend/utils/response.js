const sendResponse = async (res, code, data , Message) => {
       res.status(code).send({
              statusCode: code,
              Message : Message,
              data: data
       });
}

module.exports = {
       sendResponse
}