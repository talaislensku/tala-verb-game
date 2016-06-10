export default function () {
  const spy = (...args) => {
    spy.called = true
    spy.args = args
  }

  spy.called = false
  return spy
}
