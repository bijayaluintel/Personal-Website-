import type {DocumentActionComponent, DocumentActionsResolver} from 'sanity'

function renameUnpublishAction(Action: DocumentActionComponent): DocumentActionComponent {
  const MoveBackToDraftAction: DocumentActionComponent = (props) => {
    const action = Action(props)
    return action
      ? {
          ...action,
          label: 'Move back to draft',
          title: 'Remove this article from the website and keep it as an editable draft',
        }
      : null
  }

  MoveBackToDraftAction.action = 'unpublish'
  MoveBackToDraftAction.displayName = 'MoveBackToDraftAction'
  return MoveBackToDraftAction
}

export const writingDocumentActions: DocumentActionsResolver = (previousActions, context) => {
  if (context.schemaType !== 'writing') return previousActions

  return previousActions.map((Action) =>
    Action.action === 'unpublish' ? renameUnpublishAction(Action) : Action,
  )
}
