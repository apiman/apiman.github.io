#!/bin/bash
curl -s -L https://api.github.com/repos/apiman/apiman/releases | jq -r '.[0]'
