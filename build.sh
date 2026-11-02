#!/bin/bash

# On deploy previews and branch deploys, DEPLOY_PRIME_URL is that deploy's
# origin. Use it so those builds call their own functions. Production keeps
# a same-origin path.
if [ -n "${DEPLOY_PRIME_URL}" ] && [ "${CONTEXT}" != "production" ]; then
  export GATSBY_FUNCTION_HOST="${DEPLOY_PRIME_URL%/}"
fi

npm run build # build Gatsby
npm run build-view-counter # build view-counter function
rm -rf .cache/functions # Try to fix 404 pages returning an error
