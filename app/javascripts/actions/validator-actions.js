export default {
  receiveValidatorCount: (count) => {
    return {
      type: 'RECEIVE_VALIDATOR_COUNT',
      count: count
    }
  },

  receiveValidator: (index, data) => {
    return {
      type: 'RECEIVE_VALIDATOR',
      index: index,
      data: data
    }
  }
}
