
var fs = require('fs')
var sections = require('markdown-sections')
var opts     = require('optimist').argv
//var jsup     = require('jsup')
var exec     = require('child_process').exec


var readme = fs.readdirSync('./')
  .filter(function (name) {
    return /^readme\.(md|markdown)$/.test(name.toLowerCase())
  })
  .shift()

var text = fs.readFileSync(readme, 'utf-8')

var a = sections(text)

function findLast (array, test) {
  var i = null
  //find the stability section
  array.forEach(function (v, j) {
    if(test(v, j))
      i = j
  })

  return i
}

var i = findLast(a, function (section, j) {
    return /^#\s*stability/.test(section.toLowerCase())
  })

var stability = opts._[0]
var levels = [
  'Depreciated', 'Experimental', 'Unstable', 'Stable', 'Frozen', 'Locked'
]

var descriptions = require('./levels.json')

var k = stability && findLast(levels, function (level) {
  return level.toLowerCase().indexOf(stability.toLowerCase()) === 0
})

if(k == null) {
  console.error('expected: stability LEVEL')
  console.error('where LEVEL is one of:')
  console.error(levels)
  process.exit(1)
}

a.splice(
  i == null ? 1 : i,
  i == null ? 0 : 1, 
  [ '# Stability',
    '',
    levels[k] + ': ' + descriptions[levels[k]],
    ''
  ].join('\n')
)

var newText = a.join('\n')

var p = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

p.stability = levels[k].toLowerCase()
p = JSON.stringify(p, false, 2)

if(opts.dry) {
  console.log(newText)
  if(opts.package)
    console.log(p)
  return
}

if(opts.package)
  fs.writeFileSync('./package.json', p)

if(opts.readme)
  fs.writeFileSync(readme, newText)

if(opts.commit)
  exec('git commit ' + readme + ' package.json -m "Stability: ' + levels[k] + '"')

