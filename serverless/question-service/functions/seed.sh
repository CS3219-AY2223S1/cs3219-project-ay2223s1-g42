#!/bin/bash

while true; do
    echo "now running request on \"$1\"";
    http -b $1
    echo "sleeping for $2 seconds";
    sleep $2
done

