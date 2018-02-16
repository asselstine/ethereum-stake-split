export default {
  receiveBlock: (block) => {
    return {
      type: 'RECEIVE_BLOCK',
      block: block
    }
  }
}
