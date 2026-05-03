import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'

export interface NavItem {
  label: string
  path: string
  Icon: ComponentType<SvgIconProps>
}
