/** Delay in execution of Rest requests (TTFB) (the implementation may vary depending on the provider) */
export interface ApplicationRestLatency {
  /** average delay in 5 minutes */
  fiveMinAvg: number
  /** average delay in 1 minute */
  oneMinAvg: number
  /** average delay in 10 seconds */
  tenSecAvg: number
  /** average delay in 1 second */
  perSecAvg: number
  /** latest request delay */
  latest: number
}

/** Rest load */
export interface ApplicationRestLoad {
  /** requests completed in the last 5 minutes */
  fiveMin: number
  /** requests completed in the last 1 minute */
  oneMin: number
  /** requests completed in the last 10 seconds */
  tenSec: number
  /** requests completed in the last 1 second */
  perSec: number
  /** requests completed in the current second */
  now: number
}

/** Information about Rest limits */
export interface ApplicationRestLimits {
  /** how many requests is left before reaching the invalid request limit */
  irl: number
  /** how many requests is left before reaching the global rate limit */
  grl: number
}

/** Rest application that contains useful info/methods */
export interface ApplicationRest {
  /** Whether Rest is blocked for sending requests */
  locked: boolean
  /** Delay in execution of Rest requests (TTFB) (the implementation may vary depending on the provider) */
  latency: ApplicationRestLatency
  /** Rest load */
  load: ApplicationRestLoad
  /** Information about Rest limits */
  limits: ApplicationRestLimits
}