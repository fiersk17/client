import * as React from 'react'
import PeopleItem from '../item'
import {Box, Button, Icon, Text, IconType} from '../../common-adapters'
import PeopleSearch from '../../profile/search/bar-container'
import * as Styles from '../../styles'
import {Props as ButtonProps} from '../../common-adapters/button'

export type TaskButton = {
  label: string
  onClick: () => void
  type?: ButtonProps['type']
  mode?: ButtonProps['mode']
}

export type Props = {
  badged: boolean
  icon: IconType
  instructions: string
  subText: string
  confirmLabel: string
  dismissable: boolean
  onConfirm: () => void
  onDismiss: () => void
  showSearchBar?: boolean
  buttons: Array<TaskButton>
}

export const Task = (props: Props) => (
  <PeopleItem format="multi" badged={props.badged} icon={<Icon type={props.icon} />}>
    <Text type="Body" style={styles.instructions}>
      {props.instructions}
    </Text>
    <Text type="BodySmall">{props.subText}</Text>
    <Box style={styles.actionContainer}>
      {props.showSearchBar && <PeopleSearch style={styles.search} />}
      {props.confirmLabel !== '' && (
        <Button
          small={true}
          label={props.confirmLabel}
          onClick={props.onConfirm}
          style={{marginRight: Styles.globalMargins.tiny}}
        />
      )}
      {props.buttons &&
        props.buttons.length &&
        props.buttons.map(b => (
          <Button key={b.label} small={true} style={{marginRight: Styles.globalMargins.tiny}} {...b} />
        ))}
      {props.dismissable && (
        <Button small={true} type="Default" mode="Secondary" onClick={props.onDismiss} label="Later" />
      )}
    </Box>
  </PeopleItem>
)

const styles = Styles.styleSheetCreate({
  actionContainer: {
    ...Styles.globalStyles.flexBoxRow,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginRight: Styles.isMobile ? 112 : 80,
    width: 'auto',
  },
  instructions: {marginRight: Styles.isMobile ? 112 : 80, marginTop: 2},
  search: {
    alignSelf: undefined,
    flexGrow: 0,
  },
})
