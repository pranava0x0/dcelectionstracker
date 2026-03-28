/**
 * Navigation type definitions.
 */

export type RootStackParamList = {
  Dashboard: undefined;
  PlatformDetail: {
    eventId: number;
    platform: string;
  };
};
