module.exports = {
    validateRequestData: (data, requiredFields, errorMessage) => {
        for (const field of requiredFields) {
          if (!data[field]) {
            return { error: errorMessage };
          }
        }
      
        return null;
    }
}