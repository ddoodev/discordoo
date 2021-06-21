export default interface GatewayProviderAPI {

  /**
   * Emit event to the client or somewhere else
   * @param event - event to emit
   */
  emit(event: string)
}
