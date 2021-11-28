/** Eval script without scope chain */
export async function evalWithoutScopeChain(context: any, __s__: string) {
  // the variable __s__ are so named because they cannot be removed from the scope of eval,
  // so they are named so that the user can never touch them
  return eval(__s__ + '(context)')
}
