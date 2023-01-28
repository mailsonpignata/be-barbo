const returnError = (error) => {
  return { message: '500', error: error.detail || error.message }
}

exports.returnError = returnError;
