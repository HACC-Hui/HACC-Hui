# Pull base Node image. Be sure that this Node version matches that of the Meteor bundle.
FROM node:12.16.1

# Create and set working directory for the container
WORKDIR /hacchui

# Copy all files in current directory into container's /hacchui directory.
# Since this Dockerfile is intended to be used by the docker-build.sh script,
# this effectively copies the generated Meteor app bundle into the container.
COPY . /hacchui

# Install the Meteor application's packages.
# Note that the cd is temporary here and reverts back to WORKDIR after the
# RUN is complete, not dissimilar to a subshell invocation.
RUN cd /hacchui/programs/server && npm install --unsafe-perm

EXPOSE 80

EXPOSE 8888

EXPOSE 3100

CMD ["node", "main.js"]
