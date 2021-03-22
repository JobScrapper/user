function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateInput(email, password, username) {
  if (email == null) {
    throw {
      name: 'CustomError',
      msg: 'Email cannot be null',
      status: 400 
    }
  } else if (email == '') {
    throw {
      name: 'CustomError',
      msg: 'Email harus diisi!',
      status: 400 
    } 
  } else if (password == null) {
    throw {
      name: 'CustomError',
      msg: 'Password cannot be null',
      status: 400 
    } 
  } else if (validateEmail(email) == false) {
    throw {
      name: 'CustomError',
      msg: 'Invalid email format',
      status: 400 
    } 
  } else if (password == '') {
    throw {
      name: 'CustomError',
      msg: 'Password harus diisi!',
      status: 400 
    } 
  } else if (password.length < 7) {
    throw {
      name: 'CustomError',
      msg: 'Password minimal 6 karakter!',
      status: 400 
    }  
  } else if (username == null) {
    throw {
      name: 'CustomError',
      msg: 'Username cannot be null',
      status: 400 
    } 
  } else if (username == '') {
    throw {
      name: 'CustomError',
      msg: 'Username harus diisi!',
      status: 400 
    }  
  }
}

module.exports = validateInput;