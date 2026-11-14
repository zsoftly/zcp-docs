# Static site image. The Caddyfile is not in the image: the chart mounts it at
# /etc/caddy/Caddyfile, so configuration changes never ride with a release.
FROM caddy:2.11.4-alpine@sha256:6aeddd44c3078b0f9a35206472a11420648a79c184603ef95957d0a20044cb2b

# The upstream binary carries a file capability to bind low ports. A pod that
# drops all capabilities cannot start it, and the site listens on 8080, so the
# copy below leaves the capability behind.
RUN cp /usr/bin/caddy /usr/bin/caddy.plain \
    && mv /usr/bin/caddy.plain /usr/bin/caddy \
    && rm -f /etc/caddy/Caddyfile

COPY dist/ /srv/

ENV XDG_CONFIG_HOME=/tmp/caddy/config \
    XDG_DATA_HOME=/tmp/caddy/data

USER 65532:65532
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
