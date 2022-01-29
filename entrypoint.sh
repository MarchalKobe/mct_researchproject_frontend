#!/bin/sh

# Recreate config file
rm -rf ./src/env-config.js
touch ./src/env-config.js

# Add assignment
echo "window._env_ = {" >> ./src/env-config.js

echo $(printenv)
# Read each line in .env file
# Each line represents key=value pairs
for line in $(printenv)
do
    # Split env variables by character `=`
    if printf '%s\n' "$line" | grep -q -e '='; then
        varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
        varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
    fi
    # Read value of current variable if exists as Environment variable
    # value=$(printf '%s\n' "${!varname}")
    # Otherwise use value from .env file

    # Append configuration property to JS file
    echo "  $varname: \"$varvalue\"," >> ./src/env-config.js
done
echo "}" >> ./src/env-config.js

nginx -g "daemon off;"
