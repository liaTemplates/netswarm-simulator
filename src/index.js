import Compiler from './compiler.js'

window.Compiler = function(output= {}) {
    return new Compiler(output);
}
