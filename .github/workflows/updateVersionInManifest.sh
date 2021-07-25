#!/bin/bash

contents="$(jq --arg v "$1" '.version = $v' manifest.json)" && echo "${contents}" > manifest.json
