export enum InteractionResponseTypes {
    /** ACK a Ping */
    Pong = 1,
    /** respond to an interaction with a message */
    ChannelMessageWithSource = 4,
    /** ACK an interaction and edit a response later, the user sees a loading state */
    DeferredChannelMessageWithSource = 5,
    /** for components, ACK an interaction and edit the original message later; the user does not see a loading state */
    DeferredUpdateMessage = 6,
    /** for components, edit the message the component was attached to */
    UpdateMessage = 7,
    /** respond to an autocomplete interaction with suggested choices */
    ApplicationCommandAutocompleteResult = 8,
    /** respond to an interaction with a popup modal */
    Modal = 9
}
