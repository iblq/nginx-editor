export const tryCatch = async (promise) => {
  try {
    let res = await promise
    return [res, null]
  } catch (err) {
    return [null, err]
  }
}

export const isNeedPswd = (str) => {
  str = str.toLowerCase()

  let keys = [
    'Permission denied',
    'incorrect password',
    'Password:Sorry, try again.',
  ]
  return !!keys.find((k) => str.includes(k.toLowerCase()))
}
