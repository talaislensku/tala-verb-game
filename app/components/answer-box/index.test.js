import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import AnswerBox from './index'
import spy from '../../../test/spy'

test('should call onEnter with input value', assert => {
  const value = 'foo'
  const onEnterSpy = spy()

  const wrapper = shallow(
    <AnswerBox onEnter={onEnterSpy} />
  )

  const input = wrapper.find('input')
  input.simulate('change', { target: { value } })
  input.simulate('keypress', { key: 'Enter' })

  assert.true(onEnterSpy.called, 'onEnter not called')
  assert.deepEqual(onEnterSpy.args, [value])
})
