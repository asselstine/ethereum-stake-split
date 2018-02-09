export default {
  receiveOperators: (addresses) => {
    return {
      type: 'RECEIVE_OPERATOR_ADDRESSES',
      addresses: addresses
    }
  }
}
