import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const org = env.SENTRY_ORG?.trim();
  const project = env.SENTRY_PROJECT?.trim();
  const authToken = env.SENTRY_AUTH_TOKEN?.trim();
  // Source-map upload only when org/project/token are all set (never fail build if missing)
  const enableSentryUpload = Boolean(org && project && authToken);

  return {
    plugins: [
      react(),
      ...(enableSentryUpload
        ? [
            sentryVitePlugin({
              org,
              project,
              authToken,
              silent: true,
              telemetry: false,
              sourcemaps: {
                filesToDeleteAfterUpload: ["./dist/**/*.map"],
              },
            }),
          ]
        : []),
    ],
    build: {
      // Maps upload to Sentry then deleted when plugin is active
      sourcemap: enableSentryUpload,
    },
  };
});
