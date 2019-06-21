import * as React from 'react'
import {Task, TaskButton} from '.'
import * as PeopleGen from '../../actions/people-gen'
import * as Types from '../../constants/types/people'
import * as Tabs from '../../constants/tabs'
import * as SettingsTabs from '../../constants/settings'
import {IconType} from '../../common-adapters/icon.constants'
import {todoTypes} from '../../constants/people'
import {connect, isMobile} from '../../util/container'
import * as Tracker2Gen from '../../actions/tracker2-gen'
import * as RouteTreeGen from '../../actions/route-tree-gen'
import * as ProfileGen from '../../actions/profile-gen'
import openURL from '../../util/open-url'

type TodoOwnProps = {
  badged: boolean
  confirmLabel: string
  dismissable: boolean
  icon: IconType
  instructions: string
  subText: string
  todoType: Types.TodoType
  buttons: Array<TaskButton>
}

const installLinkURL = 'https://keybase.io/download'
const onSkipTodo = (type: Types.TodoType, dispatch) => () => dispatch(PeopleGen.createSkipTodo({type}))
const mapStateToProps = state => ({myUsername: state.config.username || ''})

type TodoButtonOpts = {
  confirmLabel: string
  dismissLabel?: string
  onConfirm: () => void
  onDismiss?: () => void
}

function makeDefaultButtons(opts: TodoButtonOpts) {
  const result = [
    {
      label: opts.confirmLabel,
      onClick: opts.onConfirm,
    },
  ] as Array<TaskButton>
  if (opts.onDismiss) {
    result.push({
      label: opts.dismissLabel || 'Later',
      mode: 'Secondary',
      onClick: opts.onDismiss,
      type: 'Default',
    })
  }
  return result
}

const AddEmailConnector = connect(
  mapStateToProps,
  dispatch => ({
    onConfirm: () => dispatch(ProfileGen.createEditAvatar()),
    onDismiss: onSkipTodo('addEmail', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const AddPhoneNumberConnector = connect(
  mapStateToProps,
  dispatch => ({
    onConfirm: () => dispatch(ProfileGen.createEditAvatar()),
    onDismiss: onSkipTodo('addPhoneNumber', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const AvatarTeamConnector = connect(
  mapStateToProps,
  dispatch => ({
    onConfirm: () => dispatch(RouteTreeGen.createSwitchTab({tab: Tabs.teamsTab})),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const AvatarUserConnector = connect(
  mapStateToProps,
  dispatch => ({
    onConfirm: () => dispatch(ProfileGen.createEditAvatar()),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const BioConnector = connect(
  mapStateToProps,
  dispatch => ({
    _onConfirm: (username: string) => {
      // make sure we have tracker state & profile is up to date
      dispatch(Tracker2Gen.createShowUser({asTracker: false, username}))
    },
  }),
  (stateProps, dispatchProps, ownProps: TodoOwnProps) => ({
    ...ownProps,
    buttons: makeDefaultButtons({
      confirmLabel: ownProps.confirmLabel,
      onConfirm: () => dispatchProps._onConfirm(stateProps.myUsername),
    }),
  })
)(Task)

const ProofConnector = connect(
  mapStateToProps,
  dispatch => ({
    _onConfirm: (username: string) => dispatch(ProfileGen.createShowUserProfile({username})),
    onDismiss: onSkipTodo('proof', dispatch),
  }),
  (stateProps, dispatchProps, ownProps: TodoOwnProps) => ({
    ...ownProps,
    buttons: makeDefaultButtons({
      confirmLabel: ownProps.confirmLabel,
      onConfirm: () => dispatchProps._onConfirm(stateProps.myUsername),
      onDismiss: dispatchProps.onDismiss,
    }),
  })
)(Task)

const DeviceConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () => openURL(installLinkURL),
    onDismiss: onSkipTodo('device', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const FollowConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () =>
      dispatch(RouteTreeGen.createNavigateAppend({parentPath: [Tabs.peopleTab], path: ['profileSearch']})),
    onDismiss: onSkipTodo('follow', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({
    ...o,
    buttons: makeDefaultButtons({...d, ...o}),
    showSearchBar: true,
  })
)(Task)

const ChatConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () => dispatch(RouteTreeGen.createSwitchTab({tab: Tabs.chatTab})),
    onDismiss: onSkipTodo('chat', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const PaperKeyConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () =>
      dispatch(
        RouteTreeGen.createNavigateAppend({
          path: [{props: {highlight: ['paper key']}, selected: 'deviceAdd'}],
        })
      ),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const TeamConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () => {
      dispatch(RouteTreeGen.createNavigateAppend({parentPath: [Tabs.teamsTab], path: ['teamNewTeamDialog']}))
      dispatch(RouteTreeGen.createSwitchTo({path: [Tabs.teamsTab]}))
    },
    onDismiss: onSkipTodo('team', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const FolderConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () => dispatch(RouteTreeGen.createSwitchTab({tab: Tabs.fsTab})),
    onDismiss: onSkipTodo('folder', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const GitRepoConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () => {
      if (isMobile) {
        dispatch(RouteTreeGen.createNavigateAppend({path: [SettingsTabs.gitTab]}))
      } else {
        dispatch(RouteTreeGen.createSwitchTab({tab: Tabs.gitTab}))
      }
      dispatch(RouteTreeGen.createNavigateAppend({path: [{props: {isTeam: false}, selected: 'gitNewRepo'}]}))
    },
    onDismiss: onSkipTodo('gitRepo', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const TeamShowcaseConnector = connect(
  () => ({}),
  dispatch => ({
    onConfirm: () => dispatch(RouteTreeGen.createSwitchTab({tab: Tabs.teamsTab})),
    onDismiss: onSkipTodo('teamShowcase', dispatch),
  }),
  (_, d, o: TodoOwnProps) => ({...o, buttons: makeDefaultButtons({...d, ...o})})
)(Task)

const VerifyAllEmailConnector = connect(
  mapStateToProps,
  dispatch => ({
    onConfirm: () => dispatch(ProfileGen.createEditAvatar()),
    onManage: () => {},
  }),
  (stateProps, dispatchProps, ownProps: TodoOwnProps) => ({
    ...ownProps,
    buttons: [
      {
        label: 'Verify',
        onClick: dispatchProps.onConfirm,
        type: 'Success',
      },
      {
        label: 'Manage email',
        mode: 'Secondary',
        onClick: dispatchProps.onManage,
        type: 'Default',
      },
    ] as Array<TaskButton>,
  })
)(Task)

const VerifyAllPhoneNumberConnector = connect(
  mapStateToProps,
  dispatch => ({
    onConfirm: () => dispatch(ProfileGen.createEditAvatar()),
    onManage: () => {},
  }),
  (stateProps, dispatchProps, ownProps: TodoOwnProps) => ({
    ...ownProps,
    buttons: [
      {
        label: 'Verify',
        onClick: dispatchProps.onConfirm,
        type: 'Success',
      },
      {
        label: 'Manage numbers',
        mode: 'Secondary',
        onClick: dispatchProps.onManage,
        type: 'Default',
      },
    ] as Array<TaskButton>,
  })
)(Task)

const LegacyEmailVisibilityConnector = connect(
  mapStateToProps,
  dispatch => ({
    onConfirm: () => dispatch(ProfileGen.createEditAvatar()),
    onDismiss: onSkipTodo('legacyEmailVisibility', dispatch),
  }),
  (stateProps, dispatchProps, ownProps: TodoOwnProps) => ({
    ...ownProps,
    buttons: [
      {
        label: 'Make searchable',
        onClick: dispatchProps.onConfirm,
        type: 'Success',
      },
    ] as Array<TaskButton>,
    onDismiss: dispatchProps.onDismiss,
    subText: 'Your email will never appear on your public profile.',
  })
)(Task)

const TaskChooser = (props: TodoOwnProps) => {
  switch (props.todoType) {
    case todoTypes.addEmail:
      return <AddEmailConnector {...props} />
    case todoTypes.addPhoneNumber:
      return <AddPhoneNumberConnector {...props} />
    case todoTypes.avatarTeam:
      return <AvatarTeamConnector {...props} />
    case todoTypes.avatarUser:
      return <AvatarUserConnector {...props} />
    case todoTypes.bio:
      return <BioConnector {...props} />
    case todoTypes.proof:
      return <ProofConnector {...props} />
    case todoTypes.device:
      return <DeviceConnector {...props} />
    case todoTypes.follow:
      return <FollowConnector {...props} />
    case todoTypes.chat:
      return <ChatConnector {...props} />
    case todoTypes.paperkey:
      return <PaperKeyConnector {...props} />
    case todoTypes.team:
      return <TeamConnector {...props} />
    case todoTypes.folder:
      return <FolderConnector {...props} />
    case todoTypes.gitRepo:
      return <GitRepoConnector {...props} />
    case todoTypes.legacyEmailVisibility:
      return <LegacyEmailVisibilityConnector {...props} />
    case todoTypes.teamShowcase:
      return <TeamShowcaseConnector {...props} />
    case todoTypes.verifyAllEmail:
      return <VerifyAllEmailConnector {...props} />
    case todoTypes.verifyAllPhoneNumber:
      return <VerifyAllPhoneNumberConnector {...props} />
  }
  return null
}

export default TaskChooser
