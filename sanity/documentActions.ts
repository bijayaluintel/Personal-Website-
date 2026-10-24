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
  if (context.schemaType === 'newsletterIssue') {
    return previousActions
      .filter((Action) => Action.action !== 'unpublish')
      .map((Action) => Action.action === 'publish' ? newsletterDraftAction(Action) : Action)
  }
  if (context.schemaType !== 'writing') return previousActions

  return previousActions.map((Action) =>
    Action.action === 'unpublish' ? renameUnpublishAction(Action) : Action,
  )
}

function newsletterDraftAction(Action: DocumentActionComponent): DocumentActionComponent {
  const CreateKitDraftAction: DocumentActionComponent = (props) => {
    // Preserve Sanity's publish validation, permissions and synchronization checks.
    const action = Action(props)
    if (!action) return null
    return {
      ...action,
      label: props.published ? 'Draft requested — review in Kit' : 'Create draft in Kit',
      title: props.published
        ? 'Check Newsletter Deliveries for the result. Make further email edits in Kit.'
        : 'Prepare one email with the selected articles. Review and send it from Kit.',
      disabled: Boolean(props.published) || action.disabled,
    }
  }
  CreateKitDraftAction.action = 'publish'
  CreateKitDraftAction.displayName = 'CreateKitDraftAction'
  return CreateKitDraftAction
}
