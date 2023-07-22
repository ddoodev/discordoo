import {
  ApplicationChannelsManager,
  ApplicationDirectMessagesChannelsManager,
  ApplicationEmojisManager,
  ApplicationGuildMembersManager,
  ApplicationGuildsManager,
  ApplicationInvitesManager,
  ApplicationMessagesManager,
  ApplicationPermissionOverwritesManager,
  ApplicationPresencesManager,
  ApplicationReactionsManager,
  ApplicationRolesManager,
  ApplicationStickersManager,
  ApplicationThreadMembersManager,
  ApplicationInteractionsManager,
  OtherCacheManager,
  UsersManager
} from '../../../../src/api'
import { RestApplicationUser } from '../../../../src/api/entities/user/RestApplicationUser'
import { ApplicationEvents } from '../../../../src/events'
import { DiscordooProviders, otherCacheSymbol, REST_DEFAULT_OPTIONS } from '../../../../src/constants'
import {
  CompletedRestApplicationOptions, DefaultDiscordRestApplicationStack,
  ProviderConstructor,
  RestApplicationActions,
  RestApplicationInternals,
  RestApplicationMetadata, RestApplicationOptions
} from '../../../../src/core'
import { DiscordCacheApplication } from '../../../../src/core/apps/cache/DiscordCacheApplication'
import { DiscordooError } from '../../../../src/utils'
import { CompletedRestOptions, DefaultRestProvider, RestManager } from '../../../../src/rest'

export class DiscordRestApplication<ApplicationStack extends DefaultDiscordRestApplicationStack = DefaultDiscordRestApplicationStack>
  extends DiscordCacheApplication<ApplicationStack> {

  /** Internal things used by this app */
  public override readonly internals: RestApplicationInternals<ApplicationStack>

  /** Options passed to this app */
  public override readonly options: RestApplicationOptions

  /** Guilds manager for this app */
  public readonly guilds: ApplicationGuildsManager

  /** Users manager for this app */
  public readonly users: UsersManager

  /** Messages manager for this app */
  public readonly messages: ApplicationMessagesManager

  /** Channels manager for this app */
  public readonly channels: ApplicationChannelsManager

  /** Direct messages channels manager for this app */
  public readonly dms: ApplicationDirectMessagesChannelsManager

  /** Stickers manager for this app */
  public readonly stickers: ApplicationStickersManager

  /** Members manager for this app */
  public readonly members: ApplicationGuildMembersManager

  /** Roles manager for this app */
  public readonly roles: ApplicationRolesManager

  /** Presences manager for this app */
  public readonly presences: ApplicationPresencesManager

  /** Reactions manager for this app */
  public readonly reactions: ApplicationReactionsManager

  /** Permissions Overwrites manager for this app */
  public readonly overwrites: ApplicationPermissionOverwritesManager

  /** Thread Members manager for this app */
  public readonly threadMembers: ApplicationThreadMembersManager

  /** Emojis manager for this app */
  public readonly emojis: ApplicationEmojisManager

  /** Invites manager for this app */
  public readonly invites: ApplicationInvitesManager

  /** Interactions manager for this app */
  public readonly interactions: ApplicationInteractionsManager

  /**
   * This app as discord user.
   *
   * **DATA FOR THIS CLASS IS RECEIVED DURING app.start() EXECUTION**. UNTIL THEN, All PROPERTIES WILL BE DEFAULT.
   * */
  public user: RestApplicationUser

  constructor(token: string, options: RestApplicationOptions = {}) {
    super(token, options)

    this.options = options

    const restOptions: CompletedRestOptions = this._makeRestOptions()

    const appOptions: CompletedRestApplicationOptions = {
      ...super.getInternals.options,
      rest: restOptions
    }

    let restProvider: ProviderConstructor<ApplicationStack['rest']> = DefaultRestProvider
    let restProviderOptions

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.Rest:
            restProvider = provider.useClass
            restProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('DiscordApplication#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const appMetadata: RestApplicationMetadata = {
      ...super.getInternals.metadata,
      restRateLimitsDisabled: restOptions.limits.disable,
      restVersion: restOptions.api.version
    }

    const actions = new RestApplicationActions(this), events = new ApplicationEvents(this)

    const rest = new RestManager<ApplicationStack['rest']>(
      this,
      restProvider,
      { restOptions, providerOptions: restProviderOptions }
    )

    this.internals = {
      ...super.getInternals,
      rest,
      actions,
      events,
      metadata: appMetadata,
      options: appOptions
    }

    this.overwrites = new ApplicationPermissionOverwritesManager(this)
    this.threadMembers = new ApplicationThreadMembersManager(this)
    this.dms = new ApplicationDirectMessagesChannelsManager(this)
    this.interactions = new ApplicationInteractionsManager(this)
    this.members = new ApplicationGuildMembersManager(this)
    this.presences = new ApplicationPresencesManager(this)
    this.reactions = new ApplicationReactionsManager(this)
    this[otherCacheSymbol] = new OtherCacheManager(this)
    this.messages = new ApplicationMessagesManager(this)
    this.channels = new ApplicationChannelsManager(this)
    this.stickers = new ApplicationStickersManager(this)
    this.invites = new ApplicationInvitesManager(this)
    this.guilds = new ApplicationGuildsManager(this)
    this.emojis = new ApplicationEmojisManager(this)
    this.roles = new ApplicationRolesManager(this)
    this.user = new RestApplicationUser(this)
    this.users = new UsersManager(this)

    void this.user.init({
      id: '',
      username: ''
    })
  }

  override async start(): Promise<DiscordRestApplication<ApplicationStack>> {
    await super.start()
    await this.internals.rest.init()

    return this
  }

  private _makeRestOptions(): CompletedRestOptions {
    return {
      requestTimeout: this.options.rest?.requestTimeout ?? REST_DEFAULT_OPTIONS.requestTimeout,
      userAgent: this.options.rest?.userAgent ?? REST_DEFAULT_OPTIONS.userAgent,
      retries: this.options.rest?.retries ?? REST_DEFAULT_OPTIONS.retries,
      retryWait: this.options.rest?.retryWait ?? REST_DEFAULT_OPTIONS.retryWait,
      api: Object.assign({}, REST_DEFAULT_OPTIONS.api, { auth: `Bot ${this.token}` }, this.options.rest?.api),
      cdn: Object.assign({}, REST_DEFAULT_OPTIONS.cdn, this.options.rest?.cdn),
      limits: Object.assign({}, REST_DEFAULT_OPTIONS.limits, this.options.rest?.limits)
    }
  }

  protected override get getInternals(): RestApplicationInternals<ApplicationStack> {
    return this.internals
  }
}
