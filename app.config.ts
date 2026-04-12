export default {
  name: "neuro-scan-app",
  experiments: {
    typedRoutes: true,
  },
  extra: {
    api: process.env.EXPO_PUBLIC_API_URL,
  }
}
