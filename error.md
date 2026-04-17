00:37:32.452 Running build in Washington, D.C., USA (East) – iad1
00:37:32.452 Build machine configuration: 4 cores, 8 GB
00:37:32.565 Cloning github.com/MohRifai/moneytalks (Branch: main, Commit: 5d2c471)
00:37:32.565 Previous build caches not available.
00:37:32.754 Cloning completed: 189.000ms
00:37:32.978 Running "vercel build"
00:37:33.603 Vercel CLI 51.6.1
00:37:33.840 Installing dependencies...
00:37:35.572 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
00:37:35.859 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
00:37:36.645 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
00:37:36.689 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
00:37:36.704 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
00:37:37.332 npm warn deprecated glob@10.3.10: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
00:37:38.408 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
00:37:42.062 npm warn deprecated next@14.2.15: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.
00:37:42.256 
00:37:42.257 added 343 packages in 8s
00:37:42.257 
00:37:42.257 141 packages are looking for funding
00:37:42.257   run `npm fund` for details
00:37:42.307 Detected Next.js version: 14.2.15
00:37:42.311 Running "npm run build"
00:37:42.409 
00:37:42.410 > moneytalks@0.1.0 build
00:37:42.410 > next build
00:37:42.410 
00:37:42.899 Attention: Next.js now collects completely anonymous telemetry regarding usage.
00:37:42.899 This information is used to shape Next.js' roadmap and prioritize features.
00:37:42.900 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
00:37:42.900 https://nextjs.org/telemetry
00:37:42.900 
00:37:42.949   ▲ Next.js 14.2.15
00:37:42.949 
00:37:42.963    Creating an optimized production build ...
00:37:51.668  ✓ Compiled successfully
00:37:51.669    Linting and checking validity of types ...
00:37:54.405 
00:37:54.405 Failed to compile.
00:37:54.405 
00:37:54.405 ./src/app/debts/page.tsx
00:37:54.405 8:36  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.405 9:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.405 33:29  Error: 'userId' is defined but never used.  @typescript-eslint/no-unused-vars
00:37:54.406 67:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 
00:37:54.406 ./src/app/login/page.tsx
00:37:54.406 30:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 
00:37:54.406 ./src/app/page.tsx
00:37:54.406 8:36  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 9:42  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 12:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 13:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 
00:37:54.406 ./src/app/transactions/page.tsx
00:37:54.406 8:36  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 9:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 34:36  Error: 'userId' is defined but never used.  @typescript-eslint/no-unused-vars
00:37:54.406 92:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
00:37:54.406 
00:37:54.406 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
00:37:54.425 Error: Command "npm run build" exited with 1