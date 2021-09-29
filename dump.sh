#!/bin/bash

python3  /home/sysadmin/siteCovid_/site/manage.py dumpdata --natural-primary --natural-foreign > /home/sysadmin/dump/covid/$(date +%Y-%m-%d).json