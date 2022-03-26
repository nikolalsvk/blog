#!/bin/bash

npm run build # build Gatsby
npm run build-view-counter # build view-counter function
rm -rf .cache/functions # Try to fix 404 pages returning an error
