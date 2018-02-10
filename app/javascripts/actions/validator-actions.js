export default {
  receiveValidatorCount: (count) => {
    return {
      type: 'RECEIVE_VALIDATOR_COUNT',
      count: count
    }
  }
}
