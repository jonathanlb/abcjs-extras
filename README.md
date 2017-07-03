# abcjs-extras
This libary provides manipulations for use in front of [abcjs music notation rendering](https://raw.githubusercontent.com/paulrosen/abcjs).

## Motivation
There are many libraries supporting [abc notation](http://abcnotation.com/), but few support manipulation in the browser independent of server support.
abcjs-extras provides functionality to make simple abc manipulations using only web content, say from files served by a lightweight webserver in absence of an additional network connection.

## Requirements
- A simple web server, e.g. [kWS on Android](https://play.google.com/store/apps/details?id=org.xeustechnologies.android.kws) or [python -m http.server 8000](https://docs.python.org/3/library/http.server.html)
- [abcjs basic](https://github.com/paulrosen/abcjs), e.g. downloaded for local access.

Check out the [example for viola transposition](https://github.com/jonathanlb/abcjs-extras/blob/master/examples/joy-of-my-life.html).

## Todo
- Improve NPM and Javascript module functionality.
- Provide non-octave transposition.

## Similar Previous Work
- [Jens Wollschlager's Transposer](http://trillian.mit.edu/~jc/music/abc/mirror/8ung.at/abctransposer/) 
- [Transposing at trillian](http://abcnotation.com/tunePage?a=trillian.mit.edu/~jc/music/abc/test/Transposing/0000)
