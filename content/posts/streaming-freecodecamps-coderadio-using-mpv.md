---
author: "Yaksh Bariya"
title: "Streaming FreeCodeCamp's Coderadio using mpv"
description: "Read how I managed to stream FreeCodeCamp's Coderadio using mpv on the terminal"
tags: ["freecodecamp", "music", "linux", "terminal", "mpv", "coderadio", "programming", "coding"]
publishdate: "2022-09-19T12:30:00+05:30"
---

# Motivation

Who doesn't like to be cool on the internet and amongst other developer friends? Anyone? Everyone like to flex their skills. Isn't it? It's much more cool to listen 24x7 to Lofi on the terminal, whereas your friends may be stuck on ads every now and then. Besides looking cool, having a browser open for streaming music isn't a good deal. Browsers are way too bloates especially if you're low on resources.

# Hacking the stream URL

Before actually streaming CodeRadio from the terminal you need to have the stream URLs, which can be easily fetched if you know the correct place to look for. I started by downloading the raw HTML for the website using `curl`:

```bash
curl https://coderadio.freecodecamp.org/ -Lo coderadio.html
```

Upon investigating the XML, I found out that the site was most probably a React application. I quickly got the link to the main JS file loaded in by the HTML.

```bash
bash https://coderadio.freecodecamp.org/static/js/min.5eb7bc98.js -Lo coderadio.js
```

The JavaScript was highly obfuscated and minified so I prettified it using `clang-format`.

```bash
clang-format -i coderadio.js
```

Besides formatting the code with `clang-format`  a part of it was still obfuscated, which was strange. I didn't use something like Prettier as it would most probably have got Out Of Memory Killed by the kernel, and also Node.js is too slow in comparision to native. Running `clang-format` worked magically somehow

Now the JavaScript was atleast readible. I looked for all sorts of URLs encoded in the JS, and finally got the websocket which gave the URLs of the streams and also the relay streams along with the list of songs in playlist:

```js
        }(t.PureComponent),
        Oa = new (St())(
            "wss://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio"),
```

Now I just had to somehow try to conmect to the websocket. Fortunately for me, I was able to fetch the API with just HTTP(S), probably because initially websockets are initialed with http requests only.

Here's the raw JSON (stripped version):

```json
{
   "cache" : "event",
   "is_online" : true,
   "listeners" : {
      "current" : 45,
      "total" : 45,
      "unique" : 45
   },
   "live" : {
      "broadcast_start" : null,
      "is_live" : false,
      "streamer_name" : ""
   },
   "now_playing" : {
      "duration" : 179,
      "elapsed" : 115,
      "is_request" : false,
      "played_at" : 1663564407,
      "playlist" : "default",
      "remaining" : 64,
      "sh_id" : 584950,
      "song" : {
         "album" : "Night Light",
         "art" : "https://coderadio-admin.freecodecamp.org/api/station/2/art/7681f2a146fcf71bf36b23cd-1586028052.jpg",
         "artist" : "The Cancel",
         "custom_fields" : [],
         "genre" : "",
         "id" : "dad6680f4b224857d418c0812677c7b7",
         "lyrics" : "",
         "text" : "The Cancel - O.N.E.",
         "title" : "O.N.E."
      },
      "streamer" : ""
   },
   "playing_next" : {
      "cued_at" : 1663564534,
      "duration" : 110,
      "is_request" : false,
      "playlist" : "default",
      "song" : {
         "album" : "Alone Journey",
         "art" : "https://coderadio-admin.freecodecamp.org/api/station/2/art/478f49a995584b4125696edd-1586028052.jpg",
         "artist" : "Blazo",
         "custom_fields" : [],
         "genre" : "",
         "id" : "c828c83f107543f59abbfd76ac30ffa2",
         "lyrics" : "",
         "text" : "Blazo - Little Piano",
         "title" : "Little Piano"
      }
   },
   "song_history" : [
      {
         "duration" : 328,
         "is_request" : false,
         "played_at" : 1663564082,
         "playlist" : "default",
         "sh_id" : 584949,
         "song" : {
            "album" : "Love Journey",
            "art" : "https://coderadio-admin.freecodecamp.org/api/station/2/art/a060ebcb06756d64b0544725-1586028052.jpg",
            "artist" : "Aso",
            "custom_fields" : [],
            "genre" : "",
            "id" : "f4ac57dcc1a126ce2fd55a12b90c482c",
            "lyrics" : "",
            "text" : "Aso - Summer Nights",
            "title" : "Summer Nights"
         },
         "streamer" : ""
      },
      ...
   ],
   "station" : {
      "backend" : "liquidsoap",
      "description" : "",
      "frontend" : "icecast",
      "id" : 2,
      "is_public" : true,
      "listen_url" : "https://coderadio-admin.freecodecamp.org/radio/8010/radio.mp3",
      "mounts" : [
         {
            "bitrate" : 128,
            "format" : "mp3",
            "id" : 2,
            "is_default" : true,
            "listeners" : {
               "current" : 6,
               "total" : 6,
               "unique" : 6
            },
            "name" : "128kbps MP3",
            "path" : "/radio.mp3",
            "url" : "https://coderadio-admin.freecodecamp.org/radio/8010/radio.mp3"
         },
         {
            "bitrate" : 64,
            "format" : "mp3",
            "id" : 3,
            "is_default" : false,
            "listeners" : {
               "current" : 3,
               "total" : 3,
               "unique" : 3
            },
            "name" : "64kbps MP3",
            "path" : "/low.mp3",
            "url" : "https://coderadio-admin.freecodecamp.org/radio/8010/low.mp3"
         }
      ],
      "name" : "freeCodeCamp.org Code Radio",
      "playlist_m3u_url" : "https://coderadio-admin.freecodecamp.org/public/coderadio/playlist.m3u",
      "playlist_pls_url" : "https://coderadio-admin.freecodecamp.org/public/coderadio/playlist.pls",
      "public_player_url" : "https://coderadio-admin.freecodecamp.org/public/coderadio",
      "remotes" : [
         {
            "bitrate" : 128,
            "format" : "mp3",
            "id" : 38063,
            "listeners" : {
               "current" : 7,
               "total" : 7,
               "unique" : 7
            },
            "name" : "128kbps MP3 (New York)",
            "url" : "https://coderadio-relay-nyc.freecodecamp.org/radio/8010/radio.mp3"
         },
         {
            "bitrate" : 64,
            "format" : "mp3",
            "id" : 38064,
            "listeners" : {
               "current" : 10,
               "total" : 10,
               "unique" : 10
            },
            "name" : "64kbps MP3 (New York)",
            "url" : "https://coderadio-relay-nyc.freecodecamp.org/radio/8010/low.mp3"
         },
         ...
      ],
      "shortcode" : "coderadio",
      "url" : "https://coderadio.freecodecamp.org"
   }
}
```

Now in order to stream from the terminal all you have to do is 

```bash
mpv https://coderadio-admin.freecodecamp.org/radio/8010/radio.mp3
```

# Conclusion

Besides the main URL, the API also returns relay stream URLs, so you can use them in case you face high latency.

If it's online, everything will once be available on the terminal.

Enjoy streaming music from your Terminal!
