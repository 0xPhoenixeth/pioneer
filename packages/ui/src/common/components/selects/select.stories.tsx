import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { ModalBlock } from '../storybookParts/previewStyles'

import { SimpleSelect } from '.'

export default {
  title: 'Common/Forms/Select',
  component: SimpleSelect,
} as Meta

type Props = Parameters<typeof SimpleSelect>[0]
const Template: Story<Props> = ({ value, ...props }) => {
  const [v, setV] = useState(value)
  return (
    <ModalBlock>
      <SimpleSelect {...props} value={v} onChange={setV} />
    </ModalBlock>
  )
}

export const Default = Template
Default.args = {
  title: 'Simple select:',
  value: null,
  options: { Amet: null, ex: 'sunt', nisi: 'irure', sunt: 'cillum', quis: 'labore' },
}
