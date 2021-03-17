import { BalanceOf } from '@polkadot/types/interfaces/runtime'
import React, { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Account, BaseMember, Member } from '../../common/types'
import { filterAccount, SelectAccount } from '../../components/account/SelectAccount'
import { Button } from '../../components/buttons'
import {
  Checkbox,
  InlineToggleWrap,
  Label,
  LabelLink,
  TextArea,
  TextInput,
  ToggleCheckbox,
} from '../../components/forms'
import { Help } from '../../components/Help'
import { SelectMember } from '../../components/membership/SelectMember'
import {
  ModalFooter,
  ModalHeader,
  ScrolledModal,
  ScrolledModalBody,
  ScrolledModalContainer,
} from '../../components/Modal'
import { Text, TokenValue } from '../../components/typography'
import { BalanceInfoNarrow, InfoTitle, InfoValue, Row } from '../common'

const AvatarSchema = Yup.string().url()

interface CreateProps {
  onClose: () => void
  onSubmit: (params: Member) => void
  membershipPrice?: BalanceOf
}

export const MembershipFormModal = ({ onClose, onSubmit, membershipPrice }: CreateProps) => {
  const [rootAccount, setRootAccount] = useState<Account | undefined>()
  const [controllerAccount, setControllerAccount] = useState<Account | undefined>()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [about, setAbout] = useState('')
  const [avatar, setAvatar] = useState('')
  const [isReferred, setIsReferred] = useState(false)
  const [referrer, setReferrer] = useState<BaseMember>()
  const [hasTermsAgreed, setTerms] = useState(false)
  const filterRoot = useCallback(filterAccount(controllerAccount), [controllerAccount])
  const filterController = useCallback(filterAccount(rootAccount), [rootAccount])
  const [isFormValid, setFormValid] = useState(false)
  const isReferralValid = isReferred ? !!referrer : true
  const isNotEmpty = !!rootAccount && !!controllerAccount && !!name && !!handle && hasTermsAgreed

  useEffect(() => {
    if (avatar) {
      AvatarSchema.isValid(avatar).then((isAvatarValid) => {
        setFormValid(isNotEmpty && isReferralValid && isAvatarValid)
      })
    } else {
      setFormValid(isNotEmpty && isReferralValid)
    }
  }, [rootAccount, controllerAccount, name, handle, about, avatar, isReferred, hasTermsAgreed])

  useEffect(() => {
    !isReferred && setReferrer(undefined)
  }, [isReferred])

  const onCreate = () => {
    if (!controllerAccount || !rootAccount) {
      return
    }

    onSubmit({
      about,
      name,
      handle,
      avatarURI: avatar,
      controllerAccount: controllerAccount,
      rootAccount: rootAccount,
      referrer: isReferred ? referrer : undefined,
    })
  }

  return (
    <ScrolledModal modalSize="m" modalHeight="m" onClose={onClose}>
      <ModalHeader onClick={onClose} title="Add membership" />
      <ScrolledModalBody>
        <ScrolledModalContainer>
          <Row>
            <InlineToggleWrap>
              <Label>I was referred by a member: </Label>
              <ToggleCheckbox trueLabel="Yes" falseLabel="No" onChange={setIsReferred} checked={isReferred} />
            </InlineToggleWrap>
            {isReferred && <SelectMember onChange={setReferrer} disabled={!isReferred} selected={referrer} />}
          </Row>

          <Row>
            <Text size={2} dark>
              Please fill in all the details below.
            </Text>
          </Row>

          <Row>
            <Label isRequired>
              Root account <Help helperText={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'} />
            </Label>
            <SelectAccount filter={filterRoot} onChange={setRootAccount} />
          </Row>

          <Row>
            <Label isRequired>
              Controller account <Help helperText={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'} />
            </Label>
            <SelectAccount filter={filterController} onChange={setControllerAccount} />
          </Row>

          <Row>
            <Label htmlFor="member-name" isRequired>
              Member Name
            </Label>
            <TextInput
              id="member-name"
              type="text"
              placeholder="Type"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Row>

          <Row>
            <Label htmlFor="member-handle" isRequired>
              Membership handle
            </Label>
            <TextInput
              id="member-handle"
              type="text"
              placeholder="Type"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
            />
          </Row>

          <Row>
            <Label htmlFor="member-about">About Member</Label>
            <TextArea
              id="member-about"
              value={about}
              placeholder="Type"
              rows={4}
              onChange={(event) => setAbout(event.target.value)}
            />
          </Row>

          <Row>
            <Label htmlFor="member-avatar">Member Avatar</Label>
            <TextInput
              id="member-avatar"
              type="text"
              placeholder="Image URL"
              value={avatar}
              onChange={(event) => setAvatar(event.target.value)}
            />
            <Text size={3} italic={true}>
              Paste an URL of your avatar image. Text lorem ipsum.
            </Text>
          </Row>
        </ScrolledModalContainer>
      </ScrolledModalBody>
      <ModalFooter>
        <Label>
          <Checkbox id={'privacy-policy-agreement'} onChange={(value) => setTerms(value)}>
            <Text size={2} dark={true}>
              I agree to the{' '}
              <LabelLink href={'http://example.com/'} target="_blank">
                Terms of Service
              </LabelLink>{' '}
              and{' '}
              <LabelLink href={'http://example.com/'} target="_blank">
                Privacy Policy
              </LabelLink>
              .
            </Text>
          </Checkbox>
        </Label>
        <BalanceInfoNarrow>
          <InfoTitle>Creation fee:</InfoTitle>
          <InfoValue>
            <TokenValue value={membershipPrice?.toBn()} />
          </InfoValue>
          <Help helperText={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'} />
        </BalanceInfoNarrow>
        <Button size="medium" onClick={onCreate} disabled={!isFormValid}>
          Create a Membership
        </Button>
      </ModalFooter>
    </ScrolledModal>
  )
}
