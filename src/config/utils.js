export const regexInputEmptyChanged = (event, regex, setState) => {
  const newValue = event.target.value
  if (regex.test(newValue) || newValue === '') {
    setState(newValue)
  }
}

export const hasRegion = (obj) => obj?.region?.length && obj?.region !== 'none '
