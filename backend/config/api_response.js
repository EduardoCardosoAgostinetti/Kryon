function apiResponse(res, success, code, message, data = null, status = 200) {
  return res.status(status).json({ success, code, message, data });
}

module.exports = apiResponse;