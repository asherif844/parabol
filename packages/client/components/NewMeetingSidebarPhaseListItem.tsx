import React, {ReactNode} from 'react'
import styled from '@emotion/styled'
import {PALETTE} from '../styles/paletteV2'
import {NavSidebar} from '../types/constEnums'
import {phaseLabelLookup} from '../utils/meetings/lookups'

const NavListItem = styled('li')({
  fontWeight: 600,
  display: 'flex',
  flexDirection: 'column',
  // hack to work around broken flexbox
  // https://bugs.chromium.org/p/chromium/issues/detail?id=927066
  minHeight: 40
})

const NavItemBullet = styled('span')<Pick<Props, 'isFacilitatorPhaseGroup'>>(
  {
    backgroundColor: PALETTE.BACKGROUND_PRIMARY,
    borderRadius: '100%',
    color: '#fff',
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    height: 24,
    lineHeight: '24px',
    marginLeft: 21,
    marginRight: 12,
    textAlign: 'center',
    verticalAlign: 'middle',
    width: 24
  },
  ({isFacilitatorPhaseGroup}) => ({
    backgroundImage: isFacilitatorPhaseGroup ? PALETTE.GRADIENT_WARM : undefined
  })
)

const NavItemLabel = styled('span')({
  display: 'inline-block',
  fontSize: NavSidebar.FONT_SIZE,
  verticalAlign: 'middle'
})

const navListItemLinkActive = {
  backgroundColor: PALETTE.BACKGROUND_NAV_LIGHT_ACTIVE,
  borderLeftColor: PALETTE.BORDER_MAIN,
  color: PALETTE.TEXT_MAIN,
  ':hover,:focus': {
    backgroundColor: PALETTE.BACKGROUND_NAV_LIGHT_ACTIVE
  }
}

const navListItemLinkDisabled = {
  cursor: 'not-allowed',
  ':hover,:focus': {
    backgroundColor: 'transparent'
  }
}

interface LinkProps {
  isDisabled: boolean
  isActive: boolean
}

const NavListItemLink = styled('div')<LinkProps>(
  {
    alignItems: 'center',
    borderLeft: `${NavSidebar.LEFT_BORDER_WIDTH} solid transparent`,
    color: PALETTE.TEXT_MAIN,
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    minHeight: 40,
    textDecoration: 'none',
    userSelect: 'none',
    ':hover,:focus': {
      backgroundColor: PALETTE.BACKGROUND_NAV_LIGHT_HOVER
    }
  },
  ({isDisabled}) => isDisabled && navListItemLinkDisabled,
  ({isActive}) => isActive && navListItemLinkActive
)

interface Props {
  children: ReactNode
  handleClick?: () => void
  phaseType: string
  listPrefix: string
  isActive: boolean
  isFacilitatorPhaseGroup: boolean
}

const NewMeetingSidebarPhaseListItem = (props: Props) => {
  const {children, handleClick, phaseType, listPrefix, isActive, isFacilitatorPhaseGroup} = props
  const label = phaseLabelLookup[phaseType]
  return (
    <NavListItem>
      <NavListItemLink
        isDisabled={!handleClick}
        isActive={isActive}
        onClick={handleClick}
        title={label}
      >
        <NavItemBullet isFacilitatorPhaseGroup={isFacilitatorPhaseGroup}>
          {listPrefix}
        </NavItemBullet>
        <NavItemLabel>{label}</NavItemLabel>
      </NavListItemLink>
      {children}
    </NavListItem>
  )
}

export default NewMeetingSidebarPhaseListItem
