/// This function is used to send a success response to the client
export const successResponse = ({res, statusCode = 200 ,message = "Done", data = {}}) => {
  return res.status(statusCode).json({message, data});
}
