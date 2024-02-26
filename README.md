# The Tolerance Carousel

The tolerance carousel was developed to work with Polis. In our case, we self-hosted a [fork](https://github.com/Simon-Dirks/polis_tolerance-carousel) of Polis on a VPS.

The back-end manages the states of the tolerance carousel rooms. Clients connect to the back-end using a WebSocket.

A password for the back-end can be set using a `.env` file.

On the big screen, videos will be played at `https://[YOUR_DOMAIN_NAME]/video/room_XXX`, with XXX being your room number (e.g., 1).

On participant smartphones, the (embedded) Polis interface can be accessed at `https://[YOUR_DOMAIN_NAME]/share-perspective/room_XXX`.

Polis IDs and room states can be managed from `https://[YOUR_DOMAIN_NAME]/admin`.

We use Caddy to serve the front-end, back-end and Polis from separate subdomains.

![participant-flow](https://github.com/tolerance-carousel/tolerance-carousel/assets/2639851/4590dc06-d5a4-41d6-ba9f-d651d3957e34)
