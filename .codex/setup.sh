#!/bin/bash
set -xe

# Install dependencies and capture output to a log file
npm ci > setup.log 2>&1
