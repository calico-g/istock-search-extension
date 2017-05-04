For public read-only and anonymous resources, such as getting image info, looking up user comments, etc. all you need to do is send an authorization header with your client_id in your requests. This also works if you'd like to upload images anonymously (without the image being tied to an account), or if you'd like to create an anonymous album. This lets us know which application is accessing the API.

Authorization: Client-ID YOUR_CLIENT_ID

Client ID:

002c0c50951a58d

Client secret:

2b687ff477708aa973726dca83fbaa6314cb69fa


https://api.imgur.com/oauth2