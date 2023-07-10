#!/bin/bash

for env in $(<.env)
do
  export "$env"
done

envsubst < ./prometheus-data/prometheus.example.yml > ./prometheus-data/prometheus.yml