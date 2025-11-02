# Degrees of Separation

This project is a passion project founded in my interest in the Stanley Milgram's [Small World Experiments](https://en.wikipedia.org/wiki/Six_degrees_of_separation) and research suggesting that human society is a small-world network.

While I am not a sociologist or involved in those fields, I thought this was very interesting and wanted to see if I could create my own (very non-scientific) representation of this.

The vision was a webapp where users could self-identify themselves by inputting a name and adding connections to their own "node"

As (I nagged and convinced) more people to visit the page and add names, the data would eventually form a network of interconnected names. While this would most likely not reveal any interesting patterns, it was a fun and interesting way to visualize social connections. I predict that the graph the connections will eventually make will be pretty non-cyclical.

Since the webapp would (by nature of me making it) only really be available to my own social connections, my name will most likely become a pretty major hub since the first "batch" of users would be connected to me directly, and the graphs would only extend more than 1 degree from my own name if the people I give the information on the website to also give it to other people (which would be ideal but less likely)


Functions of the project working:


- ✅ API endpoints for adding and deleting nodes and links
- ✅ User 'login' for self identifying before adding connections
- ✅ User input form for adding new connections
- ❔ Secondary identification form for names to prevent edge case where 2 people with the same name exist

Changelog:

- 10-30-25 - Working early version given to friends for testing

- 11-2-25 - Added name autocomplete and ability to edit nodes by clicking




### Api endpoints:
`/api/nodes/id`  [GET/POST/DEL]

`/api/nodes/[John Smith]` [GET/PUT/DELETE] (Slug)

`/api/links/id`  [GET/POST/DEL]