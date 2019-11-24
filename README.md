<!--
author:   André Dietrich & Sebastian Zug

email:    LiaScript@web.de

version:  0.0.2

language: en

narrator: US English Female

logo:     https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Arduino-uno-perspective.jpg/1280px-Arduino-uno-perspective.jpg

comment:  A Arduino-Simulator template for JavaScript based on NetSwarm, which
          can be included into your course to make Arduino-code snippets
          executeable.

script:   https://cdn.jsdelivr.net/gh/LiaTemplates/netswarm-simulator/dist/index.js

@onload
window.stopper = {}
@end

@NetSwarm.single_loop
<script>
let output = ""
let comp = window.Compiler(
  {stdio: {
    write: s => {
      if (s == '\n') {
        console.log(output)
        output = ""
      }
      else {
        output += s
      }},
    drain: () => {},
  }}
)

let error = comp.compile(`@input`)
if(!error) {
  try{
    comp.setup()
    comp.load('loop');
    comp.run();
  } catch (e) {
    console.error("something went wrong, plz check your code...")
  }
  "LIA: stop"
} else {
  var errorMsg = new LiaError("line:"+error.line+"\n"+error.message, 1);
  errorMsg.add_detail(0, error.message, "error", error.line-1,error.column);
  throw errorMsg ;
}

</script>

@end

@NetSwarm.loop: @NetSwarm.run_(@uid,@input)

@NetSwarm.run_
<script>
send.handle("stop",  (e) => {window.stopper['@0'] = true});
window.stopper['@0'] = false;

let output = ""

function step(comp) {
  if(!window.stopper['@0']) {
    setTimeout(function(e){
      try {
        comp.load('loop');
        comp.run();
        step(comp);
      } catch(e) {
        console.error("something went wrong, plz check your code...")
        send.lia("LIA: stop");
      }
    }, 100);
  }
}

let comp = window.Compiler(
  {stdio: {
    write: s => {
      if (s == '\n') {
        console.log(output)
        output = ""
      }
      else {
        output += s
      }
    },
    drain: () => {},
  }}
)

let error = comp.compile(`@1`)
if(!error) {
  window.stopper['@0'] = false;
  comp.setup()
  step(comp);
  "LIA: terminal"
} else {
  var errorMsg = new LiaError("line:"+error.line+"\n"+error.message, 1);
  errorMsg.add_detail(0, error.message, "error", error.line-1,error.column);
  throw errorMsg ;
}

</script>

@end

attribute: Thanx to [wvengen](https://github.com/wvengen/netswarm-arduino) for
           the original implementation of NetSwarm.

-->

# NetSwarm-Simulator

                         --{{0}}--
This document defines some basic macros for applying the JavaScript Arduino
interpreter [NetSwarm](https://github.com/wvengen/netswarm-arduino) in
[LiaScript](https://LiaScript.github.io) to make Arduino programs in Markdown
executeable and editable.

__Try it on LiaScript:__

https://liascript.github.io/course/?https://raw.githubusercontent.com/liaTemplates/netswarm-simulator/master/README.md

__See the project on Github:__

https://github.com/liaTemplates/netswarm-simulator

                         --{{1}}--

There are three ways to use this template. The easiest way is to use the
`import` statement and the url of the raw text-file of the master branch or any
other branch or version. But you can also copy the required functionality
directly into the header of your Markdown document, see therefor the
[last slide](#implementation). And of course, you could also clone this project
and change it, as you wish.

    {{1}}
1. Load the macros via

   `import: https://raw.githubusercontent.com/liaTemplates/netswarm-simulator/master/README.md`

2. Copy the definitions into your Project

3. Clone this repository on GitHub


## `@NetSwarm.single_loop`


                         --{{0}}--
If you want to execute the loop only once, use `@NetSwarm.single_loop`
To use the [Tau-Prolog](http://tau-prolog.org) interpreter, two macros are
necessary. The first one is `@Tau.program`, which is called with a unique
identifier. It defines the basic Prolog-program with all rules and definitions.



```cpp
void setup() {
  Serial.println("Hello setup.");
}

void loop() {
  Serial.println("Hello loop.");
}
```
@NetSwarm.single_loop


## `@NetSwarm.sloop`

```cpp
void setup() {
  Serial.println("Hello stuff.");
}

void thing(char i) {
  switch(i) {
  case 0: Serial.println("a pear"); break;
  case 1: Serial.println("an apple"); break;
  case 2: Serial.println("an elephant"); break;
  case 3: Serial.println("an arduino"); break;
  }
}

void loop() {
  Serial.print("here's ");
  thing(random(4));
}
```
@NetSwarm.loop


## Implementation
