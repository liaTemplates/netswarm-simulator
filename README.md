<!--
author:   André Dietrich & Sebastian Zug

email:    andre.dietrich@ovgu.de

version:  0.0.1

language: en

narrator: US English Female

comment:  A Arduino-Simulator template for JavaScript based on NetSwarm.

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


[NetSwarm](https://github.com/wvengen/netswarm-arduino)


# `@NetSwarm.single_loop`

```cpp
void setup() {
  Serial.println("Hello setup.");
}

void loop() {
  Serial.println("Hello loop.");
}
```
@NetSwarm.single_loop


# `@NetSwarm.sloop`

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
